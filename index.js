/*eslint-disable */
let opbeat = require('opbeat').start();
/*eslint-enable */

const probe = require('pmx').probe();
const pmx = require('pmx');
const tweetPublished = require('./src/publishTweet.js');
const EventEmitter = require('events');
const myEmitter = new MyEmitter();

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

myEmitter.on('typo', () => {
    typoCount++;
});

myEmitter.on('newTweet', () => {
    tweetCount++;
});

pmx.action('tweet', function (reply) {
    tweetPublished.sendTweet();
    reply("Tweeted!");
});

setInterval(function () {
    tweetPublished.sendTweet();
}, 13000000);


process.on('uncaughtException', (err) => {
    opbeat.captureError(err);
});

process.on('unhandledRejection', (reason, p) => {
    opbeat.captureError(reasons);
});
