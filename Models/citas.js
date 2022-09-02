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

//
Citas.actualiza_datos_cita = async (hora_empieza, hora_termina, fecha, id_medico,id_turno) => {
    try {
            let datos = await pool.query("UPDATE turnos"+
            " SET fecha='"+fecha+"', id_medico="+id_medico+", hora_empieza='"+hora_empieza+"', hora_termina='"+hora_termina+"'"+
            " WHERE id_turno="+id_turno+";");
            return 1;
    } catch (error) {
        return 0;
    }
}

//obtienes todos las citas de un paciente
Citas.obtener_info_cita = async (cita) => {
    try {
        let datos = await pool.query("select motivo_ingreso,diagnostico,observaciones,medicamento,cantidad,descripcion from citas C inner join diagnostico D"+
        " on C.id_cita=D.id_cita inner join receta R"+
        " on D.id_diagnostico=R.id_diagnostico inner join detalles_receta DR"+
        " on R.id_receta=DR.id_receta"+
        " where C.id_cita="+cita);
        if (datos.rowCount > 0)
            return datos.rows;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
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

Citas.obtener_citas_busqueda = async (paciente) => {
    try {
        let datos = await pool.query("select (select  nombres||' '||apellidos as medico from persona PP inner join medico MM"+
        " on PP.id=MM.id_persona where id_medico=T.id_medico), (select  especialidad from persona PP inner join medico MM"+
        " on PP.id=MM.id_persona where id_medico=T.id_medico),"+
        " id_cita,P.id, cedula, nombres||' '||apellidos as nombres, fecha,hora_empieza||' - '||hora_termina atencion,C.estado"+ 
        " from turnos T inner join citas C"+
        " on T.id_turno=C.id_turno inner join persona P"+
        " on C.id_paciente=P.id"+
        " where cedula like '%"+paciente+"%'");
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

//
Citas.obtiene_citas_medico = async (id_medico) => {
    try {
        let datos = await pool.query("select C.id_turno,id_cita,P.id, cedula, nombres||' '||apellidos as nombres, fecha,hora_empieza, hora_termina,C.estado from turnos T inner join citas C"+
        " on T.id_turno=C.id_turno inner join persona P"+
        " on C.id_paciente=P.id"+
        " where C.estado='PENDIENTE' and T.id_medico="+id_medico);
        if (datos.rowCount > 0)
            return datos.rows;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//
Citas.obtiene_citas_generales = async () => {
    try {
        let datos = await pool.query("select (select  nombres||' '||apellidos as medico from persona PP inner join medico MM"+
        " on PP.id=MM.id_persona where id_medico=T.id_medico), (select  especialidad from persona PP inner join medico MM"+
        " on PP.id=MM.id_persona where id_medico=T.id_medico),"+
        " id_cita,P.id, cedula, nombres||' '||apellidos as nombres, fecha,hora_empieza||' - '||hora_termina atencion,C.estado"+ 
        " from turnos T inner join citas C"+
        " on T.id_turno=C.id_turno inner join persona P"+
        " on C.id_paciente=P.id");
        if (datos.rowCount > 0)
            return datos.rows;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = Citas;