module.exports = {
  transformers: {
    name: '.',
    options: {
      data: {
        sum: (a, b) => a + b
      },
      templateSettings: {variable: 'obj'}
    }
  }
};
