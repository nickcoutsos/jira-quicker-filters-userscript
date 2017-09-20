import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import App from './app'
import reducer from './reducer'

const store = createStore(reducer, {})
const app = document.createElement('app')

app.id = 'app'
document.body.appendChild(app)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  app
)
