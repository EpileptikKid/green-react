import React from 'react'
import { Button, ButtonGroup, Col, Row } from 'reactstrap'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import Loading from '../components/Loading'
import ClientList from '../components/client/ClientList'
import { useContext } from 'react'
import ClientContext from '../context/ClientContext'
import { useHistory } from 'react-router-dom'

export const ExternalApiComponent = () => {
  const history = useHistory()
  const { setClientList, setDate, clientList } = useContext(ClientContext)
  const callApi = async (calendar) => {
    try {
      const data = await fetch(
        `http://green-rest.us-east-1.elasticbeanstalk.com/clients/name?date=${calendar}`
      ).then((response) => response.json())
      await setClientList(data)
    } catch (error) {
      console.log(error)
    }
    setDate(calendar)
  }

  const getStart = () => {
    history.push('/work')
  }

  return (
    <>
      <div className="mb-5">
        <Row>
          <Col>
            <h1>Перейти до збірки на:</h1>
          </Col>
          <Col>
            <ButtonGroup className="my-2" size="lg">
              <Button outline onClick={callApi.bind(this, 'today')}>
                сьогодні
              </Button>
              <Button outline onClick={callApi.bind(this, 'tomorrow')}>
                Завтра
              </Button>
              <Button outline onClick={callApi.bind(this, 'after-tomorrow')}>
                Післязавтра
              </Button>
            </ButtonGroup>
          </Col>
        </Row>
      </div>
      <ClientList />
      {clientList.length > 0 && (
        <div className="startButton">
          <Button size="lg" onClick={getStart}>
            <h1>Почати збірку</h1>
          </Button>
        </div>
      )}
    </>
  )
}

export default withAuthenticationRequired(ExternalApiComponent, {
  onRedirecting: () => <Loading />,
})
