const { Router } = require("express");
const { user } = require("../Controllers/usuario_controller");
const { cita } = require("../Controllers/citas_controller");

const router = Router();

// Admin
router.get("/admin/usuarios/pacientes", user.listar_pacientes);
router.get("/admin/usuarios/medicos", user.listar_medicos);
router.delete('/medicos/eliminar/:id', user.eliminar_medicos);
router.delete('/pacientes/eliminar/:id', user.eliminar_pacientes);
router.post("/admin/aprobar", user.aprobar_medico);


//PERSONAS
router.post("/usuarios/registro", user.nuevapersona);
router.post("/iniciar_sesion", user.iniciarSesion);
router.get("/paciente/datos/:cedula", user.getUsuario);
router.post("/medicos/nombres", user.obtener_nombres_medicos);
router.get("/perfil/datos/:cedula", user.ver_perfil_user);
router.post("/usuarios/actualizacion", user.actualizar_informacion_personal);

//CITAS Y TURNOS
router.post("/citas/registro", cita.nueva_citayturno);
router.get("/paciente/citas/:paciente", cita.obtener_citas_paciente);
router.delete('/citas/eliminar/:cita', cita.eliminar_citas);


module.exports = router;
