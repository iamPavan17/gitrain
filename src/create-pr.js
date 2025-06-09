import { execSync } from "child_process";

import { getBranchName, extractStoryDetails } from "./utils.js";

export default function runPR() {
  const branch = getBranchName();

  // Read optional --base <branch>
  const baseIndex = process.argv.indexOf("--base");
  const baseBranch = baseIndex !== -1 ? process.argv[baseIndex + 1] : "develop";

  const { story, title } = extractStoryDetails(branch);

  // Take the fallback title from the branch name if story/title is not available
  const fallbackTitle = branch.replace(/^.*\//, "").replace(/-/g, " ");
  const prTitle = story && title ? `AB#${story} ${title}` : fallbackTitle;

  try {
    execSync(
      `gh pr create --title "${prTitle}" --base ${baseBranch} --head ${branch}`,
      { stdio: "inherit" }
    );
  } catch (error) {
    console.error("❌ Failed to create PR:", error.message);
  }
}
