const jwt = require('jwt-simple');
const moment = require('moment'); 

exports.comprobarToken = function (request, response, next)
{
    if (!request.headers.authorization)
    {
        return response.status(401).json({ mensaje: 'La petición no está autorizada' });
    }
    let token = request.headers.authorization.replace(/['"]+/g, '');
    try {
        var payload = jwt.decode(token, process.env.SECRETO);
        if (payload.exp <= moment().unix()) {
            return response.status(401).json({ mensaje: 'El token ha expirado' });
        }
    } catch (error) {
        return response.status(401).json({ mensaje: 'El token no es válido' });
    }
    request.user = payload;
    next();
};