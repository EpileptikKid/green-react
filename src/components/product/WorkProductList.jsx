import { useAuth0 } from '@auth0/auth0-react'
import { useContext } from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { Badge, Button } from 'reactstrap'
import ClientContext from '../../context/ClientContext'
import './WorkProductList.css'

const WorkProductList = ({ data, client }) => {
  const [products, setProducts] = useState(data)

  useEffect(() => {
    setProducts(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [client])

  const [redirect, setRedirect] = useState(false)
  const { date, setClientList } = useContext(ClientContext)
  const { user } = useAuth0()
  const adress = user.email
  const json = JSON.stringify({ email: adress })

  const setNext = () => {
    let index = true
    let unit
    products.forEach((element) => {
      if (element.status === 'n' && index) {
        unit = element
        index = false
      }
    })
    index = true
    return unit
  }

  const curProd = setNext()

  const convertPack = (input) => {
    if (input === 'KILOGRAM') return 'кг'
    if (input === 'THING') return 'шт'
    if (input === 'PACK') return 'уп'
  }
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

    await fetch(
      `http://green-rest.us-east-1.elasticbeanstalk.com/products/${
        client.id
      }/${await worker.id}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(products),
        redirect: 'follow',
      }
    )

    const newData = await fetch(
      `http://green-rest.us-east-1.elasticbeanstalk.com/clients/name?date=${date}`
    ).then((response) => response.json())

    setClientList(await newData)
    await setRedirect(true)
  }

  if (redirect) {
    setRedirect(false)
    return <Redirect to="/work" />
  }
  return (
    <div className="workMonitor">
      {curProd && (
        <div className="activeProduct">
          <div className="bigName">
            {curProd.name + ' '}
            <Badge color="dark">{curProd.amount}</Badge>
            {' ' + convertPack(curProd.packing)}
          </div>
          <div className="buttonPlace">
            <Button
              className="noButton"
              color="danger"
              size="lg"
              onClick={setUndefined.bind(this, curProd.id)}
            >
              не поклав
            </Button>
            <Button
              color="success"
              size="lg"
              onClick={setComplete.bind(this, curProd.id)}
            >
              поклав
            </Button>
          </div>
        </div>
      )}
      {products.map((prod) => {
        if (curProd && prod.id !== curProd.id)
          return (
            <div
              key={prod.id}
              className={`textPlace color_text_${prod.status}`}
            >
              {prod.name + ' '}
              <Badge color="dark">{prod.amount}</Badge>
              {' ' + convertPack(prod.packing)}
            </div>
          )
        return <></>
      })}
      {!curProd && (
        <div className="nextButtonClient">
          <Button onClick={submit}>Наступний</Button>
        </div>
      )}
    </div>
  )
}

export default WorkProductList
