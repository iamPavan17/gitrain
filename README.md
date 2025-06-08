# gitrain

A CLI tool for emoji-powered semantic commits and GitHub PR creation.

## Features

- Select files to stage
- Create commits like `✨ feat: add validation`
- Auto-push to branch
- Generate PRs with titles like `AB#123456 add validation`

## Usage

### Commit

```bash
gitrain
```

### Create PR

```bash
gitrain pr
```

## Branch Format

```
dev/<team>-<story>-<desc>
```

Example:

```
dev/ui-123456-add-login
```

→ PR title: `AB#123456 add login`

## Setup

```bash
npm install
npm link / npm unlink -g
```

Requires GitHub CLI (`gh`) and `gh auth login`.

## Structure

```
├── bin/index.js
├── src/commit.js
├── src/create-pr.js
├── src/emoji-map.js
```

---

Made with ❤️ by Pavan S
