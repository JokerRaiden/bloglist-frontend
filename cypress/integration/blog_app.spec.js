describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    cy.visit('http://localhost:3000')
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Tero Testaaja',
      username: 'ttestaaj',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
  })

  it('Login from is shown', function() {
    cy.contains('log in to application')
  })

  describe('Login', function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('ttestaaj')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Tero Testaaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('ttestaaj')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Tero Testaaja logged in')
    })
  })

  describe('when logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'ttestaaj', password: 'salainen' })
    })

    it('a blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#title').type('Testi title')
      cy.get('#author').type('Tero Testaaja')
      cy.get('#url').type('www.google.fi')
      cy.get('#submitblog-button').click()

      cy.get('.success')
        .should('contain', 'a new blog Testi title by Tero Testaaja added')
        .and('have.css', 'color', 'rgb(0, 128, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.contains('Testi title Tero Testaaja')
    })

    describe('and a blog exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Testi title',
          author: 'Tero Testaaja',
          url: 'www.google.fi'
        })
      })

      it('it can be liked', function() {
        cy.contains('view').click()
        cy.get('#like-button').click()
        cy.contains('likes 1')
      })

      it('it can be removed', function() {
        cy.contains('view').click()
        cy.get('#remove-button').click()

        cy.get('.success')
          .should('contain', 'Removed blog Testi title by Tero Testaaja')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')

        cy.get('html').should('not.contain', 'Testi title Tero Testaaja')
      })
    })

    describe('and multiple blogs exist', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'Testi title',
          author: 'Tero Testaaja',
          url: 'www.google.fi'
        })
        cy.createBlog({
          title: 'Clean Code',
          author: 'Robert C. Martin',
          url: 'www.cleancode.com',
          likes: 16
        })
        cy.createBlog({
          title: 'Code Complete',
          author: 'Steve McConnell',
          url: 'www.codecomplete.com',
          likes: 6
        })
      })

      it('blogs are ordered by likes', function() {
        cy.get('.blog').then(function(blogs) {
          const first = blogs[0]
          const second = blogs[1]
          const third = blogs[2]

          cy.wrap(first).should('contain', 'Clean Code Robert C. Martin')
          cy.wrap(second).should('contain', 'Code Complete Steve McConnell')
          cy.wrap(third).should('contain', 'Testi title Tero Testaaja')
        })
      })
    })
  })
})