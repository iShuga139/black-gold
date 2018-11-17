'use strict'

require('chai').should()
const freshy = require('freshy')
const request = require('supertest')
const Fraudster = require('fraudster')

const coffeeArabica = require('../fixtures/coffee-arabica')

const fraudster = new Fraudster({
  warnOnUnregistered: false,
  cleanCacheOnDisable: true
})

const apiEndpointPath = '/beans/varieties'
let app

describe(`GET ${apiEndpointPath}`, () => {
  before((done) => {
    fraudster.registerMock('../config/coffee-arabica', coffeeArabica)
    fraudster.enable()

    require('../../src/app')()
      .then((result) => {
        app = result
      })
      .then(done)
  })

  after(() => {
    fraudster.disable()
    freshy.unload('../../src/app')
  })

  context('when is a valid response', () => {
    it('should return a list with all varieties', (done) => {
      request(app)
        .get(apiEndpointPath)
        .set('Accept', 'application/json')
        .expect(200, coffeeArabica)
        .end((err) => {
          if (err) {
            return done(err)
          }

          return done()
        })
    })

    it('should return Catura varietie when filters is present', (done) => {
      const expectedResponse = [coffeeArabica[1]]

      const url = `${apiEndpointPath}?filters=yield:GOOD`
      request(app)
        .get(url)
        .set('Accept', 'application/json')
        .expect(200, expectedResponse)
        .end((err) => {
          if (err) {
            return done(err)
          }

          return done()
        })
    })

    it('should return a list of varities when deep filters are present', (done) => {
      const queryString = '?filters=nematodes:SUSCEPTIBLE AND producing_countries:Colombia'
      const url = apiEndpointPath + queryString

      request(app)
        .get(url)
        .set('Accept', 'application/json')
        .expect(200, coffeeArabica)
        .end((err) => {
          if (err) {
            return done(err)
          }

          return done()
        })
    })

    it('should return Bourbon varietie when deep filters are present', (done) => {
      const expectedResponse = [coffeeArabica[0]]

      const filtersOne = 'name:Bourbon AND nematodes:SUSCEPTIBLE AND leaf_rust:SUSCEPTIBLE'
      const queryString = `?filters=${filtersOne}`
      const url = apiEndpointPath + queryString

      request(app)
        .get(url)
        .set('Accept', 'application/json')
        .expect(200, expectedResponse)
        .end((err) => {
          if (err) {
            return done(err)
          }

          return done()
        })
    })
  })
})
