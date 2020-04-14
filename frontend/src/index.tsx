import React from 'react'
import ReactDOM from 'react-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from 'styled-components'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { faIcons } from './lib/fa'
import { theme } from './lib/theme'
import App from './components/App'
import GlobalStyles from './lib/globalStyles'
import store from './store'

library.add(...faIcons)

ReactDOM.render(
  <BrowserRouter>
    <ReduxStoreProvider store={store}>
      <GlobalStyles />
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ReduxStoreProvider>
  </BrowserRouter>,
  document.getElementById('root'),
)
