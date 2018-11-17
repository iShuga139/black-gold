'use strict'

const cors = require('cors')
const express = require('express')
const Promise = require('bluebird')
const bodyParser = require('body-parser')

const notFound = require('../middlewares/not-found')
const validateFilters = require('../middlewares/validate-filters')

const getBeanVarieties = require('../resources/get-bean-varieties')

/**
 * Initialize the Express app
 *
 * @return {object} The initialized Express app
 * */
module.exports = function balckGold () {
  const app = express()

  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))
  app.use(cors())

  app.use(validateFilters())

  app.get('/', (_req, res) => res.send('Welcome to Liquid Black Gold\'s information'))
  app.get('/beans/varieties', getBeanVarieties)

  app.use(notFound())

  return new Promise(resolve => {
    return resolve(app)
  })
}
