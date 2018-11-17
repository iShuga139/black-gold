'use strict'

const Promise = require('bluebird')
const { filter } = require('lodash')
const varieties = require('../config/coffee-arabica')

const levelZero = [ 'name', 'bean_size', 'quality_potential', 'yield' ]
const levelOne = [ 'leaf_rust', 'coffee_berry_disease', 'nematodes' ]

/**
 * Apply the parsed filters to return a new list
 * of Arabic Coffee's bean varieties
 *
 * @param {Object} filters Requested
 * @returns
 */
function applyFilters (filters) {
  return filter(varieties, filters)
}

/**
 * Parse the requested filters that will be apply
 * to the Arabic Coffee's bean varieties list
 *
 * @param {Object} filters Requested filters
 * @returns
 */
function buildFilters (filters) {
  return Object.keys(filters).reduce((coffeeInformation, keyFilter) => {
    const valueFilter = filters[keyFilter]

    if (levelZero.includes(keyFilter)) {
      Object.assign(coffeeInformation, { [keyFilter]: valueFilter })
      return coffeeInformation
    }

    if (levelOne.includes(keyFilter)) {
      if (coffeeInformation.disease_resistancy) {
        coffeeInformation.disease_resistancy.push({ [keyFilter]: valueFilter })
        return coffeeInformation
      }

      coffeeInformation['disease_resistancy'] = [{ [keyFilter]: valueFilter }]
      return coffeeInformation
    }

    coffeeInformation['producing_countries'] = valueFilter.split(',')
    return coffeeInformation
  }, {})
}

/**
 * Controller to expose the Arabica coffee information
 *
 * @param {Object} req  Instance of http.ServerRequest
 * @param {Object} res  Instance of http.ServerResponse
 * @returns             Object of Arabic Coffee's bean varieties
 */
module.exports = function getBeanVarieties (req, res) {
  const filters = req.query.newFilters || ''

  if (!filters) {
    return res
      .status(200)
      .json(varieties)
  }

  return new Promise((resolve) => {
    return resolve(buildFilters(filters))
  })
    .then(applyFilters)
    .then((varietiesWithFilters) => {
      return res
        .status(200)
        .json(varietiesWithFilters)
    })
}
