import logger from '../../logger.js';
import { getPackageJson, overwritePackageJson, packageJsonExistsOrExit } from '../../utils/files.js';
import { installSave, installSaveDev } from '../../utils/npm.js';
import stylelint from '../../configs/wp-ts-react/styled-components/stylelint.json';
import scripts from '../../configs/wp-ts-react/styled-components/scripts.json';

export const styledComponents = (): void => {
  packageJsonExistsOrExit();

  try {
    logger.info('Setting up styled-components configuration...');

    const config = getPackageJson();
    config.stylelint = stylelint;
    config.scripts = { ...config.scripts, ...scripts };

    // dont backup package.json since it is already backed up
    overwritePackageJson(config, false);
    logger.info('Installing styled-components packages...');
    installSave(['styled-components']);
    installSaveDev([
      '@types/styled-components',
      'babel-plugin-styled-components',
      'stylelint',
      'stylelint-config-recommended',
      'stylelint-config-styled-components',
      'stylelint-processor-styled-components',
    ]);
    logger.info('Done.');
  } catch (err) {
    logger.error(err.message);
  }
};
