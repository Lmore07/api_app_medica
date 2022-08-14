const mensajes = require("../Models/chat");
const multer =require("multer");

const chat = {}

// Se obtienen el texto y los datos del nuevo mensaje
chat.nuevoMensaje = async (req, res) => {
    try {
        const { usuario1, usuario2, mensaje, tipo } = req.body;
        let status = await mensajes.nuevoMensaje(usuario1, usuario2, mensaje, tipo);
        if (status != null)
            res.json(status);
        else
            res.json({ estado: 0 });
    } catch (error) {
        res.json({ estado: 0 });
    }
}

// Se obtiene toda la conversación
chat.obtenerMensajes = async (req, res) => {
    try {
        const { usuario1, usuario2 } = req.body;
        let datos = await mensajes.obtenerMensajes(usuario1, usuario2);
        if (datos != null)
            res.json(datos);
        else
            res.json({ estado: 0 });
    } catch (error) {
        res.json({ estado: 0 });
    }
}

module.exports = chat;