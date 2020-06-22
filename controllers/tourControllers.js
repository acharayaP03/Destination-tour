const Tour = require('./../models/tourModel')
const APIFeatures = require('./../utils/apiFeatures');
const AppError = require('./../utils/appError')
const catchAsync = require('./../utils/catchAsync');

//this a middleware which will run before getAllTours.
exports.topCheapTours = (req, res, next) =>{
   
    req.query.limit = '5';
    req.query.sort ='-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
}

//Get all tours ...
 exports.getAllTours = catchAsync(async (req, res, next) =>{
     const features = new APIFeatures(Tour.find(), req.query)
     .filter()
     .sort()
     .limitingFields()
     .pagination();
     const tours = await features.query
     //send the response..
     res.status(200).json({
         status : 'success',
         requestedAt : req.requestTime,
         results : tours.length,
         data : {
             tours
         }
     })
})

//Get tours by id 
 exports.getTour = catchAsync( async (req, res, next) =>{
    const tour = await Tour.findById(req.params.id);

    if(!tour){
        return next(new AppError('No tour found with the requested Id', 404))
    }
    res.status(200).json({
        status : 'success',
        requestedAt : req.requestTime,
        data : {
            tour
        }
    })
})

//Create tour
 exports.createTour = catchAsync(async (req, res, next) =>{
     const newTour = await Tour.create(req.body)
     res.status(201)
     .json({
         status : "success",
         createdAt: req.requestTime,
         data : {
             tour : newTour
         }
     })
})

//update Tour or Tours 
 exports.updateTours = catchAsync(async (req, res, next) =>{

    const tour = await Tour.findOneAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if(!tour){
        return next(new AppError('No tour found with the requested Id', 404))
    }
 
    res.status(200).json({
        status : 'success',
        updatedAt: req.requestTime,
        data: {
            tour
        }
    })
  
})

//Delete tours ... 
 exports.deleteTour =catchAsync(async (req, res, next) =>{
    //204 means content not available or deleted 
    const tour = await Tour.findByIdAndDelete(req.params.id)

    if(!tour){
        return next(new AppError('No tour found with the requested Id', 404))
    }

    res.status(204).json({
        status : 'success',
        data: null
    })
})


//Aggregation pipeline
exports.getTourStats = catchAsync(async (req, res, next) =>{
    const stats = await Tour.aggregate([
        {
            $match : { 
                ratingAverage: { $gte : 4.5} 
            }
        },
        {
            $group : {
                _id : {$toUpper : '$difficulty'},
                num : { $sum : 1},
                numRatings : { $avg : '$ratingsQuantity'},
                avgRatings : { $avg : '$ratingAverage'},
                avgPrice : { $avg : '$price'},
                minPrice : { $min : '$price'},
                maxPrice : { $max: '$price'}
            }
        },
        {
            $sort : { avgPrice : 1 }
        },
        // {
        //     $match : { _id : { $ne: 'EASY' } }
        // }
    ])
    //now send the response ...
    res.status(200).json({
        status : 'success',
        updatedAt: req.requestTime,
        data: {
            stats
        }
    })
})

exports.getMonthlyPlan =catchAsync(async (req, res, next) =>{
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
        {
            $unwind : '$startDates'
        },
        {
            $match: {
                startDates : {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: { $month : '$startDates'},
                numTourStarts: { $sum: 1},
                tours : { $push: '$name'}
            }
        },
        {
            $addFields : {
                month : '$_id'
            }
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort : {
                numTourStarts : -1
            }
        },
        {
            $limit : 12
        }
    ])

    res.status(200).json({
        status : 'success',
        requestedAt: req.requestTime,
        data: {
            plan
        }
    })
})
