import {
  packageJsonExistsOrExit,
  getPackageJson,
  getWorkingDirPath,
  overwritePackageJson,
  overwriteJsonFile,
} from '../../utils/files.js';
import { installSave, installSaveDev } from '../../utils/npm.js';
import logger from '../../logger.js';
import eslintConfig from '../../configs/wp-ts-react/eslint.json';
import scripts from '../../configs/wp-ts-react/scripts.json';
import prettier from '../../configs/prettier.json';
import tsconfigJson from '../../configs/tsconfig.json';
import { styledComponents } from './styled-components.js';

export const wpTsReact = ({ wsc }: { wsc?: boolean }): void => {
  packageJsonExistsOrExit();

  try {
    logger.info('Setting up WordPress TypeScript React configuration...');

    const config = getPackageJson();
    config.eslintIgnore = ['test/**/*.js'];
    config.eslintConfig = eslintConfig;
    config.prettier = prettier;
    config.scripts = { ...config.scripts, ...scripts };

    overwritePackageJson(config);
    overwriteJsonFile(`${getWorkingDirPath()}/tsconfig.json`, tsconfigJson);
    logger.info('Installing WordPress TypeScript React packages...');
    installSave(['@types/react@^17', '@types/react-dom@^17']);
    installSaveDev([
      // for build scripts
      '@wordpress/scripts@^19',
      'cross-env@^7',
      // eslint and extensions/plugins
      'eslint@^7',
      'eslint-config-airbnb@^19',
      'eslint-config-airbnb-typescript@^15',
      'eslint-config-prettier@^8',
      'eslint-import-resolver-typescript@^2',
      'eslint-plugin-import@^2',
      'eslint-plugin-jsx-a11y@^6',
      'eslint-plugin-prettier@^4',
      'eslint-plugin-react@^7',
      'eslint-plugin-react-hooks@^4',
      '@typescript-eslint/eslint-plugin@^5',
      '@typescript-eslint/parser@^5',
      // typescript
      'typescript@^4',
    ]);

    logger.info('Done.');
    if (wsc === true) {
      logger.line();
      styledComponents();
    }
  } catch (err) {
    logger.error(err.message);
  }
};
