const sentenceHandle = require('./sentenceHandle.js');
const grammarHandle = require('./grammarHandle.js');
const twitterHandle = require('./twitterHandle.js');

let sendTweet = () => {
    sentenceHandle.generateStatement().then((sentence) => {
        grammarHandle(sentence).then(function(data) {
            twitterHandle.tweet(data);
        });
    });
};

exports.sendTweet = sendTweet;