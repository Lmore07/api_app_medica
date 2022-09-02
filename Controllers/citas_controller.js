const Citas = require("../Models/citas");
require('dotenv').config();
const fs = require('fs-extra');
var AES = require("crypto-js/aes");
const { request } = require("express");

const cita = {}

cita.nueva_citayturno = async (req, res) => {
    try {
        const { hora_empieza, hora_termina, fecha, id_medico,id_paciente } = req.body; 
        let status = await Citas.registra_turnoycita(hora_empieza, hora_termina, fecha, id_medico,id_paciente);
        if (status === 1)
            res.json({ mensaje: "Registro correcto", estado: "1" });
        else
            res.json({ mensaje: "No registro", estado: "0" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema falló",estado: 0 });
    }
}

cita.modificar_citas = async (req, res) => {
    try {
        const { hora_empieza, hora_termina, fecha, id_medico,id_turno } = req.body; 
        let status = await Citas.actualiza_datos_cita(hora_empieza, hora_termina, fecha, id_medico,id_turno);
        if (status === 1)
            res.json({ mensaje: "Modicicación correcta", estado: "1" });
        else
            res.json({ mensaje: "No se modificó la cita", estado: "0" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema falló",estado: 0 });
    }
}

//Se obtienen las citas de un determinado paciente
cita.obtener_info_citas = async (req, res) => {
    try {
        const { cita } = req.params;
        console.log(cita);
        let datos = await Citas.obtener_info_cita(cita);
        if (datos != null) {
            datos.estado = "1";
            res.json(datos);
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

//Se obtienen las citas de un determinado paciente
cita.obtener_citas_paciente = async (req, res) => {
    try {
        const { paciente } = req.params;
        console.log(paciente);
        let datos = await Citas.obtener_citas_paciente(paciente);
        if (datos != null) {
            datos.estado = "1";
            res.json(datos);
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

cita.busqueda_citas = async (req, res) => {
    try {
        const { cedula } = req.params;
        let datos = await Citas.obtener_citas_busqueda(cedula);
        if (datos != null) {
            datos.estado = "1";
            res.json(datos);
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

cita.eliminar_citas = async (req, res) => {
    try {
        const {cita} = req.params;
        console.log(req.params);
        console.log(cita);
        let status = await Citas.eliminar_citas(cita);
            if (status === 1) {
                res.json({ mensaje: "Eliminado con éxito ", estado: "1" });
            }
            else
                res.json({ mensaje: "Eliminación fallido ", estado: "0" });
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//
cita.obtener_citas_medico = async (req, res) => {
    try {
        const { id } = req.params;
        let datos = await Citas.obtiene_citas_medico(id);
        if (datos != null) {
            datos.estado = "1";
            res.json(datos);
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

//
cita.obtiene_citas_generales = async (req, res) => {
    try {
        let datos = await Citas.obtiene_citas_generales();
        if (datos != null) {
            datos.estado = "1";
            res.json(datos);
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

module.exports = { cita };
