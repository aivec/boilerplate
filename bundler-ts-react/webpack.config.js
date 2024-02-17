const path = require("path");
const glob = require("glob");
const defaultConfig = require("@wordpress/scripts/config/webpack.config");
const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  ...defaultConfig,
  entry: () => {
    const dynamicallyBuiltPaths = glob
      .sync("./src/**/App.tsx")
      .reduce((acc, fpath) => {
        /**
         * The "[name]" placeholder in the "output" property will be replaced
         * with each key name in our "entry" object. We need to make sure the
         * keys are a path to the "index.js" file but without the actual file
         * name. This is why we replace the file name, "index.js", with a string
         */
        const entry = fpath.replace("/App.tsx", "/App").replace("./src/", "");
        /**
         * Here we start building our object by placing the "entry" variable from
         * the previous line as a key and the entire path including the file name
         * as the value
         */
        acc[entry] = fpath;
        return acc;
      }, {});
    return { ...defaultConfig.entry, ...dynamicallyBuiltPaths };
  },
  output: {
    ...defaultConfig.output,
    /**
     * Again, the "[name]" place holder will be replaced with each key in our
     * "entry" object and will name the build file "main.js"
     */
    filename: "[name].js",
    /**
     * We need to provide an absolute path to the root of our project and
     * thats exactly what this line is doing
     */
    path: path.resolve(process.cwd(), "dist/js"),
  },
  resolve: {
    ...defaultConfig.resolve,
    plugins: [
      ...(defaultConfig.resolve.plugins ? defaultConfig.resolve.plugins : []),
      new TsconfigPathsPlugin({}),
    ],
  },
};
