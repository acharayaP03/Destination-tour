class APIFeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
   
    //filtering feature..
    filter(){
        // 1a)for quering/iltering  the result pass the req.query params 
        const queryObj  = { ...this.queryString }
        const excludedFields = ['page', 'sort', 'limit', 'fields']
        excludedFields.forEach(el => delete queryObj[el])
        //see what this is all about
        //console.log(req.query, queryObj)

        //1b) advanced filtering ..
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match =>{ return `$${match}`})
        //console.log(JSON.parse(queryStr))

        //build the Query
        this.query = this.query.find(JSON.parse(queryStr))
        //return the result...
        return this
    }

    sort(){
        //2) Sort query..
        if(this.queryString.sort){
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy)
         }else{
            this.query = this.query.sort('-createdAt')
         }

         return this;
    }

    limitingFields(){
         //3)Limiting fields
         if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }

        return this;
    }
    
    pagination(){
        //4)Pagination 
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 10;

        const skip = (page - 1 ) * limit;

        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}

module.exports = APIFeatures;