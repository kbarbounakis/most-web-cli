/**
 * Created by Kyriakos Barbounakis<k.barbounakis@gmail.com> on 7/12/2014.
 */
module.exports.invoke = function(options, callback) {
    try {
        var format = options.format || 'string', size=options.size || 16;
        if (format==='int') {
            console.log('Random Integer: ' + randomInt(1000, 10000000));
        }
        else if (format==='hex') {
            var buffer = new Buffer(randomString(options.size));
            console.log('Random Hex String: ' + buffer.toString('hex'));
        }
        else if ((format==='guid') || (format==='uuid')) {
            console.log('Random GUID String: ' + (format==='guid' ? newGuid() : newGuid().toLowerCase()));
        }
        else {
            console.log('Random String: ' + randomString(options.size))
        }
    }
    catch (e) {

    }
};

var UUID_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
/**
 * @returns {string}
 */
function newGuid() {
    var chars = UUID_CHARS, uuid = [], i;
    // rfc4122, version 4 form
    var r;
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
};

function randomString(length) {

    length = length || 16;
    var chars = "abcdefghkmnopqursuvwxz2456789ABCDEFHJKLMNPQURSTUVWXYZ";
    var str = "";
    for(var i = 0; i < length; i++) {
        str += chars.substr(randomInt(0, chars.length-1),1);
    }
    return str;
}

function randomInt(min, max) {
    return Math.floor(Math.random()*max) + min;
}