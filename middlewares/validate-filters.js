'use strict'

const validFilters = [ 'name', 'bean_size', 'quality_potential',
  'yield', 'leaf_rust', 'coffee_berry_disease', 'nematodes',
  'producing_countries' ]

const AND_FILTER = 'AND'

/**
 * Middleware that validates the provided filters
 *
 * @param {Object} req  Instance of http.ServerRequest
 * @param {Object} res  Instance of http.ServerResponse
 * @param {Object} next The next function in the stack
 * */
function validateFilters (req, res, next) {
  const method = req.method.toUpperCase()
  const path = req.path

  if (method !== 'GET' ||
      (method === 'GET' && path === '/')) {
    return next()
  }

  const filters = req.query.filters || ''

  if (!filters) {
    return next()
  }

  const splitFilters = filters.replace(/\s/g, '').split(AND_FILTER)
  const invalidFilters = []
  const newFilters = {}

  splitFilters.forEach((filter) => {
    const newSplitFilter = filter.split(':')

    if (!validFilters.includes(newSplitFilter[0])) {
      invalidFilters.push(newSplitFilter[0])
    }

    newFilters[newSplitFilter[0]] = newSplitFilter[1]
  })

  if (invalidFilters.length > 0) {
    const newError = {
      error: 'Unprocessable Entity',
      message: `Invalid filters: ${invalidFilters}`
    }

    return res.status(422).json(newError)
  }

  Object.assign(req.query, { newFilters })
  return next()
}

module.exports = () => validateFilters
