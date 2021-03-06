const jwt = require('jsonwebtoken');

// ============================
// Verificar Token
// ============================

let verificaToken = (req,res,next) => {

    let token = req.get('token');
    
    jwt.verify( token, process.env.SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
    console.log(token);

};

// ============================
// Verificar Admin Role
// ============================

let verificaAdminRole = (req, res, next) => {
    let usuario = req.usuario;
    console.log(usuario);
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok: false,
            err:{
                message: "El usuario no tiene permisos para realizar esta accion"
            }
        });
    }
    
    
};

// ============================
// Verifica token para imagen
// ============================


let verificaTokenImg = (req,res,next)=>{
    let token = req.query.token;

    jwt.verify( token, process.env.SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok:false,
                err:{
                    message: "Token no valido"
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });
}

module.exports = {
    verificaToken,
    verificaAdminRole,
    verificaTokenImg
}
