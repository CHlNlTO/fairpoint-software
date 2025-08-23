module.exports = {
  extends: [
    'next/core-web-vitals',
    'next/typescript',
  ],
  plugins: [
    'boundaries',
    '@tanstack/query',
  ],
  settings: {
    'boundaries/include': ['**/*'],
    'boundaries/elements': [
      {
        mode: 'full',
        type: 'shared',
        pattern: [
          'components/**/*',
          'lib/**/*',
          'hooks/**/*',
        ],
      },
      {
        mode: 'full',
        type: 'feature',
        capture: ['featureName'],
        pattern: ['features/*/**/*'],
      },
      {
        mode: 'full',
        type: 'app',
        capture: ['_', 'fileName'],
        pattern: ['app/**/*'],
      },
      {
        mode: 'full',
        type: 'neverImport',
        pattern: ['*', 'tasks/**/*'],
      },
    ],
  },
  rules: {
    'boundaries/no-unknown': 'error',
    'boundaries/no-unknown-files': 'error',
    'boundaries/element-types': [
      'error',
      {
        default: 'disallow',
        rules: [
          {
            from: ['shared'],
            allow: ['shared'],
          },
          {
            from: ['feature'],
            allow: [
              'shared',
              ['feature', { featureName: '${from.featureName}' }],
            ],
          },
          {
            from: ['app', 'neverImport'],
            allow: ['shared', 'feature'],
          },
          {
            from: ['app'],
            allow: [['app', { fileName: '*.css' }]],
          },
        ],
      },
    ],
    '@tanstack/query/exhaustive-deps': 'error',
    '@tanstack/query/no-rest-destructuring': 'warn',
    '@tanstack/query/stable-query-client': 'error',
  },
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/build/**',
    '**/.next/**',
    '**/coverage/**',
    '**/*.min.js',
    'components/animate-ui/**',
  ],
};
