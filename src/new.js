
export class NewCommand {
  static command(yargs) {
    let argv = yargs
      .usage('usage: <command> [options]')
      .command('project', 'create a new project', function (yargs) {
        console.log('creating project :)')
      })
      .help('help')
      .updateStrings({
        'Commands:': 'command:'
      })
      .wrap(null)
      .argv;
  }
}