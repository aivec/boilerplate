import {
  packageJsonExistsOrExit,
  getPackageJson,
  getWorkingDirPath,
  overwritePackageJson,
  overwriteJsonFile,
} from '../utils/files';
import { installSaveDev } from '../utils/npm';
import logger from '../logger';
import eslintConfigJson from '../configs/eslint.json';
import prettierJson from '../configs/prettier.json';
import tsconfigJson from '../configs/tsconfig.json';
import scripts from '../configs/scripts.json';

export const init = (): void => {
  packageJsonExistsOrExit();

  try {
    const config = getPackageJson();
    config.eslintIgnore = ['test/**/*.js'];
    config.eslintConfig = eslintConfigJson.eslintConfig;
    config.prettier = prettierJson.prettier;
    config.scripts = { ...config.scripts, ...scripts };

    overwritePackageJson(config);
    overwriteJsonFile(`${getWorkingDirPath()}/tsconfig.json`, tsconfigJson);
    logger.info('Installing packages...');
    installSaveDev([
      // typescript and lib types
      'typescript',
      '@types/react',
      '@types/react-dom',
      // install eslint and extensions/plugins
      'eslint',
      'eslint-config-airbnb-typescript',
      'eslint-config-prettier',
      'eslint-import-resolver-typescript',
      'eslint-plugin-import',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      // for build scripts
      '@wordpress/scripts',
    ]);
    logger.info('Done.');
  } catch (err) {
    logger.error(err.message);
  }
};
