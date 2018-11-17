'use strict'

const { expect } = require('chai')

let createApp

describe('Application loads successfully', () => {
  before((done) => {
    createApp = require('../../src/app')
    done()
  })

  it('should mount all routes', () => {
    return createApp()
      .then(app => {
        const routeOne = app._router.stack[6]
        const routeTwo = app._router.stack[7]

        expect(routeOne.route.path).to.be.equal('/')
        expect(routeTwo.route.path).to.be.equal('/beans/varieties')
      })
  })
})
