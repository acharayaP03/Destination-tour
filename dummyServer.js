//const fs = require('fs')

const Tour = require('./../models/tourModel')

//read dev file, this wil be read only once, when application is loaded.
//const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`))


//middleware that checks the id..
exports.checkId = (req, res, next, value)=>{
    const currentId = req.params.id * 1 //this will convert string into number

    console.log(`Tour Id is : ${value}`)

    if( currentId > tours.length){
        return res.status(404).json({
                 status : "fail",
                 message : "Invalid ID "
             })
     }
     next();
}

//checkbody middleware, before post request..
exports.checkBody = (req, res, next) =>{

    if(!req.body.name || !req.body.price){
        return res.status(404).json({
            status: "fail",
            message : "Missing Name or price field."
        })
    }
    next();
}

//Get all tours ...
 exports.getAllTours = (req, res) =>{
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : tours.length,
        data : {
            tours
        }
    })
}

//Get tours by id 
 exports.getTour = (req, res) =>{
    const tour = tours.find( currentElement => currentElement.id === req.params.id * 1)
 
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        results : tours.length,
        data : {
            tour
        }
    })
}

//Create tour
 exports.createTour =  (req, res) =>{
  
    const newId = tours[tours.length - 1].id + 1 ;
    const newTour = Object.assign({id : newId }, req.body)

    tours.push(newTour);

    fs.writeFile(`${__dirname}/../dev-data/data/tours-simple.json`, JSON.stringify(tours), err =>{
        if(err) return console.log('File write unsuccessfull......!!')

        res.status(201)
            .json({
                status : "success",
                createdAt: req.requestTime,
                data : {
                    tour : newTour
                }
            })
    })
}

//update Tour or Tours 
 exports.updateTours = (req, res) =>{
    res.status(200).json({
        status : 'success',
        updatedAt: req.requestTime,
        data: {
            tour: 'Tour has been updated.....'
        }
    })
 
}

//Delete tours ... 
 exports.deleteTour = (req, res) =>{
    //204 means content not available or deleted 
    res.status(204).json({
        status : 'success',
        data: null
    })
 
}
