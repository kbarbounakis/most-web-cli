
const UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

export class RandomCommand {

    static randomInt(min, max) {
        return Math.floor(Math.random()*max) + min;
    }

    static randomString(length) {
        length = length || 16;
        let chars = "abcdefghkmnopqursuvwxz2456789ABCDEFHJKLMNPQURSTUVWXYZ";
        let str = "";
        for(let i = 0; i < length; i++) {
            str += chars.substr(RandomCommand.randomInt(0, chars.length-1),1);
        }
        return str;
    }

    static  newGuid() {
        let chars = UUID_CHARS, uuid = [], i;
        // rfc4122, version 4 form
        let r;
        // rfc4122 requires these characters
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4';
    
        // Fill in random data.  At i==19 set the high bits of clock sequence as
        // per rfc4122, sec. 4.1.5
        for (i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | Math.random()*16;
                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    }

    static command(yargs) {
        return yargs
              .usage('usage: <command> [options]')
              .command('guid', 'create a random GUID string', function (yargs) {
                return RandomCommand.newGuid();
              })
              .command('string <length>', 'create a random string', function (yargs) {
                return RandomCommand.randomString(yargs.length);
              })
              .help('help')
              .updateStrings({
                'Commands:': 'command:'
              })
              .wrap(null)
              .argv;
    }

}

