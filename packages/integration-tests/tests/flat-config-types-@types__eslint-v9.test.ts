import {
  eslintIntegrationTest,
  typescriptIntegrationTest,
} from '../tools/integration-test-base';

for (const additionalFlags of [
  [],
  ['--strictNullChecks'],
  ['--strictNullChecks', '--exactOptionalPropertyTypes'],
]) {
  typescriptIntegrationTest(
    `typescript${additionalFlags.length ? ` with ${additionalFlags.join(', ')}` : ''}`,
    __filename,
    ['--allowJs', '--esModuleInterop', ...additionalFlags, 'eslint.config.js'],
    out => {
      const lines = out.split('\n').filter(
        line =>
          line &&
          // error TS18028: Private identifiers are only available when targeting ECMAScript 2015 and higher.
          // this is fine for us to ignore in this context
          !line.includes('error TS18028') &&
          // currently expected errors from @stylistic/eslint-plugin as it doesn't support ESLint v9 types yet
          !line.startsWith('node_modules/@stylistic/eslint-plugin/'),
      );

      // The types should not error (e.g. https://github.com/eslint-stylistic/eslint-stylistic/issues/276)
      expect(lines).toHaveLength(0);
    },
  );
}
eslintIntegrationTest(__filename, 'eslint.config.js');
