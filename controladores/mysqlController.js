const Category = require('../modelos/Category');
const Product = require('../modelos/Product');
const ProductPhotos = require('../modelos/ProductPhotos');
const slug = require('slug');
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const Joi = require('@hapi/joi');

exports.categorias = async (request, response) => 
{
    try {
        let datos = await Category.findAll(
            {
                order: [ ['id', 'desc']],
                raw: true
            });
        return response.status(200).json(datos);
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
exports.categorias_detalle = async (request, response) => 
{
    const { id } = request.params;
    try {
        let categoria = await Category.findOne(
            {
                raw:true,
                where:
                {
                    'id':id
                }
            });
        if (!categoria)
        {
            response.status(400).json({ mensaje: "Error desconocido" });
        }
        return response.status(200).json(categoria);
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
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
            let categoria = await Category.findOne({
                raw: true,
                where:
                {
                    'nombre': nombre
                }
            });
            if (categoria) {
                response.status(400).json({ mensaje: 'Ocurrió un error inesperado, por favor vuelva a intentarlo' });
            }
            let guardar = await Category.create({ 'nombre': nombre });
            if (!guardar) {

                response.status(400).json({ mensaje: 'Ocurrió un error inesperado, por favor vuelva a intentarlo' });
            } else {
                response.status(201).json({ mensaje: 'Se ha creado el registro exitosamente' });
            } 
        } catch (error) {
            return response.status(400).json({ mensaje: error.message });
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
        return response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let categoria = await Category.findOne({
                raw: true,
                where:
                {
                    'id': id
                }
            });
            if (!categoria) {
                return response.status(400).json({ mensaje: "Error desconocido" });
            }
            await Category.update({ nombre: nombre, slug: slug(nombre).toLowerCase() }, { where: { id: id } });
            response.status(200).json({ mensaje: "Se modificó el registro exitosamente" });
        } catch (error) {
            response.status(400).json({ mensaje: error.message });
        }
    }
}
exports.categorias_delete = async (request, response) => 
{
    const { id } = request.params;
    try {
        let categoria = await Category.findOne({
            raw: true,
            where:
            {
                'id': id
            }
        });
        if (!categoria) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        let producto  = await Product.findOne(
            {
                where:
                {
                    'category_id': id
                },
                raw: true
            });
        if (producto) {
            return response.status(400).json({ mensaje: "No se puede eliminar el registro" });
        }
        await Category.destroy({
            where: {
                'id': id
            }
        });
        return response.status(200).json({ mensaje: "Se eliminó el registro exitosamente" });
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
exports.productos = async (request, response) => {
    try {
        let datos = await Product.findAll(
            {
                order: [['id', 'desc']],
                raw: true,
                include: { all: true, nested: true }
            });
        return response.status(200).json(datos);
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_detalle = async (request, response) => {
    const { id } = request.params;
    try {
        let datos = await Product.findOne(
            {
                order: [['id', 'desc']],
                raw: true,
                include: { all: true, nested: true },
                where:
                {
                    'id': id
                },
            });
        return response.status(200).json(datos);
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
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
        return response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let guardar = await Product.create(
                {
                    category_id: categoria_id,
                    nombre: nombre,
                    descripcion: descripcion,
                    precio: precio
                });
            if (!guardar) {
                response.status(400).json({ mensaje: 'Ocurrió un error inesperado, por favor vuelva a intentarlo' });
            } else {
                response.status(201).json({ mensaje: 'Se ha creado el registro exitosamente' });
            }
        } catch (error) {
            return response.status(400).json({ mensaje: error.message });
        }
    }
}
exports.productos_put = async (request, response) => 
{
    const { id } = request.params;
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
        return response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let producto = await Product.findOne({
                where:
                {
                    'id': id
                },
                raw: true,
            });
            if (!producto) {
                return response.status(400).json({ mensaje: "Error desconocido" });
            }
            await Product.update(
                {
                    nombre: nombre,
                    slug: slug(nombre).toLowerCase(),
                    precio: precio,
                    descripcion: descripcion,
                    category_id: categoria_id
                }, 
                {
                where: { id: id }
                }
            ); 
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
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            return response.status(400).json({ mensaje: 'Error desconocido' });
        }
        let foto = await ProductPhotos.findOne({
            where:
            {
                'product_id': id
            },
            raw: true,
        });
        if (foto) {
            return response.status(400).json({ mensaje: "No se puede eliminar el registro" });
        }
        await Product.destroy(
            {
                where: {
                    'id': id
                }
            });
        return response.status(200).json({ mensaje: 'Se eliminó el registro exitosamente' });
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_fotos = async (request, response) => 
{
    const { id } = request.params;
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        let fotos = await ProductPhotos.findAll(
            {
                raw: true,
                order: [
                    ['id', 'desc']
                ],
                where:
                {
                    'product_id': id
                }
            });
        return response.status(200).json(fotos);
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}
exports.productos_fotos_post = async (request, response) => {
    const { id } = request.params;
    const form = new formidable.IncomingForm();
    form.maxFileSize = 50 * 1024 * 1024;//5 MB
    try {
        let producto = await Product.findOne({
            where:
            {
                'id': id
            },
            raw: true,
        });
        if (!producto) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        form.parse(request, async (err, fields, files) => {
            try {
                if (err) {
                    return response.status(400).json({ mensaje: "Error desconocido " });
                }
                const file = files.foto;
                if (file.originalFilename === "") {
                    return response.status(400).json({ mensaje: "No se pudo subir la foto" });
                }
                const imageTypes = [
                    "image/jpeg",
                    "image/png",
                    "image/gif",
                ];
                if (!imageTypes.includes(file.mimetype)) {
                    return response.status(400).json({ mensaje: "Por favor agrega una imagen JPG|PNG|GIF" });
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
                    return response.status(400).json({ mensaje: "Máximo 5MB" });
                }
                const dirFile = path.join(
                    __dirname,
                    `../assets/uploads/producto/${nombre_final}`
                );
                fs.copyFile(file.filepath, dirFile, function (err) {
                    if (err) {
                        return response.status(400).json({ mensaje: "Error desconocido" });
                    }

                });
                let resultado = await ProductPhotos.create(
                    {
                        product_id: id,
                        nombre: nombre_final
                    });
                if (!resultado) {
                    return response.status(400).json({ mensaje: "Se produjo un error inesperado, por favor vuelva a intentarlo" });
                } else {
                    return response.status(201).json({ mensaje: "Se guardó la foto exitosamente" });
                }
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
        let producto = await Product.findOne({
            where:
            {
                'id': producto_id
            },
            raw: true,
        });
        if (!producto) {
            return response.status(400).json({ mensaje: "Error desconocido" });
        }
        let foto = await ProductPhotos.findOne({
            where:
            {
                'id': foto_id
            },
            raw: true,
        });
        if (!foto) {
           return response.status(400).json({ mensaje: "Error desconocido" });
        }
        fs.unlinkSync(`./assets/uploads/producto/${foto.nombre}`);
        await ProductPhotos.destroy(
            {
                where: {
                    'id': foto_id
                }
            });
        return response.status(200).json({ mensaje: "Se eliminó el registro exitosamente" });
    } catch (error) {
        return response.status(400).json({ mensaje: error.message });
    }
}