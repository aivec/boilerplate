import path from 'path';
import spawn from 'cross-spawn';
import resolveBin from 'resolve-bin';
import { Argv } from 'yargs';
import logger from '../logger';

export const command = 'build [options]';
export const desc =
  "Parses 'src' directory and builds all files named 'App.tsx'. Built files are placed in a 'dist/js' folder.";
export const builder = function (yargs: Argv): Argv {
  return yargs
    .option('webpack-bundle-analyzer', {
      describe:
        'Enables visualization for the size of webpack output files with an interactive zoomable treemap.',
      type: 'boolean',
    })
    .option('prod', {
      describe: 'Optimize bundles for production (this is the default behavior)',
      conflicts: ['dev'],
      type: 'boolean',
    })
    .option('dev', {
      describe: 'Creates bundles with source-map generation.',
      conflicts: ['prod'],
      type: 'boolean',
    });
};
export const handler = function (argv) {
  process.env.NODE_ENV = 'production';
  if (argv.dev) {
    process.env.NODE_ENV = 'development';
  }
  if (argv.webpackBundleAnalyzer) {
    process.env.WP_BUNDLE_ANALYZER = 'true';
  }
  const webpackFile = path.resolve(__dirname, 'configs/webpack.config.js');
  resolveBin('webpack', function (err, bin) {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    spawn.sync(bin, ['--config', webpackFile], {
      stdio: 'inherit',
    });
  });
};
