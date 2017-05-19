const sentenceHandle = require('./src/sentenceHandle.js');
const grammarHandle = require('./src/grammarHandle.js');
const twitterHandle = require('./src/twitterHandle.js');

var opbeat = require('opbeat').start({
    appId: '55befae23a',
    organizationId: process.env.OPBEAT_ORGANIZATION_ID,
    secretToken: process.env.OPBEAT_TOKEN_SECRET
});

setInterval(function() {
    sentenceHandle.generateStatement().then((sentence) => {
        grammarHandle(sentence).then(function(data) {
            twitterHandle.tweet(data);
        });
    });
}, 13000000);