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
        else {
            console.log('Random String: ' + randomString(options.size))
        }
    }
    catch (e) {

    }
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