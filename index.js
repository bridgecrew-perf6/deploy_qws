var HID = require('node-hid');
var usb = require('usb');

var reading = false,
    interval,
    vid = 0x922,
    pid = 0x8003;

    function startReading() {
        if (reading) return;
        try {
            var d = new HID.HID(vid, pid);
    
            console.log('Starting to read data from scale');
            reading = true;
    
            d.on("data", function (data) {
                var buf = new Buffer(data);
                var grams = buf[4] + (256 * buf[5]);
                console.log(new Date().toISOString() + ': ' + grams + ' grams');
                return grams;
            });
    
            d.on("error", function (error) {
                console.log(error);
                reading = false;
                d.close();
            });
        } catch (err) {
            if (/cannot open device/.test(err.message)) {
                return 'Dymo cannot be found';
                //console.log('Dymo M10 cannot be found');
            } else
                console.log(err);
                return err;
        }
    }

const express = require('express');
const server = express();

server.get('/teste', (req, res) => {
    return res.json(startReading())
    
});

server.listen(3000, () =>{
    console.log('Server Running');
})