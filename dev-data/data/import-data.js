const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
//path = require('../../config.env')
dotenv.config({ path :'../../config.env'})

const Tour = require('./../../models/tourModel')
//lets replace the config.env (PASSWORD)  with DATABASE_PASSWORD
console.log(process.env.DATABASE)
const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//connect with mongo db AND DEAL WITH DEPRICATION WARNINGS..

//for connecting to the atlas cluster..
mongoose.connect(db, {
    useUnifiedTopology:true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(con =>{
    //console.log(con.connections)
    console.log('Database has been connected successfully...')
})

//for connnecting local database ..
/*
    mongoose.connect("mongodb://localhost:27017/tNature", {
        useUnifiedTopology:true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    }).then(con =>{
        console.log(con.connections)
        console.log('Database has been connected successfully...')
    })
*/

const tours = fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')

const importData = async () =>{
    try{
        await Tour.create(JSON.parse(tours))
        console.log('Data imported successfully')
    }catch(err){
        console.log(err)
    }
    process.exit();
};

const deleteData = async () =>{
    try{
        await Tour.deleteMany()
        console.log('Data Deleted successfully')
    }catch(err){
        console.log(err)
    }
    process.exit();
};

if(process.argv[2] === '--import'){
    importData();
}else if(process.argv[2] === '--delete'){
    deleteData();
   
}

//console.log(process.argv)