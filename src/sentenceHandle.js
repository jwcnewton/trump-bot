const fs = require('fs');
const csvParse = require('csv-parse');
const rita = require('rita');
const filePath = '././data/result.csv';

let markov = new rita.RiMarkov(3);
let inputText = null;

let sentenceHandle = () => {
    return new Promise(function(resolve, reject) {
        if (inputText != null) {
            resolve(generateSentence());
        } else {
            parseCSV.then(() => {
                resolve(generateSentence());
            });
        };
    });
};

let generateSentence = () => {
    let sentence = markov.generateSentences(2)[0];

    while (sentence.length > 140) {
        console.log('----  over  ----');
        sentence = markov.generateSentences(2)[0];
    }
    // Additional Clean Up
    sentence = sentence.replace(/\/(\w+)/ig, '');
    sentence.replace(/\\\//g, '/');

    return sentence;
};

let parseCSV = new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
        .pipe(csvParse({delimeter: ','}))
        .on('data', function(row) {
            inputText = inputText + ' ' + cleanText(row[2]);
        })
        .on('end', function() {
            markov.loadText(inputText);
            resolve();
        });
});

let cleanText = (text) => {
    return rita.RiTa.tokenize(text, ' ')
        .filter(hasNoStopWords)
        .join(' ')
        .trim();
};

let hasNoStopWords = (token) => {
    let stopWords = ['@', 'http', 'https', 'RT', ' ', '"', '..', '/', '//'];
    return stopWords.every(function(sw) {
        return !token.includes(sw);
    });
};

exports.generateStatement = sentenceHandle;
