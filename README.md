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

## ✅ Options

```bash
gitrain pr [--base <branch>] [--tracker <type>]
```

| Flag      | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| --base    | Target branch for the PR (default: develop)                                        |
| --tracker | Story tracker type: azure, jira, or custom (default: azure i.e, AB#<story-number>) |

### Examples:

```
gitrain pr                         # PR to 'develop', title like: AB#123 add login
gitrain pr --base main             # PR to 'main'
gitrain pr --tracker jira          # PR title: JIRA-123 add login
gitrain pr --base release --tracker custom  # Use prefix from `.gitrainrc`
```

## 🔧 Configuration (Optional)

You can generate a local .gitrainrc file to set your preferred default tracker and baseBranch:

```bash
gitrain init
```

![gitrain init](https://res.cloudinary.com/dx5l2vnnu/image/upload/v1749824408/gitrain-init_k603lm.gif)

This will create a .gitrainrc like:

```json
{
  "tracker": "custom",
  "trackerPrefix": "RAM-",
  "baseBranch": "master"
}
```

You can still override these using CLI flags:

```bash
gitrain pr --base main --tracker jira
```

## 🌿 Branch Format

Your branch name should include a **story number** to auto-generate a proper PR title (e.g., `AB#12345` or `JIRA-123`).  
The CLI will extract the story number and a readable title from your branch.

### Supported Branch Formats

```
dev-11223-add-icons
dev/ui-123456-add-login
dev/12345-add-some-lines
dev/vikings-12345-add-button
hotfix/squad-78910-fix-header
feature/98765-fix-api-response
```

### Resulting PR Titles

- `AB#123456 add login`
- `JIRA-98765 fix api response` (if using `--tracker jira`)

If the story number is missing from the branch, `gitrain` will prompt you to enter it manually.

## 🐛 Need Help or Found a Bug?

If you run into issues, feel free to [open an issue](https://github.com/iamPavan17/gitrain/issues) on GitHub.

Whether it’s a bug report, feature request, or general question, all input is appreciated.

---
