# Sertavo Public Repository Security Boundary

This repository is a public deployment repository. It must contain only browser-delivered runtime assets and public website content.

## Never commit here
- Credentials, passwords, private keys, API secrets, webhook secrets, database connection strings, JWT signing secrets, service-role/admin keys, or access tokens.
- `.env` files or local configuration containing credentials.
- Recommendation/scoring engine source code or proprietary matching logic.
- Supabase schema, privileged SQL, internal security snapshots, or backend implementation details.
- Internal product specifications, roadmaps, operating procedures, customer lists, support exports, or private business documentation.
- Backups, temporary files, obsolete copies, development snapshots, or private test data.

## Private locations
Sensitive Sertavo material belongs in the private repository `sertavo/sertavo-backend`, including:
- `recommendation/`
- `supabase/`
- `internal/product/`
- `internal/security/`

## Public client keys
A browser publishable/anonymous key may appear in client code only when it is explicitly designed to be public and server-side authorization is enforced independently. Privileged/service-role keys are never permitted here.

## Incident rule
If a secret is ever committed, removing it in a later commit is not sufficient. Rotate/revoke the credential immediately, remove it from reachable history, and document the incident in the private security log.

## Change rule
Before adding a new public file, ask: does the browser or public website actually need this file? If not, keep it private.
