import fs from "fs";
import path from "path";
import { execSync } from "child_process";

function getBranchName() {
  return execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
}

function extractStoryDetails(branch) {
  const match = branch.match(
    /(?:^|\/)[a-zA-Z\-]*?(\d+)(?:-([a-zA-Z0-9\-]+.*))?/
  );
  if (!match) return { story: null, title: null };

  const story = match[1];
  const rawTitle = match[2] || "";
  const title = rawTitle.replace(/-/g, " ").trim();

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

// Load .gitrainrc if available
function loadConfig() {
  const configPath = path.resolve(process.cwd(), ".gitrainrc");
  if (fs.existsSync(configPath)) {
    try {
      return JSON.parse(fs.readFileSync(configPath, "utf-8"));
    } catch {
      console.warn("⚠️ Failed to parse .gitrainrc — using defaults.");
      return {};
    }
  }
}

export { getBranchName, extractStoryDetails, getChangedFiles, loadConfig };
