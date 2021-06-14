import logger from '../../logger';
import { getPackageJson, overwritePackageJson } from '../../utils/files';
import { installSave, installSaveDev } from '../../utils/npm';
import stylelintJson from '../../configs/stylelint.json';
import scripts from '../../configs/scripts.styled-components.json';

export const styledComponents = (): void => {
  try {
    const config = getPackageJson();
    config.stylelint = stylelintJson.stylelint;
    config.scripts = { ...config.scripts, ...scripts };

    overwritePackageJson(config);
    logger.info('Installing packages...');
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
