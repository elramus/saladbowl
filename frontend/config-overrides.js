/* eslint-disable */
const rewireReactHotLoader = require('react-app-rewire-hot-loader')
const rewireStyledComponents = require('react-app-rewire-styled-components')

module.exports = function override(config, env) {
  config = rewireStyledComponents(rewireReactHotLoader(config, env))

  config.resolve.alias = {
    ...config.resolve.alias,
    'react-dom': '@hot-loader/react-dom',
  }

  return config
}
