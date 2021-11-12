const path = require('path');
const glob = require('glob');
const defaultConfig = require('@wordpress/scripts/config/webpack.config');

const isProduction = process.env.NODE_ENV === 'production';

let index = 0;
if (!isProduction) {
  index = 1;
}

// removes CleanWebpackPlugin plugin
defaultConfig.plugins.shift();

defaultConfig.module.rules[index].test = /\.(ts|js)x?$/;

module.exports = {
  ...defaultConfig,
  entry: () => {
    const dynamicallyBuiltPaths = glob.sync('./src/**/App.tsx').reduce((acc, path) => {
      /**
       * The "[name]" placeholder in the "output" property will be replaced
       * with each key name in our "entry" object. We need to make sure the
       * keys are a path to the "index.js" file but without the actual file
       * name. This is why we replace the file name, "index.js", with a string
       */
      const entry = path.replace('/App.tsx', '/App').replace('./src/', '');
      /**
       * Here we start building our object by placing the "entry" variable from
       * the previous line as a key and the entire path including the file name
       * as the value
       */
      acc[entry] = path;
      return acc;
    }, {})
    return dynamicallyBuiltPaths;
  },
  output: {
    ...defaultConfig.output,
    /**
     * Again, the "[name]" place holder will be replaced with each key in our
     * "entry" object and will name the build file "main.js"
     */
    filename: 'js/[name].js',
    /**
     * We need to provide an absolute path to the root of our project and
     * thats exactly what this line is doing
     */
    path: path.resolve(process.cwd(), 'dist'),
  },
  resolve: {
    ...defaultConfig.resolve,
    alias: {
      ...defaultConfig.resolve.alias,
      src: path.resolve(process.cwd(), 'src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
};
