const Usuario = require("../Models/usuario");
const cloudinary = require('cloudinary');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const fs = require('fs-extra');
var AES = require("crypto-js/aes");
const { request } = require("express");

/*cloudinary.config({
    cloud_name: 'dtjnmnzjf',
    api_key: '642844178565819',
    api_secret: '3_9PHu6g2tsBc4_R_wfMmkxXs3g'
});*/

//* Se crea el objeto/clase
const user = {}

//Se obtienen todos los pacientes
user.listar_pacientes = async (req, res) => {
    try {
        const datos = await Usuario.listar_pacientes();
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//Se obtienen todos los medicos
user.listar_medicos = async (req, res) => {
    try {
        const datos = await Usuario.listar_medicos();
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//medicos activos
user.medicos_activos = async (req, res) => {
    try {
        const datos = await Usuario.medicos_activos();
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//turnos disponibles
user.turnos_disponibles = async (req, res) => {
    try {
        const { fecha,medico } = req.body;
        const datos = await Usuario.obtiene_turnos(fecha,medico);
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//se agrega una nueva persona
user.nuevapersona = async (req, res) => {
    try {
        const { cedula, nombres, apellidos,especialidad, correo, password, fecha_naci,celular, direccion,rol,fecha_registro } = req.body;        
        let status = await Usuario.registrapersona(cedula,nombres, apellidos, correo, password,direccion, fecha_naci, celular,rol,especialidad,fecha_registro);
        if (status === 1)
            res.json({ mensaje: "Registro correcto", estado: "1" });
        else if(status === 2)
            res.json({ mensaje: "Cedula repetida", estado: "2" });
        else if(status === 3)
            res.json({ mensaje: "Celular repetida", estado: "3" });
        else if(status === 4)
            res.json({ mensaje: "Correo repetido", estado: "4" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema fall??",estado: 0 });
    }
}

//INICIAR SESION
user.iniciarSesion = async (req, res) => {
    try {
        const { usuario, clave } = req.body;
        if (usuario.length > 0 && clave.length > 0) {
            //var encrypted = AES.encrypt(clave, 'secret key11').toString();
            //console.log(encrypted);
            let datos = await Usuario.inciarSesion(usuario, clave);
            if (datos !== 0 && datos !== null) {
                res.json({ mensaje: "Sesion iniciada", estado: datos.rows[0].rol, cedula:datos.rows[0].cedula, id:datos.rows[0].id,estado_s:datos.rows[0].estado,nombres:datos.rows[0].nombres});
            }
            else
                res.json({ mensaje: "Ingreso fallido", estado: "0" });
        }
        else
            res.json({ mensaje: "campos vacios", estado: "0" });
    }
    catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//Se obtiene los datos del usuario 
user.getUsuario = async (req, res) => {
    try {
        const { cedula } = req.params;
        if (cedula != null) {
            let datos = await Usuario.getUser(cedula);
            if (datos != null) {
                datos.estado = "1";
                res.json(datos);
            }
            else
                res.json({ estado: "0" });
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

//ver perfil
user.ver_perfil_user = async (req, res) => {
    try {
        const { cedula } = req.params;
        console.log(cedula);
        if (cedula != null) {
            let datos = await Usuario.ver_perfil(cedula);
            if (datos != null) {
                datos.estado = "1";
                res.json(datos);
            }
            else
                res.json({ estado: "0" });
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}

user.actualizar_informacion_personal = async (req, res) => {
    try {
        const { id, cedula,nombres, apellidos, direccion, fecha_naci, celular,especialidad,rol } = req.body;        
        let status = await Usuario.actualizar_datos(id, cedula,nombres, apellidos, direccion, fecha_naci, celular,especialidad,rol);
        if (status === 1)
            res.json({ mensaje: "Actualizacion Completa", estado: "1" });
        else if(status === 2)
            res.json({ mensaje: "Cedula repetida", estado: "2" });
        else if(status === 3)
            res.json({ mensaje: "Celular repetida", estado: "3" });
        else if(status === 4)
            res.json({ mensaje: "Correo repetido", estado: "4" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema fall??",estado: 0 });
    }
}

user.aprobar_medico = async (req, res) => {
    try {
        console.log(req.body)
        const { id } = req.body;        
        let status = await Usuario.aprobar_medico(id);
            res.json({ mensaje: "M??dico Aprobado", estado: "1" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema fall??",estado: 0 });
    }
}

//Se obtiene los datos del usuario 
user.obtener_nombres_medicos = async (req, res) => {
    try {
        const { especialidad } = req.body;
        let datos = await Usuario.obtener_nombres_medicos(especialidad);
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

user.eliminar_medicos = async (req, res) => {
    try {
        const {id} = req.params;
        let status = await Usuario.eliminar_medicos(id);
            if (status === 1) {
                res.json({ mensaje: "Eliminado con ??xito", estado: "1" });
            }
            else
                res.json({ mensaje: "Eliminaci??n fallida", estado: "0" });
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

user.eliminar_pacientes = async (req, res) => {
    try {
        const {id} = req.params;
        let status = await Usuario.eliminar_pacientes(id);
            if (status === 1) {
                res.json({ mensaje: "Eliminado con ??xito", estado: "1" });
            }
            else
                res.json({ mensaje: "Eliminaci??n fallida", estado: "0" });
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//Se obtiene los datos del usuario 
user.get_id_medico = async (req, res) => {
    try {
        const { id } = req.params;
        if (id != null) {
            let datos = await Usuario.get_id_medico(id);
            if (datos != null) {
                datos.estado = "1";
                res.json(datos);
            }
            else
                res.json({ estado: "0" });
        }
        else
            res.json({ estado: "0" });
    }
    catch (error) {
        console.error();
        res.json({ estado: 0 });
    }
}
////////////////////////////

////////////////////////////
module.exports = { user };