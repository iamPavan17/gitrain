# gitrain

A CLI tool for emoji-powered commits and GitHub PR creation.

## Features

- Select files to stage
- Create commits like `✨ feat: add validation`
- Auto-push to branch
- Generate PRs with titles like `AB#123456 add validation`

## Installation

Install globally via npm:

```bash
npm install -g gitrain
```

## Usage

### Commit

```bash
gitrain
```

### Create PR

```bash
gitrain pr
```

⚠️ Requires GitHub CLI (`gh`) and `gh auth login`.

## Branch Format

```
dev/<team>-<story-number>-<desc>
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

## Structure

```
├── bin/index.js
├── src/utils.js
├── src/commit.js
├── src/create-pr.js
├── src/emoji-map.js
```

---
