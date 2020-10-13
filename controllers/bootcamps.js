const Bootcamp = require('../models/Bootcamp');
const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const geocoder=require('../utils/geocoder');
// Get all bootcamps
// GET /api/v1/bootcamps
//public
exports.getBootcamps = asyncHandler(async(req, res, next) => {   
  res.status(200).json(res.advancedResults);
});
// Get a bootcamp
// GET /api/v1/bootcamps/:id
//public
exports.getBootcamp =asyncHandler(async (req, res, next) => {
        const bootcamp=await Bootcamp.findById(req.params.id);
        if(!bootcamp){
          return next( new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
          );}
        res
        .status(200)
        .json({ success: true, data: bootcamp});

      next( new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
});
// Create a bootcamp
//POST /api/v1/bootcamps/:id
//private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({ success: true, data: bootcamp });
    //res.status(400).json({ success: false });
    next(err);
});
// Update a bootcamp
// PUT /api/v1/bootcamps/:id
//private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
          const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){
          return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
          );
        }
        res.status(201).json({ success: true, data: bootcamp });
    });
// Delete a bootcamp
// DELETE /api/v1/bootcamps
//private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {

        const bootcamp = await Bootcamp.findById(req.params.id);
        if(!bootcamp){
          return next(
            new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
          );
        }
        bootcamp.remove();
        res.status(200).json({ success: true, data: {} });
    });
// GET  bootcamps within radius
// GET  /api/v1/bootcamps/radius/:zipcode/:distance
//private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {

  const { zipcode,distance} = req.params;
  const loc =  await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;
  //earth radius = 3963 mi /6378 km
  const radius = distance/ 3963;
  const bootcamps= await Bootcamp.find({
    location:{ $geoWithin:{ $centerSphere: [ [ lng,lat ],radius ] } }
  })
   res.status(200).json({
     success:true,
     country:bootcamps.length,
     data:bootcamps
   })
});
// Upload a photo for bootcamp
// PUT /api/v1/bootcamps/:id/photo
//private
exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {

  const bootcamp = await Bootcamp.findById(req.params.id);
  if(!bootcamp){
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  }
  if(!req.files){
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;
  if(!file.mimetype.startsWith('image')){
    return next(new ErrorResponse(`Please upload an image file`, 400));
  }
  if(file.size > process.env.MAX_FILE_UPLOAD){
    return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD} `, 400));
  }
  file.name=`photo_${bootcamp._id}${path.parse(file.name).ext}`;
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err => {
    if(err){
      console.log(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    await Bootcamp.findByIdAndUpdate(req.params.id,{ photo:file.name });
  
    res.status(200).json({
      success:true,
      data:file.name
    });
  });
});