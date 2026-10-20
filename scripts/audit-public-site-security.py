#!/usr/bin/env python3
"""Read-only public DNS and HTTP security audit for sertavo.co.

Use --enforce only after the Cloudflare and mail-provider setup is validated.
Never changes DNS, site headers, email, or infrastructure.
"""
import argparse
import json
import os
import re
import subprocess
import sys
import urllib.error
import urllib.parse
import urllib.request

DOMAIN = "sertavo.co"
results = []

def check(name, status, detail):
    results.append((name, status, str(detail).replace("|", "/").replace("\n", " ")[:250]))

def headers(url):
    try:
        p = subprocess.run(
            ["curl", "--silent", "--show-error", "--head", "--max-time", "20",
             "--dump-header", "-", "--output", "/dev/null", url],
            text=True, capture_output=True, timeout=25, check=False)
        if p.returncode:
            return None, {}, (p.stderr or "curl failed").strip()
        blocks = [x for x in p.stdout.replace("\r", "").split("\n\n") if x.strip().startswith("HTTP/")]
        if not blocks:
            return None, {}, "No HTTP response headers"
        lines = blocks[-1].splitlines()
        code = int(lines[0].split()[1])
        result = {}
        for line in lines[1:]:
            if ":" in line:
                k, v = line.split(":", 1)
                result[k.strip().lower()] = v.strip()
        return code, result, ""
    except Exception as exc:
        return None, {}, str(exc)

def dns_txt(name):
    url = "https://dns.google/resolve?" + urllib.parse.urlencode(
        {"name": name, "type": "TXT"})
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Sertavo-Security-Audit/1.0"})
        with urllib.request.urlopen(req, timeout=12) as resp:
            result = json.load(resp)
        if result.get("Status") not in (0, 3):
            return None, "DNS resolver status: " + str(result.get("Status"))
        records = [item.get("data", "").replace('" "', "").replace('"', "")
                   for item in result.get("Answer", [])
                   if item.get("type") == 16]
        return records, ""
    except Exception as exc:
        return None, str(exc)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--enforce", action="store_true", help="Fail on FAIL or UNKNOWN checks")
    args = parser.parse_args()
    https_code, h, err = headers("https://" + DOMAIN)
    if https_code is None:
        check("HTTPS / certificate", "UNKNOWN", err)
    elif 200 <= https_code < 400:
        check("HTTPS / certificate", "PASS", "TLS-verified response: " + str(https_code))
    else:
        check("HTTPS / certificate", "REVIEW", "Server HTTP status: " + str(https_code))

    http_code, raw, err = headers("http://" + DOMAIN)
    if http_code is None:
        check("HTTP to HTTPS", "UNKNOWN", err)
    elif http_code in (301, 302, 307, 308) and raw.get("location", "").startswith("https://"):
        check("HTTP to HTTPS", "PASS", "Redirects to " + raw.get("location", ""))
    else:
        check("HTTP to HTTPS", "FAIL", "Status: " + str(http_code) + "; Location: " + raw.get("location", "<none>"))

    if https_code is None or https_code >= 400:
        for key in ("HSTS", "Clickjacking", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "CSP"):
            check(key, "UNKNOWN", "Could not reliably inspect a successful HTTPS response")
    else:
        hsts = h.get("strict-transport-security", "")
        check("HSTS", "PASS" if re.search(r"max-age\s*=\s*[1-9]\d*", hsts, re.I) else "FAIL", hsts or "Missing")
        csp = h.get("content-security-policy", "")
        frame = h.get("x-frame-options", "").strip().upper()
        click_ok = "frame-ancestors" in csp.lower() or frame in ("DENY", "SAMEORIGIN")
        check("Clickjacking", "PASS" if click_ok else "FAIL", "CSP frame-ancestors or X-Frame-Options: " + (frame or "<none>"))
        nosniff = h.get("x-content-type-options", "").lower()
        check("X-Content-Type-Options", "PASS" if nosniff == "nosniff" else "FAIL", nosniff or "Missing")
        referrer = h.get("referrer-policy", "")
        check("Referrer-Policy", "PASS" if referrer else "REVIEW", referrer or "Missing")
        check("Permissions-Policy", "PASS" if h.get("permissions-policy") else "REVIEW", h.get("permissions-policy", "Missing"))
        csp_report = h.get("content-security-policy-report-only", "")
        check("CSP", "PASS" if csp else ("REVIEW" if csp_report else "REVIEW"),
              "Enforced" if csp else ("Report-only" if csp_report else "Not set; stage report-only before enforcement"))

    dmarc, e = dns_txt("_dmarc." + DOMAIN)
    if dmarc is None:
        check("DMARC", "UNKNOWN", e)
    else:
        found = [t for t in dmarc if re.search(r"(^|;)\s*v=DMARC1\b", t, re.I)]
        if not found:
            check("DMARC", "FAIL", "No DMARC1 TXT record found")
        elif re.search(r"\bp=(reject|quarantine)\b", found[0], re.I):
            check("DMARC", "PASS", "Enforcement policy found; confirm sender alignment separately")
        else:
            check("DMARC", "REVIEW", "Monitoring-only or missing enforcement; validate senders before raising policy")

    txt, e = dns_txt(DOMAIN)
    if txt is None:
        check("SPF", "UNKNOWN", e)
    else:
        spf = [t for t in txt if t.lower().startswith("v=spf1")]
        check("SPF", "PASS" if len(spf) == 1 else "REVIEW",
              ("One SPF record" if len(spf) == 1 else str(len(spf)) + " SPF records; verify whether domain sends mail"))
    check("DKIM", "REVIEW", "Verify actual email provider and DKIM selector(s) from an authentic outbound message")

    heading = "## Sertavo public security audit\n\n"
    table = "| Check | Status | Evidence / next action |\n| --- | --- | --- |\n"
    table += "".join("| " + " | ".join(row) + " |\n" for row in results)
    report = heading + table + "\nReport-only: a PASS does not prove security beyond these checks.\n"
    print(report)
    if os.getenv("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as out:
            out.write(report)
    if args.enforce and any(row[1] in ("FAIL", "UNKNOWN") for row in results):
        sys.exit(1)

if __name__ == "__main__":
    main()
