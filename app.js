const express = require('express');
let router = express.Router();
const door_lock_helper = require('./helper/door_lock_helper')
const app = express()


router.get('/', async function(req, res) {
    try{

        await door_lock_helper.getQrCode()
    }
    catch (e) {
        console.log(e)
        res.status(400)
    }
});


app.use('/',router);
module.exports = app;


var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port)
});