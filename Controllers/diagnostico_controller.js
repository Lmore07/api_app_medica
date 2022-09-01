
const Diagnostico = require("../Models/diagnostico");
require('dotenv').config();
const fs = require('fs-extra');
var AES = require("crypto-js/aes");
const { request } = require("express");

const diagnostico = {}


diagnostico.nuevo_diagnostico = async (req, res) => {
    try {
        const { id_cita, diagnostico,observaciones,motivo_ingreso,id_paciente,fecha,medicacion,id_turnos } = req.body; 
        let status = await Diagnostico.registra_diagnostico(id_cita, diagnostico,observaciones,motivo_ingreso,id_paciente,fecha,medicacion,id_turnos);
        if (status === 1)
            res.json({ mensaje: "Registro correcto", estado: "1" });
        else
            res.json({ mensaje: "No registro", estado: "0" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema falló",estado: 0 });
    }
}



module.exports = { diagnostico };
