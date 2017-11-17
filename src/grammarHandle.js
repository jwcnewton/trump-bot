const request = require('request');
const EventEmitter = require('events').EventEmitter;
const emitter = new EventEmitter();

const bingAPIKey = process.env.BING_SPELL_API_KEY;
const bingAPI = 'https://api.cognitive.microsoft.com/bing/v5.0/spellcheck/';
const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Ocp-Apim-Subscription-Key': bingAPIKey,
};

let spellCheck = (text) => {
    return new Promise(function(resolve, reject) {
        let form = {text: text};
        request.post({url: bingAPI, form: form, headers: headers},
            function(e, r, body) {
                let tokens = JSON.parse(body).flaggedTokens;
                if (tokens.length > 0) {
                    console.info('Mistakes found');
                    let replacedTokens =
                        findAndReplaceFlaggedTokens(text, tokens);

                    resolve(replacedTokens);
                } else {
                    console.info('No mistakes found');
                    resolve(text);
                }
            });
    });
};

let findAndReplaceFlaggedTokens = (originText, tokenizedGrammarChanges) => {
    tokenizedGrammarChanges.forEach(function(tokenizedGrammarChange) {
        emitter.emit('typo');
        tokenizedGrammarChange.suggestions.sort(highestScore);
        originText = originText.replace(tokenizedGrammarChange.token,
                    tokenizedGrammarChange.suggestions[0].suggestion);
    }, this);
    return originText;
};

let highestScore = (previousSuggestion, currentSuggestion) => {
    return currentSuggestion.score - previousSuggestion.score;
};

exports.spellCheck = spellCheck;
exports.events = emitter;
