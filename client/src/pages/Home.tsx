import {FormEventHandler, useEffect, useState} from 'react'
import axios from 'axios'

interface Fibs {
  [key: number]: number
}

interface SeenIndex {
  number: number
}

const fetchValues = async (): Promise<Fibs> => {
  try {
    const { data } = await axios.get('/api/values/current')
    return data.values
  } catch (e) {
    console.log(e)
    return {}
  }
}

const fetchIndexes = async (): Promise<SeenIndex[]> => {
  try {
    const { data } = await axios.get('/api/values/all')
    return data
  } catch (e) {
    console.log(e)
    return []
  }
}

const Home = () => {
  const [indexesSeen, setIndexesSeen] = useState<SeenIndex[]>([])
  const[values, setValues] = useState<Fibs>({})
  const [index, setIndex] = useState('')

  useEffect(() => {
    (async () => {
      setValues(await fetchValues())
      setIndexesSeen(await fetchIndexes())
    })()

  }, [])

  const renderValues = () => {
    if (Object.keys(values).length === 0) return (<p>No values calculated</p>)
    return Object.keys(values).map(k => (
      <p key={k}>For index {k} I calculated {values[+k]}</p>
    ))
  }

  const renderSeenIndexes = () => {
    return indexesSeen.map(({number}) => number).join(', ')
  }

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post('/api/values', {
        index
      })
      console.log(data)
      setIndex('')
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          <input type='number' value={index} onChange={(e) => setIndex(e.target.value)}/>
        </label>
        <button type='submit'>Calculate</button>
      </form>
      <h2>Indices I have seen</h2>
      <p>{renderSeenIndexes()}</p>
      <h2>Calculated Values:</h2>
      {renderValues()}
    </div>
  )
}

export default Home