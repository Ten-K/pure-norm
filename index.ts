#!/usr/bin/env node

import cac from "cac";
import render from "./utils/render";
import { setEnv } from "./utils/env";
import { debugError } from "./utils/debug";

const cli = cac("pure-norm");
cli.command("[root]").action(async (_root, options) => {
	const cwd = process.cwd();
	setEnv("cwd", cwd);

	const init = async (cwd: string) => {
		try {
			render(cwd);
		} catch (error) {
			debugError(error);
		}
	};

	init(cwd);
});

cli.help();
cli.version("1.0.0");
cli.parse();
