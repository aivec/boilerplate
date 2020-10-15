import path from 'path';
import spawn from 'cross-spawn';
import resolveBin from 'resolve-bin';
import logger from '../logger';

export const command = 'build';
export const desc =
  'Parses "src" directory and builds all files named "App.tsx". Built files are placed in a "dist/js" folder.';
export const builder = {};
export const handler = function () {
  process.env.NODE_ENV = 'production';
  const webpackFile = path.resolve(__dirname, 'configs/webpack.config.js');
  resolveBin('webpack', function (err, bin) {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    const { status } = spawn.sync(bin, ['--config', webpackFile], {
      stdio: 'inherit',
    });
    process.exit(status);
  });
};
