import { useState } from 'react'
import { BrowserRouter as Router,
  Routes, Route, Link,
  useParams, useNavigate,                          // useParams needed for showing a single Anecdote; useNavigate for redirection
  Navigate
 } from 'react-router-dom'                        // 7.1
 import useField from './hooks'


 const padding = {
  paddingRight: 5
}

const paddingTop = {
  paddingTop: 10
}

const Menu = () => {

  return (
    <div>
      <a href='/anecdotes' style={padding}>anecdotes</a>
      <a href='/create' style={padding}>create new</a>
      <a href='/about' style={padding}>about</a>
    </div>
  )
}

const Notification = ({ notification }) => {
  return (
  <div><em>{notification}</em></div>
  )
}

const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
      <li key={anecdote.id} >                                                               {/** 7.2 */}
        <Link to={`/anecdotes/${anecdote.id}`} > {anecdote.content} </Link >
      </li>)}
    </ul>
  </div>
)

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(a => a.id === Number(id))
  return (
    <div>
      <h2><em>"{anecdote.content}"</em></h2>
      <div>author: {anecdote.author}</div>
      <div>source/info: <a href={anecdote.info}>{anecdote.info}</a></div>
      {""}
    </div>
  )
}

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div style={paddingTop}>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  // const [content, setContent] = useState('')       // old, the standard way before 7.4 (useField custom hook)
  // const [author, setAuthor] = useState('')
  // const [info, setInfo] = useState('')

  const content = useField('text')                    // 7.4; useField custom hook
  const author = useField('text')
  const info = useField('text')

  const resetForm = () => {
    content.reset()
    author.reset()
    info.reset()
  }

  const navigate = useNavigate()                      // 7.3; useNavigate for redirection to home page after the creation of a new anecdote

  const handleSubmit = (e) => {
    e.preventDefault()
    
    props.addNew({
      content: content.attribs.value, // old was: content, author, info, but now since we're using the useField, have to write content.value, .... sigh
      author: author.attribs.value,
      info: info.attribs.value,
      votes: 0
    })

    navigate('/')                                     // 7.3
    props.setNotification(`Added new anecdote "${content.value}" by author ${author.value}`)
    setTimeout(() => props.setNotification(''),5000)
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content.attribs} />                                                                  {/* 7.4; useField */}  {/* <input name='content' value={content} onChange={(e) => setContent(e.target.value)} />*/}    {/* OLD, pre-7.4 */}
        </div>
        <div>
          author
          <input {...author.attribs} />                                                                   {/* 7.4 */}
        </div>
        <div>
          url for more info
          <input {...info.attribs} />                                                                     {/* 7.4 */}
        </div>
        <button>create</button>
        <button type='button' onClick={resetForm}> reset </button> {/** type = button -> doesn't cause Submit c: */}
      </form>
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Notification notification={notification}/>
      <Menu/>
      <Router>
        {/* <div> THESE ARE SPECIFIED IN THE Menu-component, so they won't be listed here - i.e., we already have these links in the Menu
          <Link to="/"          style={padding}>home</Link>
          <Link to="/anecdotes" style={padding}>anecdotes</Link>
          <Link to="/about"     style={padding}>about</Link>
          <Link to="/create"    style={padding}>create</Link>
        </div> */}

        <Routes>
          <Route path="/"               element={<AnecdoteList anecdotes={anecdotes}/>}> </Route>   {/** 7.1 */}
          <Route path="/anecdotes"      element={<AnecdoteList anecdotes={anecdotes}/>} />
          <Route path="/anecdotes/:id"  element={<Anecdote anecdotes={anecdotes}/>} />              {/** 7.2 */}
          <Route path="/about"          element={<About />} />
          <Route path="/create"         element={<CreateNew addNew={addNew} setNotification={setNotification}/>} />
        </Routes>
      </Router>
      <div>
        <Footer /> {/** this is always rendered, no matter what the url is */}
      </div>
    </div>
  )
}

export default App
