describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3002/api/testing/reset')
    const user = {
      name: 'herra testi',
      username: 'testi',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3002/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  describe('Login', function() {
    it('Login form is shown', function() {
      cy.contains('login')
      cy.contains('Department of Computer Science, University of Helsinki 2023')
    })

    it('succeeds with correct credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('blogs')
    })

    it('fails with incorrect credentials', function() {
      cy.get('#username').type('testi')
      cy.get('#password').type('väärä')
      cy.get('#login-button').click()
      cy.get('.error').contains('invalid username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testi', password: 'salainen' })
    })

    it('a new blog can be created', function() {
      cy.contains('blogs')
      cy.contains('New blog').click()

      cy.get('#title-Input').type('testi otsikko')
      cy.get('#author-Input').type('testi kirjoittaja')
      cy.get('#url-Input').type('testi osoite')

      cy.get('#create-blog').click()
      cy.contains('testi otsikko')
      cy.get('.notification').contains('testi otsikko')
    })
    it('user can like a blog and likes are updated', function() {
      cy.createBlog({ title:'uusi blogi', author:'kirjoittaja', url:'osoite' })
      cy.get('#viewBlogInfo').click()
      cy.contains('osoite')
      cy.get('#likeBlog').click()
      cy.get('#likeBlog').click()
      cy.get('#likeBlog').parent().contains('2')
    })
    it('user can delete blog if created it', function() {
      cy.createBlog({ title:'uusi blogi', author:'kirjoittaja', url:'osoite' })
      cy.get('#viewBlogInfo').click()
      cy.contains('delete')
      cy.get('#removeBlog').click()
      cy.contains('uusi blogi').should('not.exist')
    })
    it('user can not delete blog if not created it', function() {
      cy.createBlog({ title:'uusi blogi', author:'kirjoittaja', url:'osoite' })
      cy.get('#logout').click()
      const user = {
        name: 'toinen käyttäjä',
        username: 'kakkonen',
        password: 'onykkönen'
      }
      cy.request('POST', 'http://localhost:3002/api/users/', user)
      cy.visit('http://localhost:3000')
      cy.login({ username: 'kakkonen', password: 'onykkönen' })
      cy.contains('uusi blogi')
      cy.get('#viewBlogInfo').click()
      cy.contains('delete').should('not.exist')
    })
    it('confirm order of blogs by likes amount', function() {
      cy.createBlog({ title:'toiseksi eniten tykkäyksiä', author:'toka otsikko',
        url:'osoite', likes: '5' })
      cy.createBlog({ title:'eniten tykkäyksiä', author:'eka otsikko',
        url:'osoite', likes: '15' })
      cy.createBlog({ title:'kolmannneksi eniten tykkäyksiä', author:'kolmas otsikko',
        url:'osoite', likes: '2' })

      cy.get('[id=viewBlogInfo]').each(($button) => {
        cy.wrap($button).click()
      })
      cy.get('.blogStyle').eq('0').should('contain', 'eniten tykkäyksiä')
      cy.get('.blogStyle').eq('1').should('contain', 'toiseksi eniten tykkäyksiä')
      cy.get('.blogStyle').eq('2').should('contain', 'kolmannneksi eniten tykkäyksiä')
    })
  })
})