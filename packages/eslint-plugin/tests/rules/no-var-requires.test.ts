import { RuleTester } from '@typescript-eslint/rule-tester';

import rule from '../../src/rules/no-var-requires';

const ruleTester = new RuleTester();

ruleTester.run('no-var-requires', rule, {
  valid: [
    "import foo = require('foo');",
    "require('foo');",
    "require?.('foo');",
    `
import { createRequire } from 'module';
const require = createRequire('foo');
const json = require('./some.json');
    `,
    {
      code: "const pkg = require('./package.json');",
      options: [{ allow: ['/package\\.json$'] }],
    },
    {
      code: "const pkg = require('../package.json');",
      options: [{ allow: ['/package\\.json$'] }],
    },
    {
      code: "const pkg = require('../packages/package.json');",
      options: [{ allow: ['/package\\.json$'] }],
    },
    {
      code: "const pkg = require('data.json');",
      options: [{ allow: ['\\.json$'] }],
    },
    {
      code: "const pkg = require('some-package');",
      options: [{ allow: ['^some-package$'] }],
    },
    {
      code: 'const pkg = require(`some-package`);',
      options: [{ allow: ['^some-package$'] }],
    },
  ],
  invalid: [
    {
      code: "var foo = require('foo');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: "const foo = require('foo');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: "let foo = require('foo');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: "let foo = trick(require('foo'));",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 17,
        },
      ],
    },
    {
      code: "var foo = require?.('foo');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: "const foo = require?.('foo');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: "let foo = require?.('foo');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 11,
        },
      ],
    },
    {
      code: "let foo = trick(require?.('foo'));",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 17,
        },
      ],
    },
    {
      code: "let foo = trick?.(require('foo'));",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 19,
        },
      ],
    },
    {
      code: "const foo = require('./foo.json') as Foo;",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 13,
        },
      ],
    },
    {
      code: "const foo = <Foo>require('./foo.json');",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 18,
        },
      ],
    },
    {
      code: "const foo: Foo = require('./foo.json').default;",
      errors: [
        {
          messageId: 'noVarReqs',
          line: 1,
          column: 18,
        },
      ],
    },
    {
      // https://github.com/typescript-eslint/typescript-eslint/issues/3883
      code: `
const configValidator = new Validator(require('./a.json'));
configValidator.addSchema(require('./a.json'));
      `,
      errors: [
        {
          messageId: 'noVarReqs',
          line: 2,
          column: 39,
        },
        {
          messageId: 'noVarReqs',
          line: 3,
          column: 27,
        },
      ],
    },
    {
      code: "const pkg = require('./package.json');",
      errors: [
        {
          line: 1,
          column: 13,
          messageId: 'noVarReqs',
        },
      ],
    },
    {
      code: "const pkg = require('./package.jsonc');",
      options: [{ allow: ['/package\\.json$'] }],
      errors: [
        {
          line: 1,
          column: 13,
          messageId: 'noVarReqs',
        },
      ],
    },
    {
      code: "const pkg = require('./package.json');",
      options: [{ allow: ['^some-package$'] }],
      errors: [
        {
          line: 1,
          column: 13,
          messageId: 'noVarReqs',
        },
      ],
    },
    {
      code: 'const pkg = require(`./package.json`);',
      options: [{ allow: ['^some-package$'] }],
      errors: [
        {
          line: 1,
          column: 13,
          messageId: 'noVarReqs',
        },
      ],
    },
  ],
});
