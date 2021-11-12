import { standaloneJs } from '../../handlers/setup/standalone-js';

exports.command = 'standalone-js';
exports.desc = `Sets up a standalone JS configuration.

  Adds ESlint and Prettier configs and helper scripts to project's package.json.

  Standalone means that JS files do not import other modules. The webpack configuration will simply transpile each file separately and place them in dist/js. The path to the original JS file is preserved. For example, given a JS file at src/my/path/file.js, the transpiled file will be placed at dist/js/src/my/path/file.js.
`;
exports.builder = {};
exports.handler = standaloneJs;
