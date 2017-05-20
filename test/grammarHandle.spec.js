const expect = require('chai').expect;
const grammarHandle = require('../src/grammarHandle');
const sinon = require('sinon');
const request = require('request');

describe('grammarHandle Tests', function() {
    const testString = 'Jam';
    // const testResponseWithChanges = {
    //     'flaggedTokens': [
    //         {
    //         'Offset': 11,
    //         'Token': 'their',
    //         'Type': 'UnknownToken',
    //         'Suggestions': [
    //             {
    //             'suggestion': 'there',
    //             'Score': 0.939427172263918,
    //             },
    //         ],
    //         }],
    // };
    const testResponseWithNoChanges = {
        'flaggedTokens': [],
    };

    before(function(done) {
        sinon
            .stub(request, 'post')
            .yields(null, null, JSON.stringify(testResponseWithNoChanges));
        done();
    });

    it('returns a promise', function() {
        expect(grammarHandle(testString)).to.be.a('promise');
    });

    it('grammarHandle returns string if no flaggedTokens are return',
        function(done) {
                grammarHandle(testString).then(function(data) {
                    expect(data).to.be.a('string');
                    done();
        });
    });
});
