const userAgent = process.env.npm_config_user_agent ?? "";
const packageManager = /pnpm/.test(userAgent)
  ? "pnpm"
  : /yarn/.test(userAgent)
  ? "yarn"
  : "npm";

export const env = {
  cwd: "",
  noStylelint: false,
  packageManager
};

type envKeys = keyof typeof env;

/**
 * @name 设置变量
 */
export const setEnv = (key: envKeys, val: any) => {
  env[key] = val as never;
};

/**
 * @name 获取变量
 */
export const getEnv = (key: envKeys) => {
  return env[key];
};
