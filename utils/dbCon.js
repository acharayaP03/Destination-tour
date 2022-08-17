const mongoose  = require('mongoose');
require('dotenv').config();


const dbConnection = async (db) =>{
  mongoose.connect(db, {
    useUnifiedTopology:true,
    useNewUrlParser: true,
  }).then(conn =>{
    //console.log(con.connections)
    console.log('Database has been connected successfully...')
  }).catch(e => console.log(e))
}


/**
 *for connecting to the local db...
 */
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

module.exports = dbConnection