var express = require('express');
var router = express.Router();
var postsController = require('../controllers/postsController.js')
var loginController = require('../controllers/loginController')

// Blog home page.  GET //
router.get('/', postsController.bloglist_get  );


// View blog post page GET
router.get('/:id', postsController.bloglist_specific_get )

// Sign up POST
router.post('/sign_up', loginController.signup_user_post )

//Login Post
router.post('/login',loginController.login_user_post )

// User post Comments 
router.post('/:id/newcomment', postsController.comment_post)


module.exports = router;
