var Twit = require('twit')
var fs = require('fs');
var csvParse = require('csv-parse');
var rita = require('rita');

var inputText = "";

var T = new Twit({
    consumer_key: process.env.BOTBEAR_KEY,
    consumer_secret: process.env.BOTBEAR_SECRET,
    access_token: process.env.BOTBEAR_TOKEN,
    access_token_secret: process.env.BOTBEAR_TOKEN_SECRET,
    timeout_ms: 60 * 1000, // optional HTTP request timeout to apply to all requests.
});

var filePath = './data/result.csv'

var twitterData = fs.createReadStream(filePath)
    .pipe(csvParse({ delimeter: ',' }))
    .on('data', function(row) {
        inputText = inputText + ' ' + cleanText(row[2]);
    })
    .on('end', function() {
        var markov = new rita.RiMarkov(3);
        markov.loadText(inputText);
        var sentences = markov.generateSentences(1);
        newPost(sentences);
    });

function cleanText(text) {
    return rita.RiTa.tokenize(text, ' ')
        .filter(hasNoStopWords)
        .join(' ')
        .trim();
}

function hasNoStopWords(token) {
    var stopWords = ['@', 'http', 'https', 'RT', '"'];
    return stopWords.every(function(sw) {
        return !token.includes(sw);
    })
}

function newPost(text) {
    T.post('statuses/update', { status: text }, function(err, data, response) {
        if (err) {
            console.log(err);
        } else {
            console.log("Tweeted");
        }
    })
}