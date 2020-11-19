module.exports = {
  plugins: [
    [
      '@babel/plugin-proposal-object-rest-spread',
      {
        useBuiltIns: true
      }
    ],
    // ['@babel/plugin-syntax-dynamic-import']
  ],
  presets: [['@babel/preset-env', { targets: { edge: '44' } }]]
};
