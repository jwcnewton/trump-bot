/*eslint-disable */
let opbeat = require('opbeat').start();
/* eslint-enable */
const pmx = require('pmx');
const probe = pmx.probe();
const twitterPublisher = require('./src/publishTweet.js');

let typoCount = 0;
let tweetCount = 0;

probe.metric({
    name: 'Typo Count',
    value: function() {
        return typoCount;
    },
});

probe.metric({
    name: 'Tweet Count',
    value: function() {
        return tweetCount;
    },
});

twitterPublisher.grammarEvents.on('typo', () => {
    typoCount++;
});

twitterPublisher.twitterEvents.on('newTweet', () => {
    tweetCount++;
});

pmx.action('tweet', function(reply) {
    twitterPublisher.sendTweet();
    reply('Tweeted!');
});

setInterval(function() {
    twitterPublisher.sendTweet();
}, 13000000);

process.on('uncaughtException', (err) => {
    opbeat.captureError(err);
});

process.on('unhandledRejection', (reason, p) => {
    opbeat.captureError(reason);
});
