import {
  Routes, Route, Link,
  useMatch, useNavigate
} from "react-router-dom";
import { useState } from 'react'

import { useField } from "./hooks";

const Menu = props => {
  const padding = {
    paddingRight: 5
  }
  return (
    <div>
      <div>
        <Link to="/anecdotes" style={padding}>anecdotes</Link>
        <Link to="/create" style={padding}>create new</Link>
        <Link to="/about" style={padding}>about</Link>
      </div>

      <Routes>
        <Route path="/anecdotes" element={<AnecdoteList anecdotes={props.anecdotes}/>}>anecdotes</Route>
        <Route path="/create" element={<CreateNew addNew={props.addNew} sendNotification={props.sendNotification}/>}>create new</Route>
        <Route path="/about" element={<About />}>about</Route>
        <Route path="/anecdotes/:id" element={<Anecdote anecdote={props.anecdote}/>}>about</Route>
      </Routes>
    </div>
  )
}

const AnecdoteList = ({ anecdotes }) => {
  return (
    <div>
      <h2>Anecdotes</h2>
      <ul>
        {anecdotes.map(anecdote => <li key={anecdote.id}><Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link></li>)}
      </ul>
    </div>
  );
}

const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <h2>{anecdote.content} by {anecdote.author}</h2>
      <p>has {anecdote.votes} votes</p>
      <p>For more info see <Link to={anecdote.info}>{anecdote.info}</Link></p>
    </div>
  );
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
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const {reset: resetContent, ...content} = useField("text");
  const {reset: resetAuthor, ...author} = useField("text");
  const {reset: resetInfo, ...info} = useField("text");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log(content.value)
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    });
    props.sendNotification(`a new anecdote "${content}" has been created`)
    navigate("/anecdotes");
  }

  const resetFields = () => {
    resetContent();
    resetAuthor();
    resetInfo();
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content} />
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
        <button type="submit">create</button>
        <button type="reset" onClick={resetFields}>reset</button>
      </form>
    </div>
  )

}

const Notification = props => {

  return (
    <div>
      {props.notification}
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

  const showNotification = message => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 5000);
  }

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

  const match = useMatch("/anecdotes/:id");
  const anecdote = match 
    ? anecdotes.find(anecdote => anecdote.id === Number(match.params.id))
    : null;

  console.log(anecdotes, anecdote);

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu anecdotes={anecdotes} anecdote={anecdote} addNew={addNew} sendNotification={showNotification}/>
      <Notification notification={notification}/>
      <Footer />
    </div>
  );
}

export default App;
