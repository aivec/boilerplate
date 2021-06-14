import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import path from 'path';
import { ERR_FILE_NOT_FOUND, GenericError } from '../errors';
import logger from '../logger';

export const getWorkingDirPath = (): string => {
  return process.cwd();
};

export const getPackageJsonPath = (): string => {
  return `${getWorkingDirPath()}/package.json`;
};

export const getPackageJson = (): { [key: string]: any } => {
  return JSON.parse(readFileSync(getPackageJsonPath(), 'utf8'));
};

export const overwriteJsonFile = (
  fpath: string,
  config: { [key: string]: any },
  backup = true,
): void => {
  if (!existsSync(fpath)) {
    const err = new GenericError(ERR_FILE_NOT_FOUND, `${fpath} does not exist`);
    logger.logErrorMessage(err);
    process.exit(1);
  }
  if (backup) {
    copyFileSync(fpath, `${fpath}.backup`);
    logger.info(`Copied current ${logger.green(fpath)} to ${logger.yellow(`${fpath}.backup`)}`);
  }
  writeFileSync(fpath, JSON.stringify(config, null, 2));
  logger.info(`Success. ${logger.green(fpath)} has been updated.`);
};

export const overwritePackageJson = (config: { [key: string]: any }): void => {
  overwriteJsonFile(getPackageJsonPath(), config);
};

export const packageJsonExistsOrExit = (): void => {
  if (path.basename(process.cwd()) === 'wp-typescript-react') {
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
