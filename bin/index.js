#!/usr/bin/env node
import { argv } from "process";

import runInit from "../src/init.js";
import runPR from "../src/create-pr.js";
import runCommit from "../src/commit.js";

const command = argv[2];

switch (command) {
  case "pr":
    await runPR();
    break;
  case "init":
    await runInit();
    break;
  default:
    await runCommit();
}
