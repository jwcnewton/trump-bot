var request = require('request');
var Promise = require('bluebird');

var bingAPIKey = process.env.BING_SPELL_API_KEY;
const bingAPI = "https://api.cognitive.microsoft.com/bing/v5.0/spellcheck/";


module.exports = function spellCheck(text) {
    return new Promise(function(resolve, reject) {
        let url = bingAPI;
        let headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            'Ocp-Apim-Subscription-Key': bingAPIKey
        };
        let form = { text: text };
        request.post({ url: url, form: form, headers: headers }, function(e, r, body) {
            let tokens = JSON.parse(body).flaggedTokens;
            if (tokens.length > 0) {
                console.log("Mistakes found");
                let replacedTokens = findAndReplaceFlaggedTokens(text, tokens);
                resolve(replacedTokens);
            } else {
                console.log("No mistakes found");
                resolve(text);
            }
        });
    });
}

function findAndReplaceFlaggedTokens(orginText, tokenizedGrammarChanges) {
    tokenizedGrammarChanges.forEach(function(tokenizedGrammarChange) {
        tokenizedGrammarChange.suggestions.sort(highestScore);
        orginText = orginText.replace(tokenizedGrammarChange.token, tokenizedGrammarChange.suggestions[0].suggestion);
    }, this);
    return orginText;
}

function highestScore(previousSuggestion, currentSuggestion) {
    return Math.max(previousSuggestion.score, currentSuggestion.score);
}