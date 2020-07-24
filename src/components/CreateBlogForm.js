import React, { useState } from 'react'

const CreateBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        title:
        <input
          id='title'
          value={newTitle}
          onChange={handleTitleChange}
        />
      </div>
      <div>
        author:
        <input
          id='author'
          value={newAuthor}
          onChange={handleAuthorChange}
        />
      </div>
      <div>
        url:
        <input
          id='url'
          value={newUrl}
          onChange={handleUrlChange}
        />
        <div>
          <button id='submitblog-button' type="submit">create</button>
        </div>
      </div>
    </form>
  )
}

export default CreateBlogForm