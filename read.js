var HID = require('node-hid');
var usb = require('usb');
const fs = require('fs').promises;
var request = require('request');
const imageToBase64 = require('image-to-base64');

var reading = false,
    interval,
    vid = 0x922,
    pid = 0x8003;

peso = 0;
idVenda = null;
var pathImages = "C:\\Users\\Bruno Wan Der Maas\\Pictures\\Camera Roll";

async function listarArquivosDoDiretorio(diretorio, arquivos) {

    if (!arquivos)
        arquivos = [];

    let listaDeArquivos = await fs.readdir(diretorio);
    for (let k in listaDeArquivos) {
        let stat = await fs.stat(diretorio + '/' + listaDeArquivos[k]);
        if (stat.isDirectory())
            await listarArquivosDoDiretorio(diretorio + '/' + listaDeArquivos[k], arquivos);
        else
            arquivos.push(diretorio + '/' + listaDeArquivos[k]);
    }

    return arquivos;

}

async function clearPhotos(diretorio, idVenda) {

    let listaDeArquivos = await fs.readdir(diretorio);
    for (let k in listaDeArquivos) {
        var arquivo = diretorio + '/' + listaDeArquivos[k];
        const splits = arquivo.split('.')
        var ext = splits[splits.length - 1];
        if(ext == 'jpg'){
            fs.unlink(arquivo)
        }
        
    }
    idVenda = idVenda;
}

async function test() {
    let arquivos = await listarArquivosDoDiretorio(pathImages); // coloque o caminho do seu diretorio

    for (let k in arquivos) {
        var arquivo = arquivos[k];
        const splits = arquivo.split('.')
        var ext = splits[splits.length - 1];
        if (ext == 'jpg') {
            imageToBase64(arquivo) // Path to the image
                .then(
                    (response) => {
                        sendPhoto(idVenda, response);
                        fs.unlink(arquivo)
                        idVenda = null;
                    }
                )
                .catch(
                    (error) => {
                        console.log(error); // Logs an error if there was one
                    }
                )
        }
    }
    //console.log(arquivos);   
    return JSON.stringify(arquivos);
}

function sendPhoto(idVenda, base64) {
    var myJSONObject = {
        'idVenda': idVenda,
        'base64': base64
    };
    request({
        url: "https://vendasphonecare.com/api/changeImgVenda",
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
    }, function (error, response, body) {
        console.log(response);
    });
}

function listener(){
    if(idVenda){
        console.log('read function');
    }
    else{
        console.log('nothing');
    }
}


const express = require('express');
const { response } = require('express');
const server = express();
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var urlencodedParser = bodyParser.urlencoded({ extended: false })


    var intervalVenda = setInterval(() =>{
        if(idVenda){
            console.log('execute');
            test();
        }               
    }, 1000);


server.get('/readQR/:idVenda', jsonParser,(req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    clearPhotos(pathImages, req.body.idVenda);
    idVenda = req.params.idVenda
    return res.json('teste')
})

server.listen(3000, () => {
    console.log('Server Running');
})