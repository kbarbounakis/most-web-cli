import yargs from 'yargs';
import {NewCommand} from './new';
import {RandomCommand} from './random';
yargs.version()
  .usage('Usage: themost <command> [options]')
  .command('new', 'create new components', NewCommand.command)
  .command('random', 'random command', RandomCommand.command)
  .help('h')
  .alias('h', 'help')
  .argv;