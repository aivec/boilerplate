const path = require('path');
const glob = require('glob');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');
const TerserPlugin = require('terser-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';
const devtool = !isProduction ? 'source-map' : false;

module.exports = {
  mode,
  devtool,
  /**
   * Pass Glob a relative path to each of our entry points
   * We will have different subdirectories inside of the Project directory so
   * we need to replace any of the directory names with a wildcard, **, which
   * will recursively match any combination of directory names inside of any
   * number of subdirectories until it finds the index.js entry.
   * Then we use the Array.prototype.reduce method to iterate through the array
   * and return an object containing a path to each of our entry files
   * (index.js)
   */
  entry: glob.sync('./src/**/App.tsx').reduce((acc, path) => {
    /**
     * The "[name]" placeholder in the "output" property will be replaced
     * with each key name in our "entry" object. We need to make sure the
     * keys are a path to the "index.js" file but without the actual file
     * name. This is why we replace the file name, "index.js", with a string
     */
    const entry = path.replace('/App.tsx', '').replace('/src', '');
    /**
     * Here we start building our object by placing the "entry" variable from
     * the previous line as a key and the entire path including the file name
     * as the value
     */
    acc[entry] = path;
    return acc;
  }, {}),
  output: {
    /**
     * Again, the "[name]" place holder will be replaced with each key in our
     * "entry" object and will name the build file "main.js"
     */
    filename: 'js/[name]/App.js',
    /**
     * We need to provide an absolute path to the root of our project and
     * thats exactly what this line is doing
     */
    path: path.resolve(process.cwd(), 'dist'),
  },
  resolve: {
    alias: {
      'lodash-es': 'lodash',
      src: path.resolve(process.cwd(), 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  optimization: {
    // Only concatenate modules in production, when not analyzing bundles.
    concatenateModules: mode === 'production' && !process.env.WP_BUNDLE_ANALYZER,
    splitChunks: {
      cacheGroups: {
        style: {
          test: /[\\/]style\.(sc|sa|c)ss$/,
          chunks: 'all',
          enforce: true,
          automaticNameDelimiter: '-',
        },
        default: false,
      },
    },
    minimizer: [
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: !isProduction,
        terserOptions: {
          output: {
            comments: /translators:/i,
          },
        },
        extractComments: false,
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts)x?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              [
                'babel-plugin-styled-components',
                {
                  pure: true,
                },
              ],
              '@babel/plugin-proposal-class-properties',
            ],
            presets: [
              ['@babel/preset-env', { targets: '> 0.25%, not dead' }],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
          },
        },
        exclude: /(node_modules|dist|vendor)/,
      },
    ],
  },
};
