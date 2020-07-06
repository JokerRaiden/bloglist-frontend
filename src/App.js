import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState('')

  const createBlogFormRef = useRef()

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchBlogs()
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (userObject) => {
    const user = await loginService.login(userObject)

    window.localStorage.setItem(
      'loggedBlogappUser', JSON.stringify(user)
    )

    blogService.setToken(user.token)
    setUser(user)
  }

  const showNotification = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const addBlog = async (blogObject) => {
    createBlogFormRef.current.toggleVisibility()

    const returnedBlog = await blogService.create(blogObject)
    setBlogs(blogs.concat(returnedBlog))
    showNotification(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)
  }

  const loginForm = () => (
    <LoginForm login = {handleLogin} />
  )

  const removeBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}`)) {
      try {
        await blogService.remove(blogObject.id)
        showNotification(`Removed blog ${blogObject.title} by ${blogObject.author}`)
        setBlogs(blogs.filter(b => b.id !== blogObject.id))
      } catch (exception) {
        showNotification(exception.message, 'error')
      }
    }
  }

  const bloglist = () => (
    <div>
      <h2>blogs</h2>
      <Notification notification={notification} />
      <p>
        {`${user.name} logged in`}
        <button onClick={() => {window.localStorage.clear(); window.location.reload(false)}}>logout</button>
      </p>
      <Togglable buttonLabel="new blog" ref={createBlogFormRef}>
        <CreateBlogForm
          createBlog={addBlog}
        />
      </Togglable>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog key={blog.id} blog={blog} handleRemove={removeBlog} username={user.username}/>
        )
      }
    </div>
  )

  return (
    <div>
      {user === null ?
        loginForm() :
        bloglist()
      }
    </div>
  )
}

export default App