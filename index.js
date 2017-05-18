var fs = require('fs');
var csvParse = require('csv-parse');
var rita = require('rita');
var Promise = require('bluebird');
const GrammarHandle = require('./src/grammarHandle.js');
const TwitterHandle = require('./src/twitterHandle.js');

var filePath = './data/result.csv'
var inputText = "";

function queuePosts() {
    var markov = new rita.RiMarkov(3);
    setInterval(function() {
        //Additional Clean Up
        markov.loadText(inputText);
        var sentences = markov.generateSentences(1);
        sentences = sentences[0].replace(/\/(\w+)/ig, '')
        sentences.replace(/\\\//g, "/");

        new GrammarHandle(sentences).then(function(data) {
            TwitterHandle.tweet(data);
        });
    }, 13000000);
}



fs.createReadStream(filePath)
    .pipe(csvParse({ delimeter: ',' }))
    .on('data', function(row) {
        inputText = inputText + ' ' + cleanText(row[2]);
    })
    .on('end', function() {
        queuePosts();
    });

function cleanText(text) {
    return rita.RiTa.tokenize(text, ' ')
        .filter(hasNoStopWords)
        .join(' ')
        .trim();
}

function hasNoStopWords(token) {
    var stopWords = ['@', 'http', 'https', 'RT', ' ', '"', '..', '/', '//'];
    return stopWords.every(function(sw) {
        return !token.includes(sw);
    });
};