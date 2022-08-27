let { pool } = require("./conexion");

const Citas = {}

//Se registra una nueva persona
Citas.registra_turnoycita = async (hora_empieza, hora_termina, fecha, id_medico,id_paciente) => {
    try {
            let datos = await pool.query("INSERT INTO turnos(fecha, id_medico,hora_empieza, hora_termina) VALUES ('"+fecha+"', '"+id_medico+"', '"+hora_empieza+"', '"+hora_termina+"');");
            datos = await pool.query("select max(id_turno) as id from turnos");
            let id=datos.rows[0].id;
            datos= await pool.query("INSERT INTO citas(id_paciente, id_turno, estado) VALUES ("+id_paciente+","+id+" , 'PENDIENTE');");        
            return 1;
    } catch (error) {
        return 0;
    }
}

//obtienes todos las citas de un paciente
Citas.obtener_citas_paciente = async (paciente) => {
    try {
        let datos = await pool.query("select C.id_cita,T.id_turno,T.id_medico, hora_empieza,hora_termina,especialidad, nombres||' '||apellidos as medico,fecha, C.estado "+
        "from citas C inner join turnos T on C.id_turno=T.id_turno "+
        "inner join medico M on M.id_medico=T.id_medico inner join persona P "+
        "on P.id=M.id_persona "+
        "where id_paciente="+paciente+" order by fecha");
        if (datos.rowCount > 0)
            return datos.rows;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Se envía el usuario que se va a eliminar
Citas.eliminar_citas = async (cita) => {
    try {
        let datos = await pool.query("delete from turnos where id_turno="+cita);
        return datos.rows[0].eliminar_usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = Citas;