import { existsSync, readFileSync, writeFileSync } from 'fs';
import { ERR_FILE_NOT_FOUND, GenericError } from '../errors';
import logger from '../logger';
import eslintConfigJson from './configs/eslint.json';
import prettierJson from './configs/prettier.json';
import stylelintJson from './configs/stylelint.json';
import tsconfigJson from './configs/tsconfig.json';
import scripts from './configs/scripts.json';

export const command = 'init';
export const desc =
  "Adds ESlint, Stylelint, and Prettier configs and helper scripts to project's package.json. Adds tsconfig.json to project root.";
export const builder = {};
export const handler = function (): void {
  const workingdir = process.cwd();
  const packageJson = `${workingdir}/package.json`;
  if (!existsSync) {
    const err = new GenericError(
      ERR_FILE_NOT_FOUND,
      `package.json does not exist in ${workingdir}`,
    );
    logger.logErrorMessage(err);
    process.exit(1);
  }

  const config = JSON.parse(readFileSync(packageJson, 'utf8'));
  config.eslintIgnore = ['test/**/*.js'];
  config.eslintConfig = eslintConfigJson.eslintConfig;
  config.prettier = prettierJson.prettier;
  config.stylelint = stylelintJson.stylelint;
  config.scripts = { ...config.scripts, ...scripts };

  try {
    writeFileSync(packageJson, JSON.stringify(config, null, 2));
    writeFileSync(`${workingdir}/tsconfig.json`, JSON.stringify(tsconfigJson, null, 2));
    logger.info(
      `Success. ${logger.green('package.json')} at ${logger.yellow(
        packageJson,
      )} has been updated. ${logger.green('tsconfig.json')} added to project root.`,
    );
  } catch (err) {
    logger.error(err.message);
  }
};
