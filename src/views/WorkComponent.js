import { withAuthenticationRequired } from '@auth0/auth0-react'
import { useContext } from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { Button } from 'reactstrap'
import Loading from '../components/Loading'
import WorkProductList from '../components/product/WorkProductList'
import ClientContext from '../context/ClientContext'

const WorkComponent = () => {
  const { date, clientList } = useContext(ClientContext)
  const [client, setClient] = useState(null)
  const history = useHistory()
  useEffect(() => {
    async function fetchData() {
      const formData = await fetch(
        `http://green-rest.us-east-1.elasticbeanstalk.com/clients/next?date=${date}`,
        {
          method: 'GET',
          redirect: 'follow',
        }
      )
        .then((response) => response.json())
        .catch(setClient(null))

      if (await formData) {
        setClient(await formData)
      } else {
        setClient(null)
      }
    }
    fetchData()
  }, [clientList])

  const redirect = () => {
    history.push('/explore')
  }

  return (
    <>
      {client && (
        <div className="workAreaClass">
          <h1 className="nameClient">{client.name}</h1>
          <h2>{client.comment}</h2>
          <WorkProductList data={[...client.products]} client={client} />
        </div>
      )}
      {!client && <Button onClick={redirect}>на головну</Button>}
    </>
  )
}

export default withAuthenticationRequired(WorkComponent, {
  onRedirecting: () => <Loading />,
})
