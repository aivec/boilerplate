const path = require('path');
const glob = require('glob');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const LiveReloadPlugin = require('webpack-livereload-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const DependencyExtractionWebpackPlugin = require('@wordpress/dependency-extraction-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? 'production' : 'development';

const config = {
  mode,
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
    const entry = path.replace('/App.tsx', '').replace('./src/', '');
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
        use: [
          require.resolve('thread-loader'),
          {
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
        ],
        exclude: /(node_modules|dist|vendor)/,
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  plugins: [
    // The WP_BUNDLE_ANALYZER global variable enables a utility that represents
    // bundle content as a convenient interactive zoomable treemap.
    process.env.WP_BUNDLE_ANALYZER && new BundleAnalyzerPlugin(),
    // WP_LIVE_RELOAD_PORT global variable changes port on which live reload
    // works when running watch mode.
    !isProduction &&
      new LiveReloadPlugin({
        port: process.env.WP_LIVE_RELOAD_PORT || 35729,
      }),
    // WP_NO_EXTERNALS global variable controls whether scripts' assets get
    // generated, and the default externals set.
    !process.env.WP_NO_EXTERNALS && new DependencyExtractionWebpackPlugin({ injectPolyfill: true }),
  ].filter(Boolean),
  stats: {
    children: false,
  },
};

if (!isProduction) {
  // WP_DEVTOOL global variable controls how source maps are generated.
  // See: https://webpack.js.org/configuration/devtool/#devtool.
  config.devtool = process.env.WP_DEVTOOL || 'source-map';
  config.module.rules.unshift({
    test: /\.(ts)x?$/,
    exclude: [/(node_modules|dist|vendor)/],
    use: require.resolve('source-map-loader'),
    enforce: 'pre',
  });
}

module.exports = config;
