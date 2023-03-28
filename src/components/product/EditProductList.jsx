import { useAuth0 } from '@auth0/auth0-react'
import { useContext, useState } from 'react'
import './EditProductList.css'
import ClientContext from '../../context/ClientContext'
import { Redirect } from 'react-router-dom'
import { Badge, Button } from 'reactstrap'

const EditProductList = ({ data, client }) => {
  const { setClientList, date } = useContext(ClientContext)
  const { user } = useAuth0()
  const adress = user.email
  const json = JSON.stringify({ email: adress })

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const [products, setProducts] = useState(data)
  const [redirect, setRedirect] = useState(false)
  const setComplete = (id) => {
    setProducts(
      products.map((obj) => {
        if (obj.id === id) {
          return { ...obj, status: 'c' }
        }
        return obj
      })
    )
  }

  const convertPack = (input) => {
    if (input === 'KILOGRAM') return 'кг'
    if (input === 'THING') return 'шт'
    if (input === 'PACK') return 'уп'
  }

  const setUndefined = (id) => {
    setProducts(
      products.map((obj) => {
        if (obj.id === id) {
          return { ...obj, status: 'u' }
        }
        return obj
      })
    )
  }

  const submit = async () => {
    let worker = {}
    await fetch(
      `http://green-rest.us-east-1.elasticbeanstalk.com/workers/worker`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        redirect: 'follow',
      }
    )
      .then((response) => response.json())
      .then((data) => (worker = data))

    console.log(worker)

    await fetch(
      `http://green-rest.us-east-1.elasticbeanstalk.com/products/${client}/${await worker.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
        redirect: 'follow',
      }
    ).then((response) => console.log(response))

    const newData = await fetch(
      `http://green-rest.us-east-1.elasticbeanstalk.com/clients/name?date=${date}`
    ).then((response) => response.json())

    setClientList(await newData)
    await setRedirect(true)
  }

  if (redirect) {
    return <Redirect to="/explore" />
  }

  return (
    <div>
      {products.map((product) => {
        return (
          <div
            key={product.id}
            className={`product_container color_${product.status}`}
          >
            <div className="textArea">
              {product.name + ' '}
              <Badge color="dark">{product.amount}</Badge>
              {' ' + convertPack(product.packing)}
            </div>
            <div className="buttonArea">
              <Button
                disabled={product.status === 'c'}
                aria-label="text"
                color="success"
                size="lg"
                onClick={setComplete.bind(this, product.id)}
              >
                <h3>поклав</h3>
              </Button>
              <Button
                disabled={product.status === 'u'}
                color="danger"
                size="lg"
                onClick={setUndefined.bind(this, product.id)}
              >
                <h3>немає</h3>
              </Button>
            </div>
          </div>
        )
      })}
      <br />
      <Button size="lg" onClick={submit}>
        <h1>Закінчити</h1>
      </Button>
    </div>
  )
}

export default EditProductList
