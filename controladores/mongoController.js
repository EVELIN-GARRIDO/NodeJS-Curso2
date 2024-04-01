const Categoria = require('../modelos/Categoria');
const Producto = require('../modelos/Producto');
const ProductoFoto = require('../modelos/ProductoFoto');
const Joi = require('@hapi/joi');
const slug = require('slug');
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");


exports.categorias = async(request, response)=>
{
    try {
        let datos = await Categoria.find().lean().sort({_id: -1});
        return response.status(200).json(datos);
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
exports.categorias_detalle = async (request, response) => 
{
    const { id } = request.params;
    try {
        let datos = await Categoria.findById(id).lean();
        if (!datos) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        return response.status(200).json(datos);
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
/* {"nombre":"mi categoría desde rest"} */
exports.categorias_post = async (request, response) => 
{
    const { nombre } = request.body;
    const schema = Joi.object({
        nombre: Joi.string().min(6).required().messages({
            'string.min': `El campo nombre debe tener al menos 6 caracteres`,
            'any.required': `El campo nombre es obligatorio`
        })
    });
    const { error, value } = schema.validate({ nombre: nombre });
    if(error)
    {
        response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let categoria = await Categoria.findOne({ nombre: nombre });
            if (categoria) {
                response.status(400).json({ mensaje: 'Ya existe esta categoría' });
            }
            save = new Categoria(
                {
                    nombre: nombre
                }
            );
            await save.save();
            response.status(201).json({ mensaje: 'Se ha creado el registro exitosamente' });
        } catch (error) {
            response.status(400).json({ mensaje: error.message });
        }
    }
}
exports.categorias_put = async (request, response) => 
{
    const { id } = request.params;
    const { nombre } = request.body;
    const schema = Joi.object({
        nombre: Joi.string().min(6).required().messages({
            'string.min': `El campo nombre debe tener al menos 6 caracteres`,
            'any.required': `El campo nombre es obligatorio`
        })
    });
    const { error, value } = schema.validate({ nombre: nombre });
    if(error)
    {
        response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let categoria = await Categoria.findById(id);
            if (!categoria) {
                response.status(400).json({ mensaje: "Error desconocido" });
            }
            await categoria.updateOne({ nombre: nombre, slug: slug(nombre).toLowerCase() });
            return response.status(200).json({ mensaje: "Se modificó el registro exitosamente" });
        } catch (error) {
            return response.status(400).json({ mensaje: error.message });
        }
    }
}
exports.categorias_delete = async (request, response) => 
{
    const { id } = request.params;
    try {
        let categoria = await Categoria.findById(id);
        if (!categoria) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        let producto = await Producto.findOne({categoria_id: id}).lean();
        if(producto)
        {
            return response.status(400).json({ mensaje: "No se puede eliminar el registro" });
        }
        await categoria.remove();
        response.status(200).json({ mensaje: "Se eliminó el registro exitosamente" });
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
exports.productos = async (request, response) => {
    try {
        let datos = await Producto.find().populate('categoria_id').lean().sort({ _id: -1 });
        return response.status(200).json(datos);
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_detalle = async (request, response) => {
    const { id } = request.params;
    try {
        let datos = await Producto.findById(id).populate('categoria_id');
        return response.status(200).json(datos);
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
/*{
    "nombre": "Producto desde API Rest tutoñandú",
    "descripcion": "Descripción de prueba",
    "precio": 2234,
    "categoria_id":"632737ace883b56437403490"
	
} */
exports.productos_post = async (request, response) => 
{
    const { nombre, descripcion, precio, categoria_id } = request.body;
    const schema = Joi.object({
        nombre: Joi.string().min(6).required().messages({
            'string.min': `El campo nombre debe tener al menos 6 caracteres`,
            'any.required': `El campo nombre es obligatorio`
        }),
        descripcion: Joi.string().min(6).required().messages({
            'string.min': `El campo descripción debe tener al menos 6 caracteres`,
            'any.required': `El campo descripción es obligatorio`
        }),
        precio: Joi.number().integer().min(1).required().messages({
            'any.required': `El campo precio es obligatorio`,
            'number.min': `El campo precio debe tener al el valor 1`,
        }),
        categoria_id: Joi.string().required().messages({
            'any.required': `El campo categoria_id es obligatorio`
        })
    });
    const { error, value } = schema.validate({ nombre: nombre, descripcion: descripcion, precio: precio, categoria_id: categoria_id });
    if(error)
    {
        response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            save = new Producto(
                {
                    categoria_id: categoria_id,
                    nombre: nombre,
                    precio: precio,
                    descripcion: descripcion
                }
            );
            await save.save();
            return response.status(201).json({ mensaje: "Se creó el registro exitosamente" });
        } catch (error) {
            response.status(400).json({ mensaje: error.message });
        }
    }

}
exports.productos_put = async (request, response) => 
{
    const { id } = request.params;
    const { nombre, precio, descripcion, categoria_id } = request.body;
    const schema = Joi.object({
        nombre: Joi.string().min(6).required().messages({
            'string.min': `El campo nombre debe tener al menos 6 caracteres`,
            'any.required': `El campo nombre es obligatorio`
        }),
        descripcion: Joi.string().min(6).required().messages({
            'string.min': `El campo descripción debe tener al menos 6 caracteres`,
            'any.required': `El campo descripción es obligatorio`
        }),
        precio: Joi.number().integer().min(1).required().messages({
            'any.required': `El campo precio es obligatorio`,
            'number.min': `El campo precio debe tener al el valor 1`,
        }),
        categoria_id: Joi.string().required().messages({
            'any.required': `El campo categoria_id es obligatorio`
        })
    });
    const { error, value } = schema.validate({ nombre: nombre, descripcion: descripcion, precio: precio, categoria_id: categoria_id });
    if(error)
    {
        response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let producto = await Producto.findById(id);
            if (!producto) {
                return response.status(400).json({ mensaje: "Error desconocido" });
            }
            await producto.updateOne({ categoria_id: categoria_id, nombre: nombre, precio: precio, descripcion: descripcion, slug: slug(nombre).toLowerCase() });
            return response.status(200).json({ mensaje: "Se modificó el registro exitosamente" });
        } catch (error) {
            return response.status(400).json({ mensaje: error.message });
        }
        
    }
}
exports.productos_delete = async (request, response) => 
{
    const { id } = request.params;
    try {
        let producto = await Producto.findById(id);
        if (!producto) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        let fotos = await ProductoFoto.findOne(
            {
                producto_id:id
            }).lean();
        if(fotos)
        {
            return response.status(400).json({ mensaje: "No se puede eliminar el registro" });
        }
        await producto.remove();
        return response.status(200).json({ mensaje: "Se eliminó el registro exitosamente" });
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_fotos = async (request, response) => 
{
    const { id } = request.params;
    try {
        let producto = await Producto.findById(id);
        if (!producto) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        let fotos = await ProductoFoto.find(
            {
                producto_id: id
            }).lean();
        return response.status(200).json(fotos);
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_fotos_post = async (request, response) => 
{
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024;//5 MB

    try {
        const { id } = request.params;
        const producto = await Producto.findById(id).lean();
        if (!producto) { 
            response.status(400).json({ mensaje: "No existe el producto" });
        }
        form.parse(request, async (err, fields, files) => {
            try {
                if (err) { 
                    response.status(400).json({ mensaje: 'Se produjo un error: ' + err });
                }
                const file = files.foto;
                if (file.originalFilename === "") { 
                    response.status(400).json({ mensaje: "No se subió ninguna imagen" });
                }
                const imageTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                ];
                if (!imageTypes.includes(file.mimetype)) {
                    response.status(400).json({ mensaje: "Por favor agrega una imagen JPG|PNG|GIF" });
                }
                var unix = Math.round(+new Date() / 1000);

                switch (file.mimetype) {
                    case "image/jpeg":
                        nombre_final = unix + ".jpg";
                        break;
                    case "image/png":
                        nombre_final = unix + ".png";
                        break;
                    case "image/gif":
                        nombre_final = unix + ".gif";
                        break;
                }
                if (file.size > 50 * 1024 * 1024) { 
                    response.status(400).json({ mensaje: "Máximo 5 MB" });
                }

                const dirFile = path.join(
                    __dirname,
                    `../assets/uploads/producto/${nombre_final}`
                );


                fs.copyFile(file.filepath, dirFile, function (err) {
                    if (err) throw err;

                });



                save = new ProductoFoto(
                    {
                        producto_id: id,
                        nombre: `${nombre_final}`
                    }
                );

                await save.save();
                response.status(201).json({ mensaje: "Se creó el registro exitosamente" });

            } catch (error) {
                response.status(400).json({ mensaje: error.message });
            }

        });
    } catch (error) {
        response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_fotos_delete = async (request, response) =>
{
    const { producto_id, foto_id } = request.params;
    try {
        let producto = await Producto.findById(producto_id).lean();
        if (!producto) {
            response.status(400).json({ mensaje: "Error desconocido" });
        }
        let foto = await ProductoFoto.findById(foto_id);
        if (!foto) {
            response.status(400).json({ mensaje: "Error desconocido" });
        }
        fs.unlinkSync(`./assets/uploads/producto/${foto.nombre}`);
        await foto.remove();
        
        response.status(200).json({ mensaje: 'Se eliminó el registro exitosamente' }); 
    } catch (error) {
        response.status(400).json({ mensaje: error.message }); 
    }
}