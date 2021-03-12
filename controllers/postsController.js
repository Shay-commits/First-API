var Post = require('../models/postModel');
var Comments = require('../models/commentsModel');
var User = require('../models/userModel');
var async = require('async');
const commentsModel = require('../models/commentsModel');
const {body,validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');



// GET blog posts for reguler user

exports.bloglist_get = function(req,res,next) {
  Post.find({status: 'active'}).exec( function(err, results) {
    if (err) { res.send (err) }
    res.json(results);
  })
}

// GET Blog posts for admin 

exports.bloglist_get_admin = function (req,res) {
  Post.find({}).exec(function(err,results) {
    if (err) {res.send(err)}
    res.json(results)
  })

}

// GET  Specific Blog post
exports.bloglist_specific_get = function(req,res, next) {
  async.parallel({
    post: function(callback) {
      Post.findById(req.params.id).exec(callback)
    },
    comments: function(callback) {
      Comments.find({post: req.params.id}).populate('user').exec(callback)
      }
    },
    function(err, results) {
        if (err) { 
          console.log(results)
          console.log('there was an error')
          res.json(err) }
        res.json(results);
      }
  );
}

// Post comment on blog post
exports.comment_post = [

  // Validate fields.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('body', 'Body must not be empty.').isLength({ min: 1 }).trim(),
 

  //Sanitize fields.
  sanitizeBody('title').escape(),
  sanitizeBody('body').escape(),
   

//Process request after validation and sanitization
(req, res, next) => {

  //Extract validation errors from request
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.send('data failed validation')
  }

  // User data, specifically will be provided when the user logs in; this needs to be stored in local Storage and sent in the body of the request 

   async.parallel({

    user: function(callback) {
      User.findById(req.body.user).exec(callback)
    },
    post: function(callback) {
      Post.findById(req.params.id).exec(callback)
    }
   }, 
   function(err, data) {
    if (err) { 
      console.log(results)
      console.log('there was an error')
      res.json(err) }
      
      
    let comment = {
      title: req.body.title,
      body: req.body.body,
      user: data.user.id,
      post: data.post.id,
      timestamp: Date.now()
      }

    let newComment = new Comments(comment)

    newComment.save(function(err,results) {
      if (err) {return next(err) }
      res.json({message:'comment added', results })
    })
})
}

]


// Create Blog Post
exports.create_post = [

  // Validate fields.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('body', 'Body must not be empty.').isLength({ min: 1 }).trim(),
 

  //Sanitize fields.
  sanitizeBody('title').escape(),
  sanitizeBody('body').escape(),
  
  //Process request after validation and sanitization
  (req, res, next) => {

    //Extract validation errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send('data failed validation')
    }

     
    
    blog_post = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    timestamp: Date.now()
    }

    var post = new Post(blog_post);

    post.save(function(err,results) {
      if (err) {res.send(err)};
      res.json(results);
    })
 } 
]

// Publish Blog Post

exports.publish_blog = function(req,res,next) {

  Post.findByIdAndUpdate(req.params.id, {status:'active'}).exec( function(err,results) {
    if (err) {res.send(err) };
    res.json({message:'Post is published'});
  })
}

// Unpublish Blog Post
exports.unpublish_blog = function(req,res,next) {

  Post.findByIdAndUpdate(req.params.id, {status: 'inactive'}).exec(function(err,results) {
    if (err) {res.send(err) }
    res.json({message: 'Post is unpublished'})

  });
}

// Edit Blog Post 

exports.edit_blog =  [

  // Validate fields.
  body('title', 'Title must not be empty.').isLength({ min: 1 }).trim(),
  body('body', 'Author must not be empty.').isLength({ min: 1 }).trim(),
 

  //Sanitize fields.
  sanitizeBody('title').escape(),
  sanitizeBody('body').escape(),
  
  //Process request after validation and sanitization
  (req, res, next) => {

    //Extract validation errors from request
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.send('data failed validation')
    }

     
    
    blog_post = {
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    _id: req.params.id
    }

    var post = new Post(blog_post);

    Post.findByIdAndUpdate(req.params.id, post, {new:true}).exec(function(err,results) {
      if (err) {res.send(err)}
      res.json(results)
    })
  }
]   

//Delete Blog Post
exports.delete_post = function(req,res,next) {
  Post.findByIdAndRemove(req.params.id).exec( function(err,results) {
    if (err) {res.send(err) }
    res.json({message: 'Post is deleted'})
  })
}
