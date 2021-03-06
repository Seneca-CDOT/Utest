const { printResponse } = require('./result');
const chalk = require('chalk');

const originalConsoleLogFn = global.console.log;
const originalConsoleErrorFn = global.console.error;

describe('printResponse tests', () => {
  let logOutput = null;
  let errorOutput = null;

  function testLogFn(...args) {
    logOutput = logOutput || [];
    args.forEach((arg) => logOutput.push(arg));
  }

  function testErrorFn(...args) {
    errorOutput = errorOutput || [];
    args.forEach((arg) => errorOutput.push(arg));
  }

  function finalize(output) {
    if (output && Array.isArray(output)) {
      return output.join('');
    }
    return output;
  }

  beforeEach(() => {
    global.console.log = testLogFn;
    global.console.error = testErrorFn;

    logOutput = null;
    errorOutput = null;
  });

  afterEach(() => {
    global.console.log = originalConsoleLogFn;
    global.console.error = originalConsoleErrorFn;

    logOutput = null;
    errorOutput = null;
  });
  test('url with status 200 prints in green', async () => {
    const urlList = [{ url: 'http://google.ca', status: '200' }];
    printResponse(urlList);
    const expected = chalk.green.bold(`[GOOD] Status: [200] http://google.ca`);

    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status 400 prints in red', async () => {
    const urlList = [{ url: 'http://google.ca', status: '400' }];
    printResponse(urlList);
    const expected = chalk.red.bold(`[BAD] Status: [400] http://google.ca`);

    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status 404 prints in red', async () => {
    const urlList = [{ url: 'http://google.ca', status: '404' }];
    printResponse(urlList);
    const expected = chalk.red.bold(`[BAD] Status: [404] http://google.ca`);

    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status UNKNOWN prints in grey', async () => {
    const urlList = [{ url: 'http://google.ca', status: 'UNKNOWN' }];
    printResponse(urlList);
    const expected = chalk.grey.bold(`[UNKNOWN] Status: [UNKNOWN] http://google.ca`);

    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('url with status 500 prints in grey', async () => {
    const urlList = [{ url: 'http://google.ca', status: '500' }];
    printResponse(urlList);
    const expected = chalk.grey.bold(`[UNKNOWN] Status: [500] http://google.ca`);

    expect(finalize(logOutput)).toEqual(expected);
    expect(finalize(errorOutput)).toBe(null);
  });
  test('pass empty urlList object should not print', async () => {
    const urlList = [];
    printResponse(urlList);
    expect(finalize(logOutput)).toEqual(null);
    expect(finalize(errorOutput)).toBe(null);
  });
});
