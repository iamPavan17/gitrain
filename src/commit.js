import { execSync } from "child_process";
import inquirer from "inquirer";
import emojiMap from "./emoji-map.js";

function getBranchName() {
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

function extractStoryDetails(branch) {
  const match = branch.match(/-(\d+)-(.+)/);
  if (!match) return { story: null, title: null };

  const story = match[1];
  const rawTitle = match[2];
  const title = rawTitle.replace(/-/g, " ");

  return { story, title };
}

function getChangedFiles() {
  const output = execSync("git status --porcelain").toString().trim();
  const files = output
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.trim().split(/\s+/).pop());
  return files;
}

async function promptCommitInfo(story, title) {
  const files = getChangedFiles();

  if (!files.length) {
    console.log("No changed files to commit.");
    process.exit(0);
  }

  const { selectedFiles } = await inquirer.prompt([
    {
      type: "checkbox",
      name: "selectedFiles",
      message: "Select files to stage:",
      choices: files,
    },
  ]);

  if (selectedFiles.length === 0) {
    console.log("No files selected. Commit cancelled.");
    process.exit(0);
  }

  const typeChoices = Object.keys(emojiMap).map((type) => ({
    name: `${emojiMap[type]} ${type}`,
    value: type,
  }));

  const { type } = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "Select commit type:",
      choices: typeChoices,
    },
  ]);

  const { body } = await inquirer.prompt([
    {
      type: "input",
      name: "body",
      message: "Detailed commit message:",
    },
  ]);

  const emoji = emojiMap[type];
  const commitTitle = story && title ? `AB#${story} ${title}` : "";
  const commitBody = `${emoji} ${type}: ${body}`;

  return { commitTitle, commitBody, selectedFiles };
}

export default async function runCommit() {
  const branch = getBranchName();
  const { story, title } = extractStoryDetails(branch);
  const { commitTitle, commitBody, selectedFiles } = await promptCommitInfo(
    story,
    title
  );

  execSync(`git add ${selectedFiles.join(" ")}`, { stdio: "inherit" });

  if (commitTitle) {
    execSync(`git commit -m "${commitTitle}" -m "${commitBody}"`, {
      stdio: "inherit",
    });
  } else {
    execSync(`git commit -m "${commitBody}"`, { stdio: "inherit" });
  }

  execSync(`git push origin ${branch}`, { stdio: "inherit" });
}
