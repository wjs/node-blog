import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import store from './store'

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>

      </Provider>
    );
  }
}

export default App
