#!/usr/bin/env node

import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .command(
    'build',
    'Parses "src" directory and builds all files named "App.tsx". Built files are placed in a "dist/js" folder.',
  )
  .example('$0 build', 'Transpiles React source files into JS')
  .alias('f', 'file')
  .nargs('f', 1)
  .describe('f', 'Load a file')
  .demandOption(['f'])
  .help('h')
  .alias('h', 'help').argv;
