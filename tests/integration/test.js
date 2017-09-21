const {test} = require('ava');
const puppeteer = require('puppeteer');
const http = require('http');
const fs = require('fs');
const path = require('path');
const browserRequire = require('../util/require');

let server;

const SERVER_PORT = 9898;
const SERVER_URL = `http://localhost:${SERVER_PORT}/`;

const SERVER_DATE = new Date('10/20/1990');

test.before('copy getOriginTime', async () => {
    const readStream = fs.createReadStream(path.join(__dirname, '../../index.js'));
    const writeStream = fs.createWriteStream(path.join(__dirname, '../dist/getOriginTime.js'));
    readStream.pipe(writeStream);
    return new Promise(resolve => writeStream.on('finish', resolve));
});

test.before('create server', async () => {
    server = http.createServer((request, response) => {
        const streamPath = path.join(__dirname, '../dist/', request.url);
        const readStream = fs.createReadStream(streamPath);

        response.setHeader('Date', SERVER_DATE.toUTCString());
        readStream.on('error', () => {
            response.writeHead(404);
            response.end('Not Found ' + request.url);
        });
        
        readStream.pipe(response);
    });

    return new Promise((resolve) => {
        server.listen(SERVER_PORT, resolve);
    });
});

test.after('stop the file server', () => {
    server.close();
});

test.beforeEach('create the browser', async (t) => {
    t.context.browser = await puppeteer.launch({headless: false});
});

test.afterEach('close the browser', async (t) => {
    t.context.browser.close();
});

async function getPage(browser, url) {
    const page = await browser.newPage();
    page.on('console', (...args) => {
        /* eslint-disable no-console */
        console.log(url, ...args);
    });
    await page.goto(url);
    return page;
}

test('should return the servers time in GMT format', async (t) => {
    const {browser} = t.context;
    const page = await getPage(browser, SERVER_URL + '/index.html');
    //pause for inspection
    await page.evaluate(browserRequire);
    const result = await page.evaluate(() => {
        return require('/getOriginTime.js')
            .then(getOriginTime => getOriginTime());
    });
    const resultDate = new Date(result);
    t.is(resultDate.getTime(), SERVER_DATE.getTime());
});


