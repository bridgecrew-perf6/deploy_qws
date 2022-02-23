const Service = require('node-windows').Service

const svc = new Service({
    name: "nodeBasicServer",
    description: "API DYMO SCALE",
    script: "C:\\Users\\Bruno Wan Der Maas\\Desktop\\node js\\node-api-dymo\\read.js"
})

svc.on('install', function (){
    svc.start()
})

svc.install()