var HID = require('node-hid');
var usb = require('usb');

var reading = false,
    interval,
    vid = 0x922,
    pid = 0x8003;

    peso = 0;

    function startReading() {
        if (reading) return;
        try {
            var d = new HID.HID(vid, pid);
    
            console.log('Starting to read data from scale');
            reading = false;
    
            d.on("data", function (data) {
                var buf = new Buffer(data);
                var grams = buf[4] + (256 * buf[5]);
                peso = grams;
                console.log(new Date().toISOString() + ': ' + grams + ' grams');
            });
    
            d.on("error", function (error) {
                console.log(error);
                reading = false;
                d.close();
            });

            return {'peso': peso};
        } catch (err) {
            if (/cannot open device/.test(err.message)) {
                return {'erro': 'Balança não encontrada!'}
            } else
                return {'erro': err};
        }
    }

const express = require('express');
const { response } = require('express');
const server = express();

server.get('/getPeso', (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return res.json(startReading())
    
});

server.listen(3000, () =>{
    console.log('Server Running');
})