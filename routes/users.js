var express = require('express');
var user = require('../controllers/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/login', user.login);
router.get('/register', user.register);
router.get('/logout', user.logout);
router.get('/chklogin', user.chkLogin);

module.exports = router;
