const { Router } = require("express");
const { user } = require("../Controllers/usuario_controller");
const { cita } = require("../Controllers/citas_controller");
const { diagnostico } = require("../Controllers/diagnostico_controller");

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
router.get("/medico/:id", user.get_id_medico);
router.post("/medicos/nombres", user.obtener_nombres_medicos);
router.get("/perfil/datos/:cedula", user.ver_perfil_user);
router.post("/usuarios/actualizacion", user.actualizar_informacion_personal);

//CITAS Y TURNOS
router.post("/citas/registro", cita.nueva_citayturno);
router.get("/citas/generales", cita.obtiene_citas_generales);
router.get("/paciente/citas/:paciente", cita.obtener_citas_paciente);
router.get("/busqueda/citas/:cedula", cita.busqueda_citas);

router.get("/paciente/citas/info/:cita", cita.obtener_info_citas);
router.delete('/citas/eliminar/:cita', cita.eliminar_citas);
router.get("/medico/citas/:id", cita.obtener_citas_medico);

//diagnostico
router.post("/diagnostico/registro", diagnostico.nuevo_diagnostico);


module.exports = router;
