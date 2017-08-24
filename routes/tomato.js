var express = require('express');
var router = express.Router();
var tomato = require('../controllers/tomato');

/* GET users listing. */
router.get('/list', tomato.list);
router.get('/add', tomato.add);

module.exports = router;
