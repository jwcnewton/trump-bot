/*eslint-disable */
let opbeat = require('opbeat').start();
/*eslint-enable */

const pmx = require('pmx');
const tweetPublished = require('./src/publishTweet.js');

setInterval(function () {
    tweetPublished.sendTweet();
}, 13000000);

pmx.action('tweet', function () {
    tweetPublished.sendTweet();
});

process.on('uncaughtException', (err) => {
    opbeat.captureError(err);
});

process.on('unhandledRejection', (reason, p) => {
    opbeat.captureError(reasons);
});
