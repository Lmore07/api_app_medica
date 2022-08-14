const { pool } = require("./conexion");

const mensajes = {}

// Se realiza la función para registrar un nuevo mensaje
mensajes.nuevoMensaje = async (usuario1, usuario2, mensaje, tipo) => {
    try {
        let status = await pool.query("select enviar_mensaje($1,$2,$3,$4)", [usuario1, usuario2, mensaje, tipo]);
        return status.rows[0].enviar_mensaje;

    } catch (error) {
        return null;
    }

}

// Se obtienen todos los mensajes guardados
mensajes.obtenerMensajes = async (usuario1, usuario2) => {
    try {
        let datos = await pool.query("select obtener_mensajes($1,$2)", [usuario1, usuario2]);
        console.log(datos);
        let aux = [];
        datos.rows.forEach(elemet => {
            aux.push(elemet.obtener_mensajes);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = mensajes;