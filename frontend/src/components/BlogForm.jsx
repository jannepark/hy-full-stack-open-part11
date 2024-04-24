import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
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
    const newBlog = ({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    })
    createBlog(newBlog)
    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }
  return (
    <form onSubmit={addBlog}>
      <div>
        Title:
        <input
          value={newTitle}
          onChange={handleTitleChange}
          id='title-Input'
        />
      </div>
      <div>
        Author:
        <input
          value={newAuthor}
          onChange={handleAuthorChange}
          id='author-Input'
        />
      </div>
      <div>
        URL:
        <input
          value={newUrl}
          onChange={handleUrlChange}
          id='url-Input'
        />
      </div>
      <button type="submit" id='create-blog'>create</button>
    </form>
  )
}
export default BlogForm