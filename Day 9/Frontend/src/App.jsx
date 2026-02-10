import { useEffect, useState } from 'react'
import axios from "axios"


function App() {

  const [notes, setNotes] = useState([
    {title: "test title 1",
      description: "test description 1"
    },
    {title: "test title 2",
      description: "test description 2"
    },
    {title: "test title 3",
      description: "test description 3"
    },
    {title: "test title 4",
      description: "test description 4"
    }
  ])

  useEffect(() => { // useEffect hook to fetch notes from the backend API when the component mounts so that it doesn't re-render infinitely and cause an infinite loop of API calls, the empty dependency array [] ensures that the effect runs only once when the component mounts
    axios.get("http://localhost:3000/api/notes")
    .then((res) => {
    console.log(res.data.notes)
    setNotes(res.data.notes)
    })
  },[]) 
 
  return (
   <>
   <div className="notes-container">
    {notes.map((note, idx) => (
      <div className="note" key={idx}>
        <h2>{note.title}</h2>
        <p>{note.description}</p>
      </div>
    ))}
   </div>
    </>
  )
}

export default App
