#!/usr/bin/env node

/*******************************************************************************
  *  Setup the console
  */

// display name shown in 'ps' or 'top'
process.title = 'webapp'

/*******************************************************************************
  *  Require all helpers
  */

var async   = require('async')
var fs      = require('fs')
var moment  = require('moment')
var numeral = require('numeral')
var uuid    = require('node-uuid')
var winston = require('winston')

/*******************************************************************************
  *  Setup all routes
  */

// var rRoute = require(__dirname + '/routes/route')

/*******************************************************************************
 * Setup all sockets
 */

// var sSocket = require(__dirname + '/../sockets/socket')

/*******************************************************************************
 * Setup web and socket servers
 */

var express    = require('express'),
    app        = express(),
    http       = require('http').createServer(app),
    bodyParser = require('body-parser')

/*******************************************************************************
 * Setup logging
 */

// set `/logs` directory
var logDir      = __dirname + '/logs/'

// set log filename
var logFilename = moment().format('YYYY.MM.DD') 

// create `/logs` directory if not exist
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir)

// initialize winston
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({ colorize: 'true'}),
        new (winston.transports.File)({ 
            filename: logDir + logFilename
        })
    ]}
)

/*******************************************************************************
 * Initialize constants
 */

var APP_NAME = 'Web App'
var PORT_NUM = 3000

/*******************************************************************************
 * Start processing
 */

async.series([
    function initStep(callback) {
        logger.info('Initializing Web App...')

        // set the view engine
        app.set('view engine', 'ejs')


/*******************************************************************************
  *  PLEASE NOTE!!
  *  You must uncomment the following lines if NOT using Nginx resource caching.
  */
        // app.use('/css', express.static(__dirname + '/public/css'))
        // app.use('/images', express.static(__dirname + '/public/images'))
        // app.use('/js', express.static(__dirname + '/public/js'))
        // app.use(express.static(__dirname + '/public'))

        // parse application/x-www-form-urlencoded
        // app.use(bodyParser.urlencoded({ extended: true }))

        // parse application/json
        // app.use(bodyParser.json())

        // set locale (on every request), if session locale exists
        // otherwise use default browser setting
        app.use(function (req, res, next) {
            // add logger to response object
            res.logger = logger

            next()
        })

        callback()
    },
/*******************************************************************************
  *  PLEASE NOTE!!
  *  You must uncomment the following lines when ENABLING database functions.
  */
    // function initMainDbStep(callback) {
    //     db.initDb('main', function () {
    //         // initialization is complete
    //         logger.info('Connected to Main Db')

    //         callback()
    //     })
    // },
    function setupRoutesStep(callback) {
        // set the base directory
        var baseDir = __dirname + '/views/'

        // setup contact page
        app.get('/contact', function (req, res) {
            res.render(baseDir + 'contact', { 
                pageTitle: 'Kewl New Page :. ' + APP_NAME 
            })
        })

        // setup help / support page
        app.get('/help/:query', function (req, res) {
            // process help query
        })

        // setup all content pages
        app.get('*', function (req, res) {
            var filename = req.url.slice(1)

            fs.exists(baseDir + filename + '.ejs', function (exists) {
                if (exists) {
                    res.render(baseDir + filename, { 
                        pageTitle : 'Kewl New Page :. ' + APP_NAME
                    })
                } else {
                    // if the page is not found
                    res.end('Sorry. Your page was not found')
                }
            })
        })

        callback()
    },
    function startAppServerStep(callback) {
        // start app server
        app.listen(PORT_NUM, function () {
            logger.info('Web App is running on [ Port ' + PORT_NUM + ' ]')
        })

        callback()
    },
    function finalizeStep(callback) {
        console.log('All done.')

        callback()
    }
])
