let { pool } = require("./conexion");

const Historial = {}

Historial.registra_historial = async (id_paciente, id_diagnostico,fecha) => {
    try {
        console.log(id_paciente, id_diagnostico, fecha);
            let datos = await pool.query("INSERT INTO historial("+
                " id_paciente, id_diagnostico, fecha)"+
                " VALUES ("+id_paciente+", "+id_diagnostico+", '"+fecha+"');");
            return 1;
    } catch (error) {
        return 0;
    }
}

module.exports = Historial;