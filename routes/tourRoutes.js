const express = require('express');
const { getAllTours, getTour, createTour, updateTours, deleteTour, topCheapTours, getTourStats, getMonthlyPlan } = require('./../controllers/tourControllers')
const { protectedRoutes } = require('./../controllers/authController')

const router = express.Router();

//router.param('id', checkId);
//Create a CheckBody middleware.
//Check if body contains the name and price property,
//if not, send back 400 (bad request)
//add it to the post handler stack. 

//create a aliase route.
router.route('/top-5-tours').get(topCheapTours, getAllTours)
router.route('/tour-stats').get(getTourStats)
router.route('/monthly-plan/:year').get(getMonthlyPlan)

router.route('/')
    .get(protectedRoutes , getAllTours)
    .post(createTour)

router.route('/:id')
    .get(getTour)
    .patch( updateTours)
    .delete( deleteTour)

module.exports = router