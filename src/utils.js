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

function getChangedFiles() {
  const output = execSync("git status --porcelain").toString().trim();
  const files = output
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => line.trim().split(/\s+/).pop());
  return files;
}

export { getBranchName, extractStoryDetails, getChangedFiles };
