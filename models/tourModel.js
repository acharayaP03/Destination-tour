const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

//SCHEMA..
const tourSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true, 
        trim: true,
        maxlength: [40, 'A tour must contain less or equal to 40 characters.'],
        minlength: [10, 'A tour must contain less or equal to 10 characters.'],
        //validate : [validator.isAlpha, 'Name must only contain characters. ']
    },
    slug : String, 
    duration: {
        type : Number,
        required: [true, "A tour must have a duration"]
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size."]
    },
    difficulty: {
        type : String,
        required: [true, 'A Tour must have a difficulty.'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is eithr: easy, medium or Difficult.'
        }
    },
    ratingAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1'],
        max: [5, 'Rating must be less than 5']
    },
    ratingsQuantity: {
        type: Number,
        required: [true, 'A tour must have a quality rating.']
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price.']
    },
    priceDiscount : {
        type : Number,
        validate: {
            validator : function(val){
                return val < this.price;
            },
            message: 'Discount price ({VALUE}) must be less than regular price. '
        }
    },
    summary: {
        type: String,
        required: [true, 'A tour must have description.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images : [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date]
},
{
    secretTour : {
        type : Boolean,
        default : false
    }
}, 
{
    toJSON : { virtuals : true},
    toObject: { virtuals : true}
});

//Virtual Properties...
tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
})

//Mongoose Document Middleware. " .pre() run before the .save(0 and .create() but not on insertMany()"
tourSchema.pre('save', function(next){
    this.slug = slugify(this.name , { lower : true})
    next()
})

//after .save()
tourSchema.post('save', function(doc, next){
    console.log(doc)
    next();
})

//Query Middleware ...
tourSchema.pre(/^find/, function(next){
    this.find( { secretTour : { $ne : true}})

    this.start = Date.now()
    next();
})

tourSchema.post(/^find/, function(doc, next){
    console.log(`Query Took ${Date.now() - this.start} milliseconds!.`)
    next();
})

//Aggregate Middleware.....

tourSchema.pre('aggregate', function(next){
    this.pipeline().unshift({ $match : { secretTour : { $ne : true }}})

    next();
})
//Model for the schema.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;