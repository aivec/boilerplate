const path = require('path');
const glob = require('glob');

const isdev = process.env.NODE_ENV === 'development';

const jsglob = '**/*.js';
const jsignore = [
  'vendor/**',
  'dist/**',
  'assets/**',
  'node_modules/**',
  'webpack.config.js',
  'gulpfile.js',
];

const entrypaths = glob
  .sync(jsglob, {
    ignore: jsignore,
  })
  .reduce((acc, match) => {
    const resolvedpath = `./${match}`;
    acc[match] = resolvedpath;
    return acc;
  }, {});

module.exports = {
  mode: isdev ? 'development' : 'production',
  entry: entrypaths,
  output: {
    filename: '[name]',
    path: path.resolve(process.cwd(), 'dist/js'),
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
          },
        },
      },
    ],
  },
};
