import inquirer from "inquirer";
import { execSync } from "child_process";

import { defaultCommitTypes } from "./constants.js";
import { getBranchName, getChangedFiles, loadConfig } from "./utils.js";

async function promptCommitInfo() {
  const files = getChangedFiles();

  if (!files.length) {
    console.log("⚠️ No changed files to commit.");
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
    console.log("❌ No files selected. Commit process has been cancelled.");
    process.exit(0);
  }

  const config = loadConfig();
  const commitTypes = config?.commitTypes || defaultCommitTypes;
  const useEmoji = config?.useEmoji !== false;

  const typeChoices = Object.keys(commitTypes).map((type) => ({
    name: useEmoji && commitTypes[type] ? `${commitTypes[type]} ${type}` : type,
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

  const emoji = useEmoji ? commitTypes[type] || "" : "";
  const prefix = emoji ? `${emoji} ${type}` : type;
  const commitMessage = `${prefix}: ${body}`;

  return { commitMessage, selectedFiles };
}

export default async function runCommit() {
  const branch = getBranchName();
  const { commitMessage, selectedFiles } = await promptCommitInfo();

  execSync(`git add ${selectedFiles.join(" ")}`, { stdio: "inherit" });
  execSync(`git commit -m "${commitMessage}"`, { stdio: "inherit" });
  execSync(`git push origin ${branch}`, { stdio: "inherit" });
}
