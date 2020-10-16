const User = require('../models/User');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');


// GET all users
// POST /api/v1/auth/register
// private/admin
exports.getUsers = asyncHandler(async(req, res, next) => {   
   
    res.status(200).json(res.advancedResults);
  });

  // GET single user
//   GET  /api/v1/auth/users/:id
//   private/admin
exports.getUser = asyncHandler(async(req, res, next) => {   
    const user = await User.findById(req.params.id);
   
    res.status(200).json({success:true,data:user});
  });
  
//Create User
// POST /api/v1/auth/users
// private/admin
exports.createUser = asyncHandler(async(req, res, next) => {   
   
    const user= await User.create(req.body);
    res.status(201).json({success:true,data:user});
  });
//Update User
// PUT /api/v1/auth/users/:id
// private/admin
exports.updateUser = asyncHandler(async(req, res, next) => {   
   
    const user= await User.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    res.status(200).json({success:true,data:user});
  });
//Delete User
// PUT /api/v1/auth/users/:id
// private/admin
exports.deleteUser = asyncHandler(async(req, res, next) => {   
   
    const user= await User.findByIdAndDelete(req.params.id);
    res.status(200).json({success:true,data:{}  });
  });
