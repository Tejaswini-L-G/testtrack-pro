# Contributing Guidelines

Thank you for contributing to **TestTrack Pro**.

## Branch Strategy

The project follows a Git branching strategy:

- **main** → Production ready code
- **develop** → Integration branch
- **feature/** → New feature branches

Example:

feature/bug-report-module  
feature/notification-system  

---

## Development Workflow

1. Create a feature branch

git checkout -b feature/new-feature

2. Make your changes

3. Commit your code

git commit -m "Add new feature"

4. Push the branch

git push origin feature/new-feature

5. Create a Pull Request into **develop**

---

## Pull Request Rules

Before submitting a PR:

- Ensure code builds successfully
- Ensure CI pipeline passes
- Provide clear description
- Follow project structure

---

## Code Style

- Use meaningful variable names
- Write comments for complex logic
- Follow consistent formatting

---

## Reporting Issues

If you find a bug:

1. Create a GitHub Issue
2. Describe the problem
3. Provide reproduction steps
4. Attach screenshots if possible