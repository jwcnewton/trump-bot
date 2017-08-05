const Twit = require('twit');
const events = require('events');
const EventEmitter = require('events').EventEmitter, 
    emitter = new EventEmitter();

const T = new Twit({
    consumer_key: process.env.BOTBEAR_KEY,
    consumer_secret: process.env.BOTBEAR_SECRET,
    access_token: process.env.BOTBEAR_TOKEN,
    access_token_secret: process.env.BOTBEAR_TOKEN_SECRET,
    timeout_ms: 60 * 1000,
    // optional HTTP request timeout to apply to all requests.
});

let publishTweet = (text) => {
    return T.post('statuses/update', {status: text},
        function(err, data, response) {
            if (err) {
                console.log(err);
            } else {
                emitter.emit('newTweet');
                console.log('Tweeted');
            }
    });
};

exports.tweet = publishTweet;
exports.events = emitter;
