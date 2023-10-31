import { getEnv } from "./env";
import path from "path";
export const getpath = (name: string, root = getEnv("cwd") as string) => {
	return path.resolve(root, name);
};
