import { useEffect, useState } from 'react'
import { Link, Route, Routes, useParams } from 'react-router-dom'
import './App.css'

function AcharyaList() {
  const [acharyas, setAcharyas] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/acharyas')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load acharyas')
        return res.json()
      })
      .then(setAcharyas)
      .catch(() => setError('Unable to load acharyas right now.'))
  }, [])

  return (
    <main className="container">
      <h1>Guruparampara</h1>
      <p className="subtitle">Sri Vaishnavite Acharya Lineage</p>
      {error ? <p>{error}</p> : null}
      <div className="card-grid">
        {acharyas.map((acharya) => (
          <Link key={acharya.id} className="acharya-card" to={`/acharya/${acharya.id}`}>
            <img src={`/${acharya.image}`} alt={acharya.name} />
            <h2>{acharya.name}</h2>
            <p>{acharya.title}</p>
            <p className="period">{acharya.period}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}

function AcharyaDetail() {
  const { id } = useParams()
  const [acharya, setAcharya] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/acharyas/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found')
        return res.json()
      })
      .then(setAcharya)
      .catch(() => setError('Details not found.'))
  }, [id])

  if (error) {
    return (
      <main className="container">
        <p>{error}</p>
        <Link to="/">← Back to lineage</Link>
      </main>
    )
  }

  if (!acharya) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="container">
      <h1>{acharya.name}</h1>
      <img src={`/${acharya.image}`} alt={acharya.name} className="detail-image" />
      <p>
        <strong>Born:</strong> {acharya.born}
      </p>
      <p>
        <strong>Birthplace:</strong> {acharya.birthplace}
      </p>
      <p>
        <strong>Period:</strong> {acharya.period}
      </p>
      <p>
        <strong>Philosophy:</strong> {acharya.philosophy}
      </p>
      <h2>Biography</h2>
      <p>{acharya.biography}</p>
      <h2>Contributions</h2>
      <ul>
        {acharya.contributions.map((contribution) => (
          <li key={contribution}>{contribution}</li>
        ))}
      </ul>
      <h2>Works</h2>
      <ul>
        {acharya.works.map((work) => (
          <li key={work}>{work}</li>
        ))}
      </ul>
      <h2>Significance</h2>
      <p>{acharya.significance}</p>
      <Link to="/">← Back to lineage</Link>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AcharyaList />} />
      <Route path="/acharya/:id" element={<AcharyaDetail />} />
    </Routes>
  )
}

export default App
