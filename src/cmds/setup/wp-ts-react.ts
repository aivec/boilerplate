import { wpTsReact } from '../../handlers/setup/wp-ts-react';

exports.command = 'wp-ts-react';
exports.desc = `Sets up a WordPress TypeScript React configuration

  Adds ESlint, Stylelint, and Prettier configs and helper scripts to project's package.json. Adds tsconfig.json to project root.

  Under the hood, this configuration uses the WordPress @wordpress/scripts webpack config and adds TypeScript support on top if it. Additionally, you can add styled-components with the --w-styled-components option.
`;
exports.builder = {
  'w-styled-components': {
    alias: 'wsc',
    type: 'boolean',
    describe: 'Adds support for styled-components to generated configuration',
  },
};
exports.handler = wpTsReact;
