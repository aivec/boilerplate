export const command = 'setup <command>';
export const desc = 'Set up various boilerplate configurations';
export const builder = function (yargs) {
  return yargs.commandDir('setup');
};
export const handler = function (argv) {};
