import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import { execSync } from "child_process";

import { getBranchName, extractStoryDetails } from "./utils.js";

export default async function runPR() {
  const branch = getBranchName();

  // Load .gitrainrc if available
  let config = {};
  const configPath = path.resolve(process.cwd(), ".gitrainrc");
  if (fs.existsSync(configPath)) {
    try {
      config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch {
      console.warn("⚠️ Failed to parse .gitrainrc — using defaults.");
    }
  }

  // Read optional --base <branch>
  const baseIndex = process.argv.indexOf("--base");
  const baseBranch =
    baseIndex !== -1
      ? process.argv[baseIndex + 1]
      : config.baseBranch || "develop";

  // Read optional --tracker <type>
  const trackerIndex = process.argv.indexOf("--tracker");
  const tracker =
    trackerIndex !== -1
      ? process.argv[trackerIndex + 1]
      : config.tracker || "azure";

  const trackerPrefix =
    tracker === "jira"
      ? "JIRA-"
      : tracker === "azure"
      ? "AB#"
      : config.trackerPrefix || "AB#";

  let { story, title } = extractStoryDetails(branch);

  if (!story) {
    const { inputStory } = await inquirer.prompt([
      {
        type: "input",
        name: "inputStory",
        message:
          "Story number not found from branch. Enter story number (or leave blank to skip):",
      },
    ]);
    story = inputStory || null;
  }

  // Take the fallback title from the branch name if story/title is not available
  const fallbackTitle = branch.replace(/^.*\//, "").replace(/-/g, " ");

  const prTitle = story
    ? `${trackerPrefix}${story} ${title || fallbackTitle}`
    : fallbackTitle;

  try {
    execSync(
      `gh pr create --title "${prTitle}" --base ${baseBranch} --head ${branch}`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("❌ Failed to create PR:", error.message);
  }
}
