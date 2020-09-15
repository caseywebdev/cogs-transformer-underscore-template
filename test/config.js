export default {
  transformers: {
    name: 'index.js',
    options: {
      data: {
        sum: (a, b) => a + b
      },
      templateSettings: { variable: 'obj' }
    }
  }
};
