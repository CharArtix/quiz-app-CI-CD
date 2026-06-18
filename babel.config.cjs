module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    ['@babel/preset-react', { runtime: 'automatic' }],
  ],
  plugins: [
    // Custom inline plugin to transform `import.meta.env` to `process.env` for Jest
    function transformImportMetaEnv() {
      return {
        visitor: {
          MetaProperty(path) {
            if (path.node.meta.name === 'import' && path.node.property.name === 'meta') {
              const parent = path.parentPath;
              if (parent.isMemberExpression() && parent.node.property.name === 'env') {
                parent.replaceWith({
                  type: 'MemberExpression',
                  object: { type: 'Identifier', name: 'process' },
                  property: { type: 'Identifier', name: 'env' },
                });
              }
            }
          },
        },
      };
    },
  ],
};
