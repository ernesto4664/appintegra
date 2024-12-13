module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb'],
  rules: {
    'max-len': ['error', { code: 500 }],
    'no-console': 'off', // Permitir console.log en cualquier entorno
    'no-debugger': 'off', // process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-cycle': 0,
    'linebreak-style': 0,
  },

  parserOptions: {
    parser: 'babel-eslint',
  },
};
