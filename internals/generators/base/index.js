/**
 * Base Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

module.exports = {
  description: 'Add a base component',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
      validate: (value) => {
        if ((/.+/).test(value)) {
          return componentExists(value) ? 'A component or container with this name already exists' : true;
        }

        return 'The name is required';
      },
    },
  ],
  actions: () => {
    // Generate index.js and index.test.js
    const baseTemplate = './base/stateless.js.hbs';

    const actions = [{
      type: 'add',
      path: '../../app/base/{{properCase name}}/index.js',
      templateFile: baseTemplate,
      abortOnFail: true,
    }, {
      type: 'add',
      path: '../../app/base/{{properCase name}}/tests/index.test.js',
      templateFile: './base/test.js.hbs',
      abortOnFail: true,
    }];

    return actions;
  },
};