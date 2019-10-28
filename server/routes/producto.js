const express = require('express');

const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();
let Producto = require('../models/producto');

// ========================
// Obtener productos
//========================
app.get('/productos', verificaToken, (req,res) => {
    //trae todos los producots
    //populate: usuario, categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({disponible:true},)
        .populate('categoria','_id descripcion')
        .populate('usuario','_id nombre')
        .skip(desde)
        .limit(limite)
        .exec((err,productos)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            });
        });

});

// ========================
// Obtener productos por id
//========================
app.get('/productos/:id', verificaToken, (req,res) => {
    //populate: usuario, categoria
    let id = req.params.id;

    Producto.findById(id,)
        .populate('categoria','_id descripcion')
        .populate('usuario','_id nombre')
        .exec((err,productoDB)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        })
    });



});

// ========================
// Buscar productos
//========================
app.get('/productos/buscar/:termino', verificaToken, (req,res)=>{

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({nombre: regex})
        .populate('categoria','nombre')
        .exec((err, productos)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos
            })
        })
});


// ========================
// Crear producto
//========================
app.post('/productos', verificaToken, (req,res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: body.usuario
    });

    producto.save((err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            productoDB
        });
    });

});

// ========================
// Actualizar un producto
//========================
app.put('/productos/:id', (req,res) => {
    //grabar el usuario
    //grabar una categoria del listado
    let id = req.params.id;
    let body = req.body;

    Producto.findById(id, (err, productoDB)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "El producto no existe. No ha sido posible actualizarlo."
                }
            });
        }

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;

        productoDB.save((err, productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                producto: productoGuardado
            });
        });

    });


});

// ========================
// Borrar un producto (poner a no disponible)
//========================
app.delete('/productos/:id', [verificaToken, verificaAdminRole], (req,res) => {

    let id = req.params.id;

    let cambiaEstado = {
        disponible: false
    }

    Producto.findByIdAndUpdate(id,cambiaEstado,{new: true},(err,productoBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if(!productoBorrado){
            return res.status(400).json({
                ok: false,
                err:{
                    message: "El producto no existe."
                }
            });
        }

        res.json({
            ok: true,
            usuario: productoBorrado
        })
    });

});

module.exports = app;