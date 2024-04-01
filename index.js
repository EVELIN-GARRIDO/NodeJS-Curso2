const express = require("express");
const app = express();

const bodyParser = require('body-parser');
//para poder usar variables globales
require('dotenv').config();
//se llama a la conexión con mongodb
require('./database/mongodb');
require('./modelos/Categoria');
require('./modelos/Producto');
require('./modelos/ProductoFoto');
//se llama la conexión a mysql
const mysql_conexion = require('./database/mysqldb');
mysql_conexion.sync()
    .then(() => {
        //console.log("conectado al servidor");
    }).catch(error => { console.log(error); });
require('./modelos/Category');
require('./modelos/Product');
require('./modelos/ProductPhotos');
require('./modelos/User');
//middlewares para body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//archivos estáticos
app.use(express.static(__dirname + "/assets"));

//se registran las rutas
app.use("/", require('./rutas/rutas'));

//personalizar página 404
app.use(function(request, response){
    response.status(404).json(
        {
            mensaje: 'Error 404 - Página no encontrada'
        });
});
app.listen(process.env.PORT, ()=>{

    console.log("trabajando nuestra API")
});