import { useContext } from 'react'
import { useHistory } from 'react-router-dom'
import ClientContext from '../../context/ClientContext'
import './ClientList.css'

const ClientList = () => {
  const { clientList } = useContext(ClientContext)
  const history = useHistory()

  const redirectTo = (id) => {
    history.push(`/work/${id}`)
  }

  return (
    <div>
      {clientList.length > 0 &&
        clientList.map((client) => {
          return (
            <div
              key={client.id}
              onClick={redirectTo.bind(this, client.id)}
              className={`client_box color_client_${client.status}`}
            >
              {client.name}
            </div>
          )
        })}
    </div>
  )
}

export default ClientList
