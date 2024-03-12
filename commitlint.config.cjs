// commitlint.config.cjs
module.exports = {
  rules: {
    'header-min-length': [2, 'always', 10], // 设定讯息标头的最小长度要大于10。
  },
  extends: ['@commitlint/config-conventional'],
}
