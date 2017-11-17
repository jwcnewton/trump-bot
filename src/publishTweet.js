const sentenceHandle = require('./sentenceHandle.js');
const grammarHandle = require('./grammarHandle.js');
const twitterHandle = require('./twitterHandle.js');

let sendTweet = () => {
    sentenceHandle.generateStatement().then((sentence) => {
        grammarHandle.spellCheck(sentence).then(function(data) {
            twitterHandle.tweet(data);
        });
    });
};

exports.sendTweet = sendTweet;
exports.grammarEvents = grammarHandle.events;
exports.twitterEvents = twitterHandle.events;
