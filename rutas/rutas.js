const express = require('express');
const router = express.Router();

const ejemploController = require('../controladores/ejemploController');
const mongoController = require('../controladores/mongoController');
const mysqlController = require('../controladores/mysqlController');
const accesoController = require('../controladores/accesoController');
const auth = require('../middleware/auth');

let api_ruta="/api/v1/";
//ejemplos
router.get(`${api_ruta}ejemplo`, ejemploController.metodo_get);
router.get(`${api_ruta}ejemplo/:id`, ejemploController.metodo_get_detalle);
router.post(`${api_ruta}ejemplo`, ejemploController.metodo_post);
router.post(`${api_ruta}ejemplo-json-request`, ejemploController.metodo_post_json_request);
router.post(`${api_ruta}ejemplo-upload`, ejemploController.metodo_post_upload);
router.put(`${api_ruta}ejemplo`, ejemploController.metodo_put);
router.delete(`${api_ruta}ejemplo`, ejemploController.metodo_delete);

//mongo
router.get(`${api_ruta}mongo/categorias`, mongoController.categorias);
router.get(`${api_ruta}mongo/categorias/:id`, mongoController.categorias_detalle);
router.post(`${api_ruta}mongo/categorias`, mongoController.categorias_post);
router.put(`${api_ruta}mongo/categorias/:id`, mongoController.categorias_put);
router.delete(`${api_ruta}mongo/categorias/:id`, mongoController.categorias_delete);
router.get(`${api_ruta}mongo/productos`, mongoController.productos);
router.get(`${api_ruta}mongo/productos/:id`, mongoController.productos_detalle);
router.post(`${api_ruta}mongo/productos`, mongoController.productos_post);
router.put(`${api_ruta}mongo/productos/:id`, mongoController.productos_put);
router.delete(`${api_ruta}mongo/productos/:id`, mongoController.productos_delete);
router.get(`${api_ruta}mongo/productos/fotos/:id`, mongoController.productos_fotos);
router.post(`${api_ruta}mongo/productos/fotos/:id`, mongoController.productos_fotos_post);
router.delete(`${api_ruta}mongo/productos/fotos/:producto_id/:foto_id`, mongoController.productos_fotos_delete);

//mysql
router.get(`${api_ruta}mysql/categorias`, [auth.comprobarToken] ,mysqlController.categorias);
router.get(`${api_ruta}mysql/categorias/:id`, mysqlController.categorias_detalle);
router.post(`${api_ruta}mysql/categorias`, mysqlController.categorias_post);
router.put(`${api_ruta}mysql/categorias/:id`, mysqlController.categorias_put);
router.delete(`${api_ruta}mysql/categorias/:id`, mysqlController.categorias_delete);

router.get(`${api_ruta}mysql/productos`, mysqlController.productos);
router.get(`${api_ruta}mysql/productos/:id`, mysqlController.productos_detalle);
router.post(`${api_ruta}mysql/productos`, mysqlController.productos_post);
router.put(`${api_ruta}mysql/productos/:id`, mysqlController.productos_put);
router.delete(`${api_ruta}mysql/productos/:id`, mysqlController.productos_delete);
router.get(`${api_ruta}mysql/productos/fotos/:id`, mysqlController.productos_fotos);
router.post(`${api_ruta}mysql/productos/fotos/:id`, mysqlController.productos_fotos_post);
router.delete(`${api_ruta}mysql/productos/fotos/:producto_id/:foto_id`, mysqlController.productos_fotos_delete);

//acceso
router.post(`${api_ruta}acceso/login`, accesoController.login);

module.exports = router;
