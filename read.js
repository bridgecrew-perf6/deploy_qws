var HID = require('node-hid');
var usb = require('usb');
const fs = require('fs').promises;
var request = require('request');
const imageToBase64 = require('image-to-base64');

peso = 0;
idVenda = null;
idFecho = null;

local = true;
if(local){
    rota = "http://127.0.0.1:8000/api/";
}
else{
    rota = "https://vendasphonecare.com/api/";
}

var pathImages = "C:\\Users\\Bruno Wan Der Maas\\Pictures\\Camera Roll";
var APIsendPhoto = rota + "changeImgVenda";
var APIGetVendaLida = rota + "vendaLida";
var APIGetFechoLido = rota + "fechoLido";
var APISendPhotoFecho = rota + "sendPhotoFecho";

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

async function clearPhotos(diretorio) {

    let listaDeArquivos = await fs.readdir(diretorio);
    for (let k in listaDeArquivos) {
        var arquivo = diretorio + '/' + listaDeArquivos[k];
        const splits = arquivo.split('.')
        var ext = splits[splits.length - 1];
        if(ext == 'jpg'){
            fs.unlink(arquivo)
        }
        
    }    
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
                        if(idVenda){
                            sendPhoto(idVenda, response);
                            idVenda = null;
                            clearPhotos(pathImages);
                            intervalGetVenda = setInterval(() =>{
                                getVendaLida();           
                            }, 1000);
                        }

                        if(idFecho){
                            sendPhotoFecho(idFecho, response);
                            clearPhotos(pathImages);
                        }
                        
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
        url: APIsendPhoto,
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
    }, function (error, response, body) {
        console.log(response);
    });
}

function sendPhotoFecho(idFecho, base64) {
    var myJSONObject = {
        'idFecho': idFecho,
        'base64': base64
    };
    request({
        url: APISendPhotoFecho,
        method: "POST",
        json: true,   // <--Very important!!!
        body: myJSONObject
    }, function (error, response, body) {
        console.log(response);
    });
}

function getVendaLida() {
    request({
        url: APIGetVendaLida,
        method: "GET",
        json: true,   // <--Very important!!!        
    }, function (error, response, body) {
        if(body.vendaLida && body.vendaLida > 0){
            console.log('find venda');
            idVenda = body.vendaLida;
            clearInterval(intervalGetVenda);            
        }        
    });
}

function getFechoLido() {
    request({
        url: APIGetFechoLido,
        method: "GET",
        json: true,   // <--Very important!!!        
    }, function (error, response, body) {
        if(body.fechoLido && body.fechoLido > 0){
            idFecho = body.fechoLido;
        }
        else{
            idFecho = null;
        }
    });
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

    var ntervalFecho = setInterval(() =>{
        if(idFecho){
            console.log('execute fecho');
            test();
        }               
    }, 1000);

    intervalGetVenda = setInterval(() =>{
        getVendaLida();           
    }, 1000);

    intervalGetFechoLigo = setInterval(() =>{
        getFechoLido();           
    }, 1000);


server.get('/teste', jsonParser,(req, res) => {
    return res.json('teste ok')
})

server.listen(3000, () => {
    console.log('Server Running');
})