/*eslint-disable */
let opbeat = require('opbeat').start();
/*eslint-enable */

const probe = require('pmx').probe();
const pmx = require('pmx');
const twitterPublisher = require('./src/publishTweet.js');

var typoCount = 0;
var tweetCount = 0;

const typos = probe.metric({
    name: 'Typo Count',
    value: function () {
        return typoCount;
    }
});

const tweets = probe.metric({
    name: 'Tweet Count',
    value: function () {
        return tweetCount;
    }
});

twitterPublisher.grammarEvents.on('typo', () => {
    typoCount++;
});

twitterPublisher.twitterEvents.on('newTweet', () => {
    tweetCount++;
});

pmx.action('tweet', function (reply) {
    twitterPublisher.sendTweet();
    reply("Tweeted!");
});

setInterval(function () {
    twitterPublisher.sendTweet();
}, 13000000);

process.on('uncaughtException', (err) => {
    opbeat.captureError(err);
});

process.on('unhandledRejection', (reason, p) => {
    opbeat.captureError(reasons);
});
