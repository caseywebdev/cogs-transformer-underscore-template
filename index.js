const _ = require('underscore');
const {promisify} = require('util');
const fs = require('fs');
const path = require('npath');

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

const readFile = promisify(fs.readFile);

const resolve = async ({file, links, options: {data, templateSettings}}) => {

  // Force _.template to use an AsyncFunction so `await include(...)` works.
  const _Function = Function;
  Function = AsyncFunction;
  const template = _.template(file.buffer.toString(), templateSettings);
  Function = _Function;

  const dir = path.dirname(file.path);
  const include = async (link, data) => {
    if (link[0] === '.') link = path.relative('.', path.resolve(dir, link));
    links.push(link);
    return resolve({
      file: {buffer: await readFile(link), path: link},
      links,
      options: {data, templateSettings}
    });
  };

  return template(_.extend({include}, data));
};

module.exports = async ({file, options}) => {
  const links = [];
  return {
    buffer: Buffer.from(await resolve({file, links, options})),
    links: [].concat(file.links, links)
  };
};
