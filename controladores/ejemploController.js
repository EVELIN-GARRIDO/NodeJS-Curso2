const Joi =require('@hapi/joi');
const formidable = require('formidable');
const fs = require('fs');
const path = require('path');

exports.metodo_get = (request, response)=>
{
    return response.json(
        {
            mensaje : "Método GET"
        });
}
exports.metodo_get_detalle = (request, response) => {
    const {id} = request.params;
    return response.json(
        {
            mensaje: "Método GET detalle | id="+id
        });
}
exports.metodo_post = (request, response) => {
    return response.json(
        {
            mensaje: "Método POST"
        });
}
/*{"correo":"info@tamila.cl", "password": "123456"} */
exports.metodo_post_json_request = (request, response) => {
    
    const {correo, password} = request.body;

    const schema = Joi.object({ 
        correo: Joi.string().min(6).max(50).email({ minDomainSegments: 2 }).required().messages({
            'string.min': `El campo correo debe tener al menos 6 caracteres`,
            'string.max': `El campo correo debe tener como máximo 6 caracteres`,
            'any.required': `El campo correo es obligatorio`,
            'string.email': `El campo correo debe tener un E-Mail válido`,
        }),
        password: Joi.string().min(6).max(60).required().messages({
            'string.min': `El campo password debe tener al menos 6 caracteres`,
            'string.max': `El campo cpasswordorreo debe tener como máximo 6 caracteres`,
            'any.required': `El campo password es obligatorio`
        })
    });
    const {error, value} = schema.validate({correo: correo, password: password});
    if(error)
    {
        response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        return response.json(
            {
                mensaje: "Método POST con json request | correo=" + correo + " | password=" + password
            });
    }
    
}
exports.metodo_post_upload = (request, response) => 
{
    const form = new formidable.IncomingForm();
    form.maxFileSize = 100 * 1024 * 1024;//10 MB
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
            if (!imageTypes.includes(file.mimetype)) 
            {
                response.status(400).json({ mensaje: "Por favor agrega una imagen JPG|PNG|GIF" });
            }
            if (file.size > 100 * 1024 * 1024) {
 
                response.status(400).json({ mensaje: "Máximo 10MB" });
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

            const dirFile = path.join(__dirname, `../assets/uploads/udemy/${nombre_final}`);

            fs.copyFile(file.filepath, dirFile, function (err) {
                if (err) throw err;

            });
            response.status(200).json({ mensaje: "Se subió la imagen exitosamente" });

        } catch (error) {
            response.status(400).json({ mensaje: error.message });
        }

    });
}
exports.metodo_put = (request, response) => {
    return response.json(
        {
            mensaje: "Método PUT"
        });
}
exports.metodo_delete = (request, response) => {
    return response.json(
        {
            mensaje: "Método DELETE"
        });
}