var express = require('express');
var router = express.Router();
var tomato = require('../controllers/tomato');

/* GET users listing. */
router.get('/list', tomato.list);
router.get('/add', tomato.add);
router.get('/delete', tomato.deleteOne);
router.get('/update', tomato.update);
router.get('/getone', tomato.getOne);

module.exports = router;
