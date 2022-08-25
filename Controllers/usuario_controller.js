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
        res.json({ mensaje: "El sistema falló",estado: 0 });
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
                res.json({ mensaje: "Sesion iniciada", estado: datos.rows[0].rol, cedula:datos.rows[0].cedula, id:datos.rows[0].id});
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
        console.log(req.params);
        const { cedula } = req.params;
        console.log(cedula);
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

user.nueva_citayturno = async (req, res) => {
    try {
        const { hora_empieza, hora_termina, fecha, id_medico,id_paciente } = req.body; 
        let status = await Usuario.registra_turnoycita(hora_empieza, hora_termina, fecha, id_medico,id_paciente);
        if (status === 1)
            res.json({ mensaje: "Registro correcto", estado: "1" });
        else
            res.json({ mensaje: "No registro", estado: "0" });
    }
    catch (error) {
        res.json({ mensaje: "El sistema falló",estado: 0 });
    }
}

//Se obtienen las citas de un determinado paciente
user.obtener_citas_paciente = async (req, res) => {
    try {
        const { paciente } = req.params;
        console.log(paciente);
        let datos = await Usuario.obtener_citas_paciente(paciente);
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

user.elimiar_citas = async (req, res) => {
    try {
        const {cita} = req.params;
        console.log(req.params);
        console.log(cita);
        let status = await Usuario.eliminar_citas(cita);
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

////////////////////////////

////////////////////////////


user.listarUsuariosp = async (req, res) => {
    try {
        const { usuario } = req.body;
        const datos = await Usuario.listarUsuariosp(usuario);
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//mostrar amigos
user.mostraramigos = async (req, res) => {
    try {
        const { usuario } = req.params;
        const datos = await Usuario.mostraramigos(usuario);
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//obtener solicitudes
user.solicitudes = async (req, res) => {
    try {
        const { usuario } = req.params;
        const datos = await Usuario.solicitudes(usuario);
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//obtener solicitudes
user.solicitudespendientes = async (req, res) => {
    try {
        const { usuario } = req.params;
        const datos = await Usuario.solicitudespendientes(usuario);
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//Se obtiene los amigos del usuario 
user.numamigos = async (req, res) => {
    try {
        const { usuario } = req.params;
        console.log(usuario);
        if (usuario != null) {
            let datos = await Usuario.numamigos(usuario);
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

//Se verifica que los datos no estén vacios y 
//se obtienen una verificación de que son correctos



//cierra sesion
user.cierrasesion = async (req, res) => {
    try {
        const { usuario } = req.body;
        if (usuario.length > 0) {
            let datos = await Usuario.cierrasesion(usuario);
            if (datos !== 0 && datos !== null) {
                res.json({ mensaje: "Sesion cerrada", estado: "1" });
            }
            else
                res.json({ mensaje: "Salida fallida", estado: "0" });
        }
        else
            res.json({ mensaje: "campos vacios", estado: "0" });
    }
    catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//Se obtienen todos los datos y luego se reemplaza con los valores actuales
user.modificarUsuario = async (req, res) => {
    try {
        const { usuario } = req.body;
        if (usuario != null) {
            let foto_perfil = "";
            if (req.files.length == 0) {
                let datos = await Usuario.getUser(usuario);
                foto_perfil = datos.foto_perfil;
            } else {
                foto_perfil = (await cloudinary.v2.uploader.upload(req.files[0].path)).secure_url.trim();
            }
            console.log("aqui va ruta");
            console.log(req.files[0].path);
            console.log("aqui va ruta");
            const { nombres, correo,
                pais, ciudad, estado, sobremi, hobbies, celular } = req.body;

            let status = await Usuario.modificarUser(nombres, usuario, correo, foto_perfil,
                pais, ciudad, estado, sobremi, hobbies, celular);
            //console.log(status);
            if (status === 1)
                res.json({ mensaje: "Modificado con exito", estado: "1" });
            else
                res.json({ mensaje: "Modificación fallida ", estado: "0" });
        }
        else
            res.json({ mensaje: "El usuario no ha iniciado la sesión ", estado: "0" });
    } catch (error) {
        res.json({ mensaje: "Error: " + error, estado: "0" });
    }
}

//se hace una solicitud
user.enviar_solicitud = async (req, res) => {
    try {
        const { usuario1, usuario2 } = req.body;
        if (usuario1 != null) {
            let status = await Usuario.enviar_solicitud(usuario1, usuario2);
            console.log(status);
            if (status === 1)
                res.json({ mensaje: "ENVIADO con exito", estado: "1" });
            else
                res.json({ mensaje: "SOLICITUD fallida ", estado: "0" });
        }
        else
            res.json({ mensaje: "No se realizo la solicitud ", estado: "0" });
    } catch (error) {
        res.json({ mensaje: "Error: " + error, estado: "0" });
    }
}

//se acepta solicitud
user.acepta_solicitud = async (req, res) => {
    try {
        const { usuario1, usuario2 } = req.body;
        if (usuario1 != null) {
            let status = await Usuario.aceptar_solicitud(usuario1, usuario2);
            console.log(status);
            if (status === 1)
                res.json({ mensaje: "ENVIADO con exito", estado: "1" });
            else
                res.json({ mensaje: "SOLICITUD fallida ", estado: "0" });
        }
        else
            res.json({ mensaje: "No se realizo la solicitud ", estado: "0" });
    } catch (error) {
        res.json({ mensaje: "Error: " + error, estado: "0" });
    }
}

//Se registra un nuevo usuario
user.nuevoUsuario = async (req, res) => {
    try {
        const { usuario, nombres, correo, clave } = req.body;
        let foto_perfil = "";
        foto_perfil = (await cloudinary.v2.uploader.upload(req.files[0].path)).secure_url.trim();
        let status = await Usuario.registrarUser(usuario, nombres, correo, clave, foto_perfil);
        console.log(status);
        if (req.files != undefined) {
            req.files.forEach(async element => {
                await fs.unlink(element.path);
            });
        }
        if (status === 1)
            res.json({ mensaje: "Registro correcto", estado: "1" });
        else
            res.json({ mensaje: "Registro fallido", estado: "0" });
    }
    catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

//Se elimina un usuario
user.elimnarUsuario = async (req, res) => {
    try {
        const usuario = req.params.usuario;
        if (usuario != null) {
            let status = await Usuario.eliminarUser(usuario);
            if (status === 1) {
                res.json({ mensaje: "Eliminado con éxito ", estado: "1" });
            }
            else
                res.json({ mensaje: "Eliminación fallido ", estado: "0" });

        }
        else
            res.json({ mensaje: "El sesión no está iniciada", estado: "0" });
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

/////

user.modificarpersona = async (req, res) => {
    try {
        const { cedula, apellidos, nombres, id_tipo, id_especialidad, celular, mail, fecha, genero, ocupacion, tipo_sangre, 
            ciudad } = req.body;
            let status = await Usuario.modificarpersona(cedula, apellidos, nombres, id_tipo, id_especialidad, celular, mail, fecha, genero, ocupacion, tipo_sangre, 
                ciudad);
            //console.log(status);
            if (status === 1)
                res.json({ mensaje: "Modificado con exito", estado: "1" });
            else
                res.json({ mensaje: "Modificación fallida ", estado: "0" });
    } catch (error) {
        res.json({ mensaje: "Error: " + error, estado: "0" });
    }
}

//Se elimina un usuario
user.eliminpersona = async (req, res) => {
    try {
        const {cedula} = req.body;
        console.log(req.body);
        let status = await Usuario.eliminarpersona(cedula);
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

user.listarpersonas = async (req, res) => {
    try {
        const datos = await Usuario.listarpersonas();
        res.json(datos);
    } catch (error) {
        console.log(error);
        res.json({ estado: 0 });
    }
}

module.exports = { user };