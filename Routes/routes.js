const { Router } = require("express");
const chat = require("../Controllers/chat_controller");
const { user } = require("../Controllers/usuario_controller");
const router = Router();

// Admin
router.get("/admin/usuarios/pacientes", user.listar_pacientes);
router.post("/admin/usuarios/medicos", user.listar_medicos);

//PERSONAS
router.post("/usuarios/registro", user.nuevapersona);
router.post("/iniciar_sesion", user.iniciarSesion);
router.get("/paciente/datos/:cedula", user.getUsuario);
router.post("/medicos/nombres", user.obtener_nombres_medicos);

//CITAS Y TURNOS
router.post("/citas/registro", user.nueva_citayturno);



//usuarios
router.post("/usuario/nuevo", user.nuevoUsuario);
router.post("/usuario/modificar", user.modificarUsuario);
router.post("/usuario/solicitud", user.enviar_solicitud);
router.post("/usuario/aceptar", user.acepta_solicitud);
router.get("/usuario/amigos/:usuario", user.mostraramigos);
router.get("/usuario/amigosnum/:usuario", user.numamigos);
router.get("/usuario/solicitudes/:usuario", user.solicitudes);
router.get("/usuario/solicitudespendientes/:usuario", user.solicitudespendientes);

//personas
router.post("/personas/nuevo", user.nuevapersona);
router.get("/personas/listar", user.listarpersonas);
router.post("/personas/borrar", user.eliminpersona);
router.post("/personas/modificar", user.modificarpersona);

router.post("/cerrar_sesion", user.cierrasesion);

router.delete('/usuario/eliminar/:usuario', user.elimnarUsuario);

// Foro - chat
router.post("/chat/nuevo", chat.nuevoMensaje);
router.post("/chat/obtener", chat.obtenerMensajes);


module.exports = router;
