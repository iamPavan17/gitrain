import fs from "fs";
import path from "path";
import inquirer from "inquirer";

export default async function runInit() {
  console.log("Setting up gitrain configuration...");

  const { tracker } = await inquirer.prompt([
    {
      type: "list",
      name: "tracker",
      message: "Select tracker type:",
      choices: [
        { name: "Azure Boards (AB#123)", value: "azure" },
        { name: "Jira (JIRA-123)", value: "jira" },
        { name: "Other (custom prefix)", value: "custom" },
      ],
    },
  ]);

  let trackerPrefix = "AB#";
  if (tracker === "jira") trackerPrefix = "JIRA-";
  if (tracker === "custom") {
    const { customPrefix } = await inquirer.prompt([
      {
        type: "input",
        name: "customPrefix",
        message: "Enter custom tracker prefix (e.g., ABC-):",
        validate: (input) =>
          input.trim() !== "" ? true : "Prefix cannot be empty",
      },
    ]);
    trackerPrefix = customPrefix;
  }

  const { baseBranch } = await inquirer.prompt([
    {
      type: "input",
      name: "baseBranch",
      message: "Default base branch (e.g., develop, main):",
      default: "develop",
    },
  ]);

  const config = {
    tracker,
    trackerPrefix,
    baseBranch,
  };

  const filePath = path.resolve(process.cwd(), ".gitrainrc");
  fs.writeFileSync(filePath, JSON.stringify(config, null, 2));
  console.log("Configuration saved to .gitrainrc");
}
