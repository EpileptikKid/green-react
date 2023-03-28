import React from 'react'
import { Router, Route, Switch } from 'react-router-dom'
import { Container } from 'reactstrap'
import Loading from './components/Loading'
import NavBar from './components/NavBar'
import Footer from './components/Footer'
import Home from './views/Home'
import Profile from './views/Profile'
import ExternalApi from './views/ExternalApi'
import { useAuth0 } from '@auth0/auth0-react'
import history from './utils/history'
import './App.css'
import initFontAwesome from './utils/initFontAwesome'
import { useState } from 'react'
import ClientContext from './context/ClientContext'
import Client from './views/Client'
import WorkComponent from './views/WorkComponent'

initFontAwesome()

const App = () => {
  const [date, setDate] = useState(null)
  const { isLoading, error } = useAuth0()
  const [clientList, setClientList] = useState([])

  if (error) {
    return <div>Oops... {error.message}</div>
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <ClientContext.Provider
      value={{ clientList, setClientList, date, setDate }}
    >
      <Router history={history}>
        <div id="app" className="d-flex flex-column h-100">
          <NavBar />
          <Container className="flex-grow-1 mt-5">
            <Switch>
              <Route path="/" exact component={Home} />
              <Route path="/profile" component={Profile} />
              <Route path="/explore" component={ExternalApi} />
              <Route path="/work/:id" component={Client} />
              <Route path="/work" component={WorkComponent} />
            </Switch>
          </Container>
          <Footer />
        </div>
      </Router>
    </ClientContext.Provider>
  )
}

export default App
