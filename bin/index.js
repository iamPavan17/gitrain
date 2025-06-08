#!/usr/bin/env node
import { argv } from "process";

import runPR from "../src/create-pr.js";
import runCommit from "../src/commit.js";

const command = argv[2];

if (command === "pr") {
  runPR();
} else {
  runCommit();
}
