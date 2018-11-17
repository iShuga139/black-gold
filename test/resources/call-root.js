'use strict'

const freshy = require('freshy')
const request = require('supertest')

const apiEndpointPath = '/'
let app

describe(`GET ${apiEndpointPath}`, () => {
  before((done) => {
    require('../../src/app')()
      .then((result) => {
        app = result
      })
      .then(done)
  })

  after(() => {
    freshy.unload('../../src/app')
  })

  it('should return a friendly message', (done) => {
    const friendlyMessage = 'Welcome to Liquid Black Gold\'s information'

    request(app)
      .get(apiEndpointPath)
      .set('Accept', 'application/json')
      .expect(200, friendlyMessage)
      .end((err) => {
        if (err) {
          return done(err)
        }

        return done()
      })
  })
})
