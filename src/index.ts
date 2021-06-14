#!/usr/bin/env node

import yargs from 'yargs';

yargs(process.argv.slice(2))
  .usage('Usage: $0 <command> [options]')
  .commandDir('cmds', {
    recurse: false,
    extensions: process.env.NODE_ENV === 'development' ? ['js', 'ts'] : ['js'],
  })
  .demandCommand()
  .help('h')
  .alias('h', 'help').argv;
