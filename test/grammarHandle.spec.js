const expect = require('chai').expect;
const grammarHandle = require('../src/grammarHandle');
const sinon = require('sinon');
const request = require('request');
let sandbox;

describe('grammarHandle Tests', function() {
    const testString = 'Jam';

    const testResponseWithNoChanges = {
        'flaggedTokens': [],
    };

    beforeEach(function(done) {
        this.sinon = sandbox = sinon.sandbox.create();
        this.sinon
            .stub(request, 'post')
            .yields(null, null, JSON.stringify(testResponseWithNoChanges));
        done();
    });

    afterEach(function() {
        sandbox.restore();
    });

    it('returns a promise', function() {
        // Assert
        expect(grammarHandle(testString)).to.be.a('promise');
    });

    it('grammarHandle returns string if no flaggedTokens are return',
        function(done) {
            // Act
            grammarHandle(testString).then(function(data) {
                // Assert
                expect(data).to.be.a('string');
                done();
            });
        });
});

describe('grammarHandle Tests', function() {
    const testString = 'their';
    const testResponseWithChanges = {
        'flaggedTokens': [
            {
                'offset': 11,
                'token': 'their',
                'type': 'UnknownToken',
                'suggestions': [
                    {
                        'suggestion': 'jam',
                        'score': 0.213242321434,
                    },
                    {
                        'suggestion': 'Jam',
                        'score': 0.8344434423403,
                    },
                    {
                        'suggestion': 'there',
                        'score': 0.9934532343443,
                    },
                ],
            }],
    };

    beforeEach('Stub request with changes', function(done) {
        this.sinon = sandbox = sinon.sandbox.create();
        this.sinon
            .stub(request, 'post')
            .yields(null, null, JSON.stringify(testResponseWithChanges));
        done();
    });

    afterEach(function() {
         sandbox.restore();
    });

    it('grammarHandle replaces token on highest score',
        function(done) {
            // Arrange
            let expectedText = 'there';
            let findAndReplaceFlaggedTokens = sinon.spy();
            grammarHandle.findAndReplaceFlaggedTokens
                = findAndReplaceFlaggedTokens;

            // Act
            grammarHandle(testString).then(function(data) {
                // Assert
                expect(data).to.be.a('string');
                expect(data).to.equal(expectedText);

                done();
            });
        });
});
