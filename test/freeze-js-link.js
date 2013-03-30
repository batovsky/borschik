var ASSERT = require('assert');

describe('techs/js-link', function() {

    var PATH = require('path');
    var FS = require('fs');
    var BORSCHIK = require('borschik');

    const fakeFile = PATH.resolve('test/js-link/test.js');
    const fakeResFile = PATH.resolve('test/js-link/_test.js');
    const freezeDir = PATH.resolve('test/js-link/_');

    afterEach(function(cb) {
        require('child_process').exec('rm -rf ' + [freezeDir, fakeFile, fakeResFile].join(' '), function() {
            cb();
        });
    });

    const TESTS = [
        // single quote
        {
            'in': "var a = borschik.link('1.png');",
            'out': 'var a = "//yandex.st/prj/_/jUK5O9GsS2gPWOhRMeBxR0GThf0.png";'
        },
        // double quote
        {
            'in': 'var a = borschik.link("1.png");',
            'out': 'var a = "//yandex.st/prj/_/jUK5O9GsS2gPWOhRMeBxR0GThf0.png";'
        },
        // inline comment
        {
            'in': '//var a = borschik.link("1.png");',
            'out': '//var a = borschik.link("1.png");'
        },
        // block comment
        {
            'in': '/*var a = borschik.link("1" + ".png");*/',
            'out': '/*var a = borschik.link("1" + ".png");*/'
        },
        // block comment with line breaks
        {
            'in': '/*\nvar e = borschik.link("1" + ".png");\n*/',
            'out': '/*\nvar e = borschik.link("1" + ".png");\n*/'
        },
        // dynamic entity 1
        {
            'in': 'var f = borschik.link("1" + ".png");',
            'out': 'var f = borschik.link("1" + ".png");'
        },
        // dynamic entity 2
        {
            'in': 'var f = borschik.link("@1.png");',
            'out': 'var f = borschik.link("@1.png");'
        }
    ];

    TESTS.forEach(function(test, i) {
        it('js-link test '+ i, function(cb) {

            // write test file
            FS.writeFileSync(fakeFile, test.in, 'utf-8');

            // proccess it
            BORSCHIK
                .api({
                    'freeze': true,
                    'input': fakeFile,
                    'minimize': true,
                    'output': fakeResFile,
                    'tech': 'lib/techs/js-link'
                })
                .then(function() {
                    try {
                        ASSERT.equal(FS.readFileSync(fakeResFile, 'utf-8'), test.out);
                        cb();
                    } catch(e) {
                        cb(e.toString());
                    }
                })
                .fail(function(e) {
                    cb(e.message);
                });
        })
    });

});
