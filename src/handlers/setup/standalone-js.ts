import logger from '../../logger';
import { getPackageJson, overwritePackageJson, packageJsonExistsOrExit } from '../../utils/files';
import { installSaveDev } from '../../utils/npm';
import prettier from '../../configs/prettier.json';
import eslint from '../../configs/standalone-js/eslint.json';
import scripts from '../../configs/standalone-js/scripts.json';

export const standaloneJs = (): void => {
  packageJsonExistsOrExit();

  try {
    logger.info('Setting up standalone JS configuration...');

    const config = getPackageJson();
    config.eslintIgnore = ['test/**/*.js'];
    config.eslintConfig = eslint;
    config.prettier = prettier;
    config.scripts = { ...config.scripts, ...scripts };

    overwritePackageJson(config);
    logger.info('Installing standalone JS packages...');
    installSaveDev([
      '@babel/core@^7',
      '@babel/preset-env@^7',
      'babel-loader@^8',
      'cross-env@^7',
      'eslint@^7',
      'eslint-config-airbnb-base@^14',
      'eslint-config-prettier@^8',
      'eslint-plugin-import@^2',
      'eslint-plugin-prettier@^4',
      'glob@^7',
      'webpack@^5',
      'webpack-cli@^4',
    ]);
    logger.info('Done.');
  } catch (err) {
    logger.error(err.message);
  }
};
