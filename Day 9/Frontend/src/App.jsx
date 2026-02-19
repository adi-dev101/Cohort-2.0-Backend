import { useEffect, useState } from 'react'
import axios from "axios"


function App() {

  const [notes, setNotes] = useState([])  // State variable to hold the list of notes retrieved from the backend API, initialized as an empty array

  function fetchNotes() { // Function to fetch notes from the backend API using axios, makes a GET request to the /api/notes endpoint and updates the notes state variable with the retrieved notes data from the respons
    axios.get("http://localhost:3000/api/notes")
    .then((res) => {
    setNotes(res.data.notes)
    })}

  useEffect(() => { // useEffect hook to call the fetchNotes function when the component mounts, ensuring that the notes are fetched from the backend API and displayed in the frontend application when it is loaded for the first time and whenever the component is re-rendered due to changes in the notes state variable or any other state variable that may be added in the future and dont forget to add the dependency array to avoid infinite loop of re-rendering and fetching notes from the backend API
    fetchNotes()
  },[]) 

  function handleSubmit(e) { // Function to handle the form submission for creating a new note, prevents the default form submission behavior, extracts the title and description values from the form inputs, makes a POST request to the /api/notes endpoint with the title and description data to create a new note in the backend API, and calls the fetchNotes function to update the notes state variable with the newly created note and display it in the frontend application
    e.preventDefault()  // Prevent the default form submission behavior to avoid page reload
    const title = e.target.title.value  // Extract the title value from the form input with name "title" and assign it to the title variable
    const description = e.target.description.value  // Extract the description value from the form input with name "description" and assign it to the description variable

    axios.post("http://localhost:3000/api/notes", { 
      title : title, 
      description : description
     })  // Make a POST request to the /api/notes endpoint with the title and description data to create a new note in the backend API
    .then((res) => {
      console.log("Note created:", res.data)
      fetchNotes()  // Call the fetchNotes function to update the notes state variable with the newly created note and display it in the frontend application
    })
  }
  
  function handleDeleteNote(noteId) { // Function to handle the deletion of a note, takes the id of the note to be deleted as a parameter, makes a DELETE request to the /api/notes/:id endpoint with the specified id to delete the note from the backend API, and calls the fetchNotes function to update the notes state variable and remove the deleted note from the frontend application
    axios.delete(`http://localhost:3000/api/notes/${noteId}`)  // Make a DELETE request to the /api/notes/:id endpoint with the specified id to delete the note from the backend API
    .then((res) => {
      console.log("Note deleted:", res.data)
      fetchNotes()  // Call the fetchNotes function to update the notes state variable and remove the deleted note from the frontend application
    })
  }

  function handleUpdateNote(noteId, newDescription) { // Function to handle the update of a note's description, takes the id of the note to be updated and the new description as parameters, makes a PATCH request to the /api/notes/:id endpoint with the specified id and new description to update the note in the backend API, and calls the fetchNotes function to update the notes state variable and reflect the updated description in the frontend application
    axios.patch(`http://localhost:3000/api/notes/${noteId}`, { description: newDescription })  // Make a PATCH request to the /api/notes/:id endpoint with the specified id and new description to update the note in the backend API
    .then((res) => {
      console.log("Note updated:", res.data)
      fetchNotes()  // Call the fetchNotes function to update the notes state variable and reflect the updated description in the frontend application
    })
  }
  return (
   <>

   <form className="note-create-form" onSubmit={handleSubmit}>
    <input name="title" type="text" placeholder="Enter note title"/>
    <input name="description" type="text" placeholder="Enter note description"/>
    <button>Create note</button>
   </form>

   <div className="notes-container">
    {notes.map((note, idx) => (
      <div className="note" key={idx}>
        <h2>{note.title}</h2>
        <p>{note.description}</p>
        <button onClick={() => handleDeleteNote(note._id)}>Delete</button> {/* Button to trigger the deletion of the note, calls the handleDeleteNote function with the id of the note to be deleted when clicked */}
        <button onClick={() => {
          const newDesc = window.prompt("Enter new description:", note.description);
          if (newDesc) handleUpdateNote(note._id, newDesc);
        }}>Update description
        </button> {/* Button to trigger the update of the note's description, calls the handleUpdateNote function with the id of the note to be updated and a new description when clicked */}
      </div>
    ))}
   </div>
    </>
  )
}

export default App
