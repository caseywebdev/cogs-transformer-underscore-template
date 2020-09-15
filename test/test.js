import helper from 'cogs-test-helper';

export default helper.createTests({
  'test/config.js': {
    'test/input.txt': helper.getFileBuffer('test/output.txt'),
    'test/error.txt': Error
  }
});
