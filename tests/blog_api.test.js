const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Seitsemän veljestä',
    author: 'Aleksis Kivi',
    url: 'www.blogi.fi',
    likes: '7',
  },
  {
    title: 'Kalevala',
    author: 'Elias Lönnrot',
    url: 'www.blogi2.fi',
    likes: '3',
  },
  {
    title: 'Aku ankka',
    author: 'Donrosa',
    url: 'www.blogi3.fi',
    likes: '100',
  },
]

describe('when there is initially some blogs saved', () => {
  beforeEach(async () => {
    await Blog.deleteMany({})
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('123', 10)
    const initialUser = new User({
      username: 'root',
      name: 'Superuser',
      passwordHash,
    })
    await initialUser.save()
    const user = {
      username: 'root',
      password: '123',
    }

    const login = await api.post('/api/login').send(user)
    console.log('************', login.body)
    const token = login.body.token

    for (const blog of initialBlogs) {
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    }
  })

  describe('returning of blogs', () => {
    test('blogs are returned as json', async () => {
      const blogs = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })

    test('blogs id is id', async () => {
      const response = await api.get('/api/blogs')

      response.body.forEach((r) => {
        expect(r.id).toBeDefined()
      })
    })
  })
  describe('addition of a new blog', () => {
    test('a valid note can be added ', async () => {
      const user = {
        username: 'root',
        password: '123',
      }
      const login = await api.post('/api/login').send(user)
      const token = login.body.token
      const newBlog = {
        title: 'Uusi_blogi',
        author: 'Tuntematon',
        url: 'www.blogi3.fi',
        likes: '1',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token} `)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      const contents = response.body.map((r) => r.title)

      expect(response.body).toHaveLength(initialBlogs.length + 1)
      expect(contents).toContain('Uusi_blogi')
    })
    test('default value of 0 is set, if likes field is missing', async () => {
      const user = {
        username: 'root',
        password: '123',
      }
      const login = await api.post('/api/login').send(user)
      const token = login.body.token
      const newBlog = {
        title: 'Uusi_blogi',
        author: 'Tuntematon',
        url: 'www.blogi3.fi',
        // "likes": "1"
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token} `)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')
      response.body.forEach((r) => {
        if (r.title === 'Uusi_blogi') {
          expect(r.likes).toBe(0)
        }
      })
    })
    test('400 bad response is sent if title or url missing ', async () => {
      const user = {
        username: 'root',
        password: '123',
      }
      const login = await api.post('/api/login').send(user)
      const token = login.body.token
      const newBlog = {
        // "title": "Uusi_blogi",
        author: 'Tuntematon',
        // "url": "www.blogi3.fi",
        likes: '1',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token} `)
        .send(newBlog)
        .expect(400)
    })
    test('401 Unauthorized response if token missing or invalid', async () => {
      const token = 'invalid token'
      const newBlog = {
        title: 'Uusi_blogi',
        author: 'Tuntematon',
        url: 'www.blogi3.fi',
        likes: '1',
      }
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token} `)
        .send(newBlog)
        .expect(401)
    })
  })
  describe('deletion of a blog', () => {
    test('deletetion of blog succeeds with status code 204 if id is valid', async () => {
      const responseInitial = await api.get('/api/blogs')
      const blogToDelete = responseInitial.body[1]
      const user = {
        username: 'root',
        password: '123',
      }
      const login = await api.post('/api/login').send(user)
      const token = login.body.token

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const responseAfterDel = await api.get('/api/blogs')
      expect(responseAfterDel.body).toHaveLength(initialBlogs.length - 1)
    })
  })

  describe('update of a blog', () => {
    test('updating blog likes succeeds with new blog returned, ', async () => {
      const response = await api.get('/api/blogs')
      const blogToUpdate = response.body[0]
      blogToUpdate.likes = 99

      const updatedBlogResponse = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)

      expect(updatedBlogResponse.body.likes).toBe(99)
    })
  })
})

// USER TESTS!!!!!!!!!!

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Superuser', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'testiukko',
      name: 'Testi Ukko',
      password: 'tosisalainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map((u) => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('expected `username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
  test('creation fails with proper statuscode and message if password too short', async () => {
    const usersAtStart = await helper.usersInDb()
    const newUser = {
      username: 'notroot',
      name: 'NotSuperuser',
      password: 'sa',
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('invalid password')
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})
afterAll(async () => {
  await mongoose.connection.close()
})
