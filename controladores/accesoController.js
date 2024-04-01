const Joi = require('@hapi/joi');
const jwt = require('jwt-simple');
const moment = require('moment');
const User = require('../modelos/User');
const bcrypt = require("bcryptjs");

/*{"correo":"info@tamila.cl", "password": "123456"} */
exports.login = async (request, response) => 
{
    const { correo, password } = request.body;
    const schema = Joi.object({
        correo: Joi.string().min(6).max(50).email({ minDomainSegments: 2 }).required().messages({

            'string.min': `El campo correo debe tener al menos 6 caracteres`,
            'string.max': `El campo correo debe tener como máximo 60 caracteres`,
            'any.required': `El campo correo es obligatorio`,
            'string.email': `El campo correo debe tener un E-Mail válido`,
        }),
        password: Joi.string().min(6).max(60).required().messages({
            'string.min': `El campo password debe tener al menos 6 caracteres`,
            'string.max': `El campo password debe tener como máximo 60 caracteres`,
            'any.required': `El campo password es obligatorio`
        })
    });
    const { error, value } = schema.validate({ correo: correo, password: password });
    if(error)
    {
        return response.status(400).json({ mensaje: error.details[0].message });
    }else
    {
        try {
            let user = await User.findOne(
                {
                    where:
                    {
                        correo: correo
                    },
                    raw: true
                });
            if (!user) {
                return response.status(400).json({ mensaje: 'Los datos ingresados no son correctos' });
            }
            bcrypt.compare(password, user.password, (err, data)=>{
                if (err) {
                    return response.status(400).json({ mensaje: 'Los datos ingresados no son correctos' });
                }
                if(data)
                {
                    let payload = {
                        sub: user.id,
                        nombre: user.nombre,
                        correo: user.correo,
                        iat: moment().unix(),
                        exp: moment().add(30, 'days').unix()
                    };
                    let token = jwt.encode(payload, process.env.SECRETO);
                    return response.status(200).json(
                        {
                            mensaje: token
                        });
                }
            });
        } catch (error) {
            return response.status(400).json({ mensaje: error.message });
        }
    }

}