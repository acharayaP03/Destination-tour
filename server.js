const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path : './config.env'})

//UNHANDLED EXCEPTION should be always at the top of all middle wares as this will catch all exceptions before even reaching to the routes.
process.on('uncaughtException', err =>{
    console.log('UNCAUGHT EXCEPTION ERROR, Shutting down....')
    console.log(err.name, err.message, err);
   
    process.exit(1)
})
const app = require('./app')

//lets replace the config.env (PASSWORD)  with DATABASE_PASSWORD
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//connect with mongo db AND DEAL WITH DEPRICATION WARNINGS..

//for connecting to the atlas cluster..
mongoose.connect(db, {
    useUnifiedTopology:true,
    useNewUrlParser: true,
}).then(con =>{
    //console.log(con.connections)
    console.log('Database has been connected successfully...')
})

//for connecting to the local db...
/*
mongoose.connect(process.env.DATABASE_LOCAL, {
    useUnifiedTopology:true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con =>{
    console.log(con.connections)
    console.log('Database has been connected successfully...')
})
*/
//Predefined development port no.
const port = process.env.PORT || 8000;

const server = app.listen(port , () =>{ 
    console.log(`Server is listening on port ${port}`)
})

//Unhandled rejections: this usually occurs outsice express, such as database password error.

process.on('unhandledRejection', err =>{
    console.log('UNHANDLED ERROR, Shutting down....')
    console.log(err);
    //this will close the server gracefully rather than exiting at once
    server.close(() => {
        process.exit(1)
    })
})


