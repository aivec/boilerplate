import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import path from 'path';
import { ERR_FILE_NOT_FOUND, GenericError } from '../errors.js';
import logger from '../logger.js';

export const getWorkingDirPath = (): string => process.cwd();

export const getPackageJsonPath = (): string => `${getWorkingDirPath()}/package.json`;

export const getPackageJson = (): { [key: string]: any } =>
  JSON.parse(readFileSync(getPackageJsonPath(), 'utf8'));

export const overwriteJsonFile = (
  fpath: string,
  config: { [key: string]: any },
  backup = true,
): void => {
  const fname = path.basename(fpath);
  let whatdo = 'updated';
  if (!existsSync(fpath)) {
    whatdo = 'created';
    logger.info(`${fname} does not exist. No backup required.`);
  } else if (backup) {
    copyFileSync(fpath, `${fpath}.backup`);
    logger.info(`Copied current ${logger.green(fname)} to ${logger.yellow(`${fname}.backup`)}`);
  }
  writeFileSync(fpath, JSON.stringify(config, null, 2));
  logger.info(`Success. ${logger.green(fname)} has been ${whatdo}.`);
};

export const overwritePackageJson = (config: { [key: string]: any }, backup = true): void => {
  overwriteJsonFile(getPackageJsonPath(), config, backup);
};

export const packageJsonExistsOrExit = (): void => {
  if (path.basename(process.cwd()) === 'boilerplate') {
    process.exit(0);
  }

  const workingdir = getWorkingDirPath();
  if (!existsSync(`${workingdir}/package.json`)) {
    const err = new GenericError(
      ERR_FILE_NOT_FOUND,
      `package.json does not exist in ${workingdir}`,
    );
    logger.logErrorMessage(err);
    process.exit(1);
  }
};
