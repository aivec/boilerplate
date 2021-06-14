import { init } from '../handlers/init';

export const command = 'init';
export const desc =
  "Adds ESlint, Stylelint, and Prettier configs and helper scripts to project's package.json. Adds tsconfig.json to project root.";
export const builder = {};
export const handler = init;
