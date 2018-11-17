'use strict'

const sinon = require('sinon')
const { expect } = require('chai')
const sandbox = sinon.createSandbox()

const validateFilters = require('../../middlewares/validate-filters')()

describe('Validate filters middleware', () => {
  describe('when request is valid', () => {
    it('should call `next` when path is `/`', (done) => {
      const req = {
        method: 'GET',
        path: '/'
      }
      validateFilters(req, undefined, done)
    })

    it('should call `next` when filters is not present', (done) => {
      const req = {
        method: 'GET',
        path: '/beans/varieties',
        query: {}
      }
      validateFilters(req, undefined, done)
    })

    it('should call `next` when filters are valid', (done) => {
      const req = {
        method: 'GET',
        path: '/beans/varieties',
        query: { filters: 'yield:HIGH AND bean_size:LARGE' }
      }
      validateFilters(req, undefined, done)
    })
  })

  describe('when request is invalid', () => {
    it('should return a response with an Error', (done) => {
      const req = {
        method: 'GET',
        path: '/beans/varieties',
        query: { filters: 'test:bla AND bli:blu' }
      }
      const jsonSpy = sandbox.spy()
      const statusStub = sandbox.stub().returns({ json: jsonSpy })
      const resStub = { status: statusStub }

      const outputError = {
        error: 'Unprocessable Entity',
        message: 'Invalid filters: test,bli'
      }

      validateFilters(req, resStub, undefined)
      expect(statusStub.firstCall.args[0]).to.deep.equal(422)
      expect(jsonSpy.firstCall.args[0]).to.deep.equal(outputError)
      done()
    })
  })
})
