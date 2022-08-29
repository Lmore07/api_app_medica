let { pool } = require("./conexion");
const Historial = require("./historial");
const Recetas = require("./recetas");
const Usuario = require("./usuario");

const Diagnostico = {}

Diagnostico.registra_diagnostico = async (id_cita, diagnostico,observaciones,motivo_ingreso,id_paciente,fecha,medicacion) => {
    try {
            let datos = await pool.query("INSERT INTO diagnostico("+
                " id_cita, diagnostico, observaciones, motivo_ingreso)"+
                " VALUES ("+id_cita+", '"+diagnostico+"', '"+observaciones+"', '"+motivo_ingreso+"');");
            datos = await pool.query("select max(id_diagnostico) as id from diagnostico");
            let id=datos.rows[0].id;
            let status = await Historial.registra_historial(id_paciente,id,fecha);
            let receta_id = await Recetas.registra_receta(id);
            for (let i=0; i<medicacion.length; i++) {
            status = await Recetas.registra_receta_detalle(receta_id,medicacion[i].medicamento,medicacion[i].cantidad,medicacion[i].descripcion);
            }
            status = await Usuario.actualiza_cita(id_paciente);
            return 1;
    } catch (error) {
        return 0;
    }
}

module.exports = Diagnostico;