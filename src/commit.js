import { execSync } from "child_process";
import inquirer from "inquirer";
import emojiMap from "./emoji-map.js";

function getBranchName() {
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

function getChangedFiles() {
  const output = execSync("git status --porcelain").toString().trim();
  const files = output
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.trim().split(/\s+/).pop());
  return files;
}

async function promptCommitInfo() {
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
    console.log("No files selected. Process cancelled!");
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
  const commitMessage = `${emoji} ${type}: ${body}`;

  return { commitMessage, selectedFiles };
}

export default async function runCommit() {
  const branch = getBranchName();
  const { commitMessage, selectedFiles } = await promptCommitInfo();

  execSync(`git add ${selectedFiles.join(" ")}`, { stdio: "inherit" });
  execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
  execSync(`git push origin ${branch}`, { stdio: "inherit" });
}
