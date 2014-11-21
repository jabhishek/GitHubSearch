exports.config = {
    seleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities : {
        browserName : 'chrome',
        'chromeOptions': {
            args: ['--test-type']
        }
    },
    baseUrl: 'http://localhost:' + (process.env.PORT || '9000'),
    specs: ['tests/e2e/**/*e2e.spec.js']
};