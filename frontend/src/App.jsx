import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()

  const [notification, setNotification] = useState({
    message: null,
    type: null,
  })

  useEffect(() => {
    blogService.getAll().then((blogs) => {
      setBlogs(Array.isArray(blogs) ? blogs : [])
    })
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      const user = await loginService.login({
        username,
        password,
      })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedNoteappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      if (error.response.status === 401) {
        setNotification({
          message: `${error.response.data.error}`,
          type: 'error',
        })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      }
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    console.log('logging out')
    window.localStorage.clear()
    window.location.reload()
  }
  const handleLikeBlog = async (blogObject) => {
    try {
      await blogService.update(blogObject.id, blogObject)
      const index = blogs.indexOf(
        blogs.find((blog) => blog.id === blogObject.id)
      )
      const newBlogs = [...blogs]
      newBlogs[index].likes += 1
      setBlogs(newBlogs)
    } catch (error) {
      console.log(error)
    }
  }

  const addBlog = async (blogObject) => {
    blogFormRef.current.toggleVisibility()

    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setNotification({
        message: `Created new blog ${blogObject.title}`,
        type: 'notification',
      })
      setTimeout(() => {
        setNotification({ message: null, type: null })
      }, 5000)
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setNotification({
          message: `${error.response.data.error}`,
          type: 'error',
        })
        setTimeout(() => {
          setNotification({ message: null, type: null })
        }, 5000)
      }
    }
  }

  if (user === null) {
    return (
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
        notification={notification}
      />
    )
  }
  return (
    <>
      <div>
        <h2>blogs</h2>
        <Notification notification={notification} />
        <div>
          {user.name} logged in
          <button type="submit" onClick={handleLogout} id="logout">
            logout
          </button>
        </div>
      </div>
      <h2>Create new</h2>
      <Togglable buttonLabel="New blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <div>
        {blogs
          .sort((i, j) => j.likes - i.likes)
          .map((blog) => (
            <Blog
              key={blog.id}
              blog={blog}
              user={user}
              setBlogs={setBlogs}
              handleLikeBlog={handleLikeBlog}
            />
          ))}
      </div>
    </>
  )
}

export default App
