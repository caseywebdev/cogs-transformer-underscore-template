const helper = require('cogs-test-helper');

helper.run({
  'test/config.js': {
    'test/input.txt': helper.getFileBuffer('test/output.txt'),
    'test/error.txt': Error
  }
});
