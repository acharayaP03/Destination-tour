# tNature


This Project demonstrates a Node.js Restfull API implementation with Express.js and Atlas MongoDb cluster with AWS.

- All Tour models and controllers have been designed with its appropriate middleware and routes as well as proper error handeling has been done and commited on initial commit. 


# AuthController Doumentation

This section has all information about user authentication with json web token and user model.

-  In order to validate fields we have used "validator" package from npm. see its documentation for its use.
-  We use bcrypt package to hash password and save it to the database. 
-  Also when retrieving password from database we are using instance method on user model where we decrypt password and compare with user password. then when loged in we generate the token. 