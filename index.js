/*eslint-disable */
let opbeat = require('opbeat').start();
/*eslint-enable */

const sentenceHandle = require('./src/sentenceHandle.js');
const grammarHandle = require('./src/grammarHandle.js');
const twitterHandle = require('./src/twitterHandle.js');

setInterval(function() {
    sentenceHandle.generateStatement().then((sentence) => {
        grammarHandle(sentence).then(function(data) {
            twitterHandle.tweet(data);
        });
    });
}, 13000000);

process.on('uncaughtException', (err) => {
    opbeat.captureError(err);
});

process.on('unhandledRejection', (reason, p) => {
    opbeat.captureError(reasons);
});
