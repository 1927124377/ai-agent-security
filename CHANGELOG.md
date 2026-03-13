# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-03-14

### Added
- Initial release of AI Agent Security Toolkit
- Input validation script (`validate-input.js`) for Prompt Injection defense
  - Risk scoring system (0-100)
  - Detection of 8+ attack types
  - Support for Chinese and English attack patterns
  - External content marking
  - Output validation for credential leak prevention
- Skills security audit script (`audit-skills-security.js`)
  - Scans for malicious code patterns
  - Detects eval, Function constructor, child_process
  - Identifies credential access and postinstall hooks
- Credential permissions checker (`check-credentials-permissions.js`)
  - Validates 600 permission on credential files
  - Auto-fix mode with `--fix` flag
- Comprehensive documentation
  - README with quick start guide
  - Integration guide for OpenClaw/Claude Code
  - Attack patterns documentation
  - Security best practices
  - Contributing guidelines
- Attack sample library
  - 22+ Prompt Injection samples
  - Categorized by attack type
  - Expected detection results
- GitHub templates
  - Bug report template
  - Attack sample submission template
- Unit tests for validate-input.js
- MIT License

### Security
- Three-layer defense architecture (input/prompt/output)
- Risk threshold: ≥50 REJECT, 30-49 WARN, <30 ALLOW
- Credential file permission enforcement (600)
- GhostClaw malicious package detection

## Future Roadmap

### [1.1.0] - Planned
- [ ] Web interface for input testing
- [ ] Real-time security dashboard
- [ ] Slack/Discord webhook notifications
- [ ] Enhanced obfuscation detection
- [ ] More attack samples (target: 50+)

### [1.2.0] - Planned
- [ ] Machine learning-based detection
- [ ] Automated security reports
- [ ] CI/CD plugin for GitHub Actions
- [ ] npm package publication
- [ ] Multi-language support (Japanese, Spanish)

### [2.0.0] - Planned
- [ ] Sandboxed skill execution
- [ ] Automated threat intelligence feeds
- [ ] Community-driven rule sharing
- [ ] Enterprise security features

---

*Contributors: See [CONTRIBUTORS.md](CONTRIBUTORS.md)*
