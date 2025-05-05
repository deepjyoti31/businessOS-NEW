# Contributing to BusinessOS

Thank you for your interest in contributing to BusinessOS! This document provides guidelines and instructions for contributing to this open-source project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Development Environment](#development-environment)
  - [Finding Issues to Work On](#finding-issues-to-work-on)
- [Development Workflow](#development-workflow)
  - [Branching Strategy](#branching-strategy)
  - [Commit Messages](#commit-messages)
  - [Pull Requests](#pull-requests)
  - [Code Review Process](#code-review-process)
- [Coding Standards](#coding-standards)
  - [Frontend (React/TypeScript)](#frontend-reacttypescript)
  - [Backend (Python/FastAPI)](#backend-pythonfastapi)
  - [Documentation](#documentation)
- [Testing](#testing)
  - [Frontend Tests](#frontend-tests)
  - [Backend Tests](#backend-tests)
- [Documentation](#documentation-1)
- [Community](#community)
- [License](#license)

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

## Getting Started

### Development Environment

Before you start contributing, make sure you have set up your development environment:

1. Fork the repository on GitHub
2. Clone your fork locally
3. Follow the installation instructions in the [README.md](README.md) and [INSTALLATION.md](INSTALLATION.md) files

### Finding Issues to Work On

- Check the [Issues](https://github.com/yourusername/businessOS/issues) tab for open issues
- Look for issues labeled `good first issue` if you're new to the project
- If you want to work on something that doesn't have an issue yet, create one first to discuss it with the maintainers

## Development Workflow

### Branching Strategy

We use a simplified Git workflow:

- `main` - The main branch containing the latest stable code
- Feature branches - Created from `main` for new features or bug fixes

To start working on a new feature or bug fix:

```bash
# Ensure you're on the main branch
git checkout main

# Pull the latest changes
git pull origin main

# Create a new branch for your feature or bug fix
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for commit messages:

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

Types include:
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code changes that neither fix bugs nor add features
- `test`: Adding or updating tests
- `chore`: Changes to the build process or auxiliary tools

Examples:
```
feat(documents): add document sharing functionality
fix(auth): resolve login redirect issue
docs(readme): update installation instructions
```

### Pull Requests

When you're ready to submit your changes:

1. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

2. Create a Pull Request (PR) from your fork to the main repository
3. Fill in the PR template with all required information
4. Link any related issues in the PR description using keywords like "Fixes #123" or "Relates to #456"

### Code Review Process

All PRs will be reviewed by at least one maintainer. The review process ensures:

- Code quality and adherence to standards
- Proper test coverage
- Documentation updates where necessary
- Compatibility with the project's goals

Reviewers may request changes before merging. Please address these promptly.

## Coding Standards

### Frontend (React/TypeScript)

- Follow the [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/) for best practices
- Use functional components with hooks instead of class components
- Use TypeScript for type safety
- Follow the existing project structure
- Use the UI component library consistently
- Write meaningful component and function names
- Add JSDoc comments for complex functions

### Backend (Python/FastAPI)

- Follow [PEP 8](https://www.python.org/dev/peps/pep-0008/) style guide
- Use type hints for function parameters and return values
- Document functions and classes with docstrings
- Use async/await for asynchronous operations
- Follow the existing project structure
- Write meaningful function and class names

### Documentation

- Keep documentation up-to-date with code changes
- Use clear, concise language
- Include examples where appropriate
- Update the README.md when adding new features or changing existing ones

## Testing

### Frontend Tests

We use Jest and React Testing Library for frontend tests:

```bash
# Run frontend tests
cd frontend/business-flow-canvas-suite-main
npm test
```

When adding new features, please include appropriate tests:
- Unit tests for utility functions
- Component tests for UI components
- Integration tests for complex features

### Backend Tests

We use pytest for backend tests:

```bash
# Run backend tests
cd backend
pytest
```

When adding new features, please include appropriate tests:
- Unit tests for utility functions
- API tests for endpoints
- Integration tests for complex features

## Documentation

Good documentation is crucial for the project's success. Please:

- Document all public APIs, functions, and components
- Update existing documentation when changing functionality
- Add examples and use cases where appropriate
- Use clear, concise language

## Community

Join our community to discuss the project, get help, or share ideas:

- [GitHub Discussions](https://github.com/yourusername/businessOS/discussions)
- [Discord Server](https://discord.gg/yourdiscord)
- [Community Forum](https://forum.yourdomain.com)

## License

By contributing to BusinessOS, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).

---

Thank you for contributing to BusinessOS! Your efforts help make this project better for everyone.
