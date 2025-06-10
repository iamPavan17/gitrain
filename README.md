# gitrain

A CLI tool for emoji-powered commits and automated GitHub pull request creation, with built-in support for including `AB#123` (Azure Boards) or `JIRA-123` references in PR titles.

This helps teams if following merge policies that require story identifiers in pull requests, ensuring proper linkage to work items in systems like **Azure DevOps** or **Jira**.

## ✨ Features

- Select files to stage
- Create commits like `✨ feat: add validation`
- Auto-push to current branch
- Generate PRs with titles like `AB#123456 add validation` or `JIRA-123 add validation`

## 🚀 Installation

Install globally via npm to use `gitrain` from anywhere:

```bash
npm install -g gitrain
```

## 🛠 Usage

### Commit

```bash
gitrain
```

![Commit Demo](https://res.cloudinary.com/dx5l2vnnu/image/upload/v1749569900/commit_xftt0r.gif)

### Create PR

```bash
gitrain pr                     # Creates a PR to 'develop' (default) with title like: AB#123456 add login
gitrain pr --base main         # Creates PR to 'main' branch
gitrain pr --tracker jira      # PR title format: JIRA-123 add login
gitrain pr --base release --tracker jira  # Customize both base branch and title format
```

This command auto-generates a pull request title from your branch name using the embedded story number.
It’s built to cut down on manual effort when using tools like Azure DevOps and Jira, ensuring PR titles include:

- AB#123456 → for Azure Boards (required for merge policies)
- JIRA-123 → for Jira integrations

![PR Demo](https://res.cloudinary.com/dx5l2vnnu/image/upload/v1749569900/pr_i7fvaw.gif)

⚠️ Requires [GitHub CLI (`gh`)](https://cli.github.com) and `gh auth login` to use `gitrain pr`.

## 🌿 Branch Format

```
dev/<team>-<story-number>-<desc>
```

Example:

```
dev/ui-123456-add-login
```

→ PR title becomes: AB#123456 add login or JIRA-123456 add login (based on --tracker)

---
