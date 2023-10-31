#!/usr/bin/env node

import cac from "cac";
import render from "./utils/render";
import { setEnv } from "./utils/env";
import { version } from "../package.json";
import { debugError } from "./utils/debug";

const cli = cac("pure-norm");
cli
  .command("")
  .option("-s, --noStylelint", "不使用 stylelint")
  .action(async cmd => {
    const cwd = process.cwd();
    setEnv("cwd", cwd);
    cmd.noStylelint && setEnv("noStylelint", cmd.noStylelint);

    const init = async () => {
      try {
        render();
      } catch (error) {
        debugError(error);
      }
    };

    init();
  });

cli.help();
cli.version(version);
cli.parse();
