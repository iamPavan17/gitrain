import { execSync } from "child_process";

function getBranchName() {
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

// Branch name should follow: dev/<team-name>-<story-number>-<short-desc>
function extractStoryDetails(branch) {
  const match = branch.match(/-(\d+)-(.+)/);
  if (!match) return { story: null, title: null };

  const story = match[1];
  const rawTitle = match[2];
  const title = rawTitle.replace(/-/g, " ");

  return { story, title };
}

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
