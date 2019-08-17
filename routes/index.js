var express = require('express');
var router = express.Router();

var login_controller = require('../controllers/loginController');

/* GET home page. */
router.get('/', login_controller.login);

router.post('/', login_controller.checklogin);

router.post('/poll', login_controller.poll);

router.post('/reset', login_controller.reset);

router.get('/result', login_controller.result);

router.post('/ssh', login_controller.ssh)

module.exports = router;
