import { withAuthenticationRequired } from '@auth0/auth0-react'
import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import Loading from '../components/Loading'
import EditProductList from '../components/product/EditProductList'

const Client = (props) => {
  const id = props.match.params.id
  const [client, setClient] = useState(null)

  useEffect(() => {
    fetch(`http://green-rest.us-east-1.elasticbeanstalk.com/clients/${id}`, {
      method: 'GET',
      redirect: 'follow',
    })
      .then((response) => response.json())
      .then((data) => setClient(data))
  }, [])

  return (
    <div>
      {client && <h1>{client.name}</h1>}
      {client && <h2>{client.comment}</h2>}
      {client && (
        <EditProductList data={[...client.products]} client={client.id} />
      )}
    </div>
  )
}

export default withAuthenticationRequired(Client, {
  onRedirecting: () => <Loading />,
})
