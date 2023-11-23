const { pathsToModuleNameMapper } = require('ts-jest');

const { compilerOptions } = require('../tsconfig.json');
const config = require('../jest.config');

config.moduleNameMapper = pathsToModuleNameMapper(compilerOptions.paths, {
  prefix: '<rootDir>/..',
});
config.roots = ['../tests'];

module.exports = config;
