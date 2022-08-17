const mongoose = require('mongoose')
const dbConnection = require('./utils/dbCon')
const dotenv = require('dotenv')
dotenv.config({ path : './config.env'})

/**
 * UNHANDLED EXCEPTION should be always at the top of all middle wares as this will catch all exceptions before even reaching to the routes.
 */
process.on('uncaughtException', err =>{
    console.log('UNCAUGHT EXCEPTION ERROR, Shutting down....')
    console.log(err.name, err.message, err);
   
    process.exit(1)
})
const app = require('./app')

/**l
 * ets replace the config.env (PASSWORD)  with DATABASE_PASSWORD
 * @type {string}
 */
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//connect with mongo db AND DEAL WITH DEPRICATION WARNINGS..

/**
 *for connecting to the atlas cluster..
 */
dbConnection(db)

mongoose.Promise = global.Promise;

//Predefined development port no.
const port = process.env.PORT || 8000;

const server = app.listen(port , () =>{
    console.log(`Server is listening on port ${port}`)
})

/**
 *Unhandled rejections: this usually occurs outsice express, such as database password error.
 */

process.on('unhandledRejection', err =>{
    console.log('UNHANDLED ERROR, Shutting down....')
    console.log(err);
    //this will close the server gracefully rather than exiting at once
    server.close(() => {
        process.exit(1)
    })
})
