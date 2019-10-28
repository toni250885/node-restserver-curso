const express = require('express');


let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//============================
// Mostrar todas las categorias
//============================

app.get('/categoria', verificaToken, (req, res) => {

    // Categoria.find((err,categoriasDB) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                categoriasDB
            })
        });
});

//============================
// Mostrar una categoria por ID
//============================

app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada",
                }
            });
        }

        res.json({
            ok: true,
            categoriaDB
        });
    });
});

//============================
// Crear nueva categoria
//============================

app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });



    //intentamos guardar la categoria
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });
    })

});

//============================
// Actualizar categoria por id
//============================

app.put('/categoria/:id', verificaToken, (req, res) => {
    //SOLO ACTUALIZA LA DESCRIPCION DE LA CATEGORIA
    let id = req.params.id;

    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//============================
// Elimina una categoria por id
//============================

app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //solo un administrador puede eliminarla
    //Categoria.findbyidandremove

    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            message: "Categoria borrada",
            categoriaBD
        })
    });


});

module.exports = app;