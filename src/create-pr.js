import { execSync } from "child_process";

import { getBranchName, extractStoryDetails } from "./utils.js";

export default function runPR() {
  const branch = getBranchName();
  const { story, title } = extractStoryDetails(branch);
  // Take the fallback title from the branch name if story or title is not available
  const fallbackTitle = branch.replace(/^.*\//, "").replace(/-/g, " ");
  const prTitle = story && title ? `AB#${story} ${title}` : fallbackTitle;

  try {
    execSync(`gh pr create --title "${prTitle}" --head ${branch}`, {
      stdio: "inherit",
    });
  } catch (error) {
    console.error("❌ Failed to create PR:", error.message);
  }
}
