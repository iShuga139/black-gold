'use strict'

const fs = require('fs')
const http = require('http')
const https = require('https')
const winston = require('winston')

const config = require('./config/defaults')
const initializeApp = require('./src/app')

initializeApp()
  .then((app) => {
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    })
    let server

    const hasTLS = process.env.TLS_ENABLED || config.tls.enabled
    if (hasTLS) {
      const tlsOptions = {
        key: fs.readFileSync(config.tls.keyPath),
        cert: fs.readFileSync(config.tls.certPath)
      }

      server = https.createServer(tlsOptions, app)
    } else {
      server = http.createServer(app)
    }

    const servicePort = process.env.SERVICE_PORT || config.server.port
    server.listen(servicePort, () => {
      logger.info(`Listening on port ${server.address().port}`)
    })

    const emitShutdown = () => {
      logger.info(`Closing port ${server.address().port}`)
      server.close()

      logger.info('Shuting down ...')
      process.exit(0)
    }

    process.once('SIGINT', emitShutdown)
    process.once('SIGTERM', emitShutdown)

    const uncaughtExceptionHandler = (error) => {
      logger.error('Oops, something happened ', error)
      process.exit(1)
    }

    process.on('uncaughtException', uncaughtExceptionHandler)
  })
  .catch((error) => {
    const logger = winston.createLogger({
      level: 'error',
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.simple()
        })
      ]
    })

    logger.error('An error occurred, could not initialize the app')
    logger.error(error.stack)

    process.exit(1)
  })
