import { promises as fs } from 'fs';
import path from 'path';

import _ from 'underscore';

const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

const resolve = async ({
  file,
  links,
  options: { data, templateSettings }
}) => {
  // Force _.template to use an AsyncFunction so `await include(...)` works.
  const _Function = Function;
  Function = AsyncFunction;
  const template = _.template(file.buffer.toString(), templateSettings);
  Function = _Function;

  const dir = path.dirname(file.path);

  const createLinkedFile = async link => {
    if (link[0] === '.') link = path.relative('.', path.resolve(dir, link));
    links.push(link);
    return { buffer: await fs.readFile(link), path: link };
  };

  const include = async (link, data) =>
    resolve({
      file: await createLinkedFile(link),
      links,
      options: { data, templateSettings }
    });

  const readFile = async link => (await createLinkedFile(link)).buffer;

  return template({ include, readFile, ...data });
};

export default async ({ file, options }) => {
  const links = [];
  return {
    buffer: Buffer.from(await resolve({ file, links, options })),
    links: [].concat(file.links, links)
  };
};
