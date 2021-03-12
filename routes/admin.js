var express = require('express');
var router = express.Router();
var login_controller = require('../controllers/loginController');
var post_controller = require('../controllers/postsController');



// List of all blog posts
router.get('/blogs', post_controller.bloglist_get_admin );

// GET specific blog post

router.get('/blogs/:id', post_controller.bloglist_specific_get );

// Create a blog post
router.post('/blogs/create', post_controller.create_post);
// Publish blog post
router.put('/blogs/:id/publish', post_controller.publish_blog );

//Unpublish blog post 
router.put('/blogs/:id/unpublish', post_controller.unpublish_blog);
// Edit blog post
router.put('/blogs/:id/edit', post_controller.edit_blog );

// Delete blog post
router.delete('blogs/:id/delete', post_controller.delete_post);





module.exports = router;
