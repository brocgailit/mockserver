var assert = require("assert");
var testme = require("./../testme");

var res;
var req;
var fixturesDirectory = './test/fixtures';

describe('testme', function(){
    before(function() {
        res = {
            headers: null,
            status:  null,
            body:    null,
            writeHead: function(status, headers) {
                this.status  = status;
                this.headers = headers;
            },
            end: function(body) {
                this.body = body;
            }
        };

        req = {
            url:    null,
            method: null
        }
    });
    describe('testme()', function(){
        it('should return a valid response', function(){
            req.url    = '/test';
            req.method = 'GET';
            testme(fixturesDirectory)(req, res);

            assert.equal(res.body, 'Welcome!');
            assert.equal(res.status, 200);
            assert.equal(JSON.stringify(res.headers), '{"Content-Type":"text"}');
        }),
       it('should return 404 if the mock does not exist', function () {
           req.url    = '/not-there';
           req.method = 'GET';
           testme(fixturesDirectory)({url: '/not-there', method: 'GET'}, res);

           assert.equal(res.body, 'Not Mocked');
           assert.equal(res.status, 404);
       }),
       it('should be able to handle trailing slashes without changing the name of the mockfile', function () {
           req.url    = '/test/';
           req.method = 'GET';
           testme(fixturesDirectory)(req, res);

           assert.equal(res.body, 'Welcome!');
           assert.equal(res.status, 200);
           assert.equal(JSON.stringify(res.headers), '{"Content-Type":"text"}');
       })
    })
});
