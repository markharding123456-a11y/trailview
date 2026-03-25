# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in TrailView, please report it responsibly:

1. **Do not** open a public issue
2. Email the repository owner with details
3. Include steps to reproduce the vulnerability
4. Allow reasonable time for a fix before disclosure

## Security Measures

- All API endpoints require JWT authentication for write operations
- JWT tokens are verified using HMAC-SHA256 cryptographic signatures
- Row Level Security (RLS) enforced on all database tables
- File uploads validated by extension, MIME type, and size
- Rate limiting on upload endpoints (10/hour per user)
- Content Security Policy headers on all responses
- No tracking cookies or third-party analytics
- All user data stored in Supabase with encryption at rest

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest  | Yes       |
