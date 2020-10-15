import path from 'path';
import spawn from 'cross-spawn';
import resolveBin from 'resolve-bin';
import logger from '../logger';

export const command = 'build-dev [options]';
export const desc = 'Runs "build" with source-map generation.';
export const builder = function (yargs) {
  return yargs.option('webpack-bundle-analyzer', {
    describe:
      'Enables visualization for the size of webpack output files with an interactive zoomable treemap.',
  });
};
export const handler = function (argv) {
  console.log('build-dev called', argv);

  process.env.NODE_ENV = 'development';
  if (argv.webpackBundleAnalyzer) {
    process.env.WP_BUNDLE_ANALYZER = 'true';
  }
  const webpackFile = path.resolve(__dirname, 'configs/webpack.config.js');
  console.log(webpackFile);
  resolveBin('webpack', function (err, bin) {
    console.log(bin);
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
