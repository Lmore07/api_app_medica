let { pool } = require("./conexion");

const Usuario = {}

//Devuelve todos los usuarios pacientes registrados
Usuario.listar_pacientes = async () => {
    try {
        let datos = await pool.query("select id, cedula, nombres, apellidos,direccion,celular,correo from persona "+
        "where rol='PACIENTE'");
        if (datos.rowCount > 0)
            return datos.rows;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Devuelve todos los usuarios medicos registrados
Usuario.listar_medicos = async () => {
    try {
        let datos = await pool.query("select P.id, cedula, nombres, apellidos,especialidad,direccion,celular,correo,estado from medico M inner join "+
        "persona P on M.id_persona=P.id");
        if (datos.rowCount > 0)
        {
            return datos.rows;
        }
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Se registra una nueva persona
Usuario.registrapersona = async (cedula,nombres, apellidos, correo, password,direccion, fecha_naci, celular,rol,especialidad,fecha_registro) => {
    try {
        if(rol =='MEDICO'){
            let datos = await pool.query("INSERT INTO persona("+
            "cedula, nombres, apellidos, correo, password, fecha_naci, direccion, celular, rol,estado)"+
            "VALUES ('"+cedula+"', '"+nombres+"', '"+apellidos+"', '"+correo+"', '"+password+"', '"+fecha_naci+"', '"+direccion+"','"+celular+"', 'MEDICO','PENDIENTE');");
            datos = await pool.query("select max(id) as id from persona");
            console.log(datos);
            let id=datos.rows[0].id;
            console.log(id, especialidad,fecha_registro);
            datos=await pool.query("INSERT INTO medico(id_persona, especialidad) VALUES ("+id+", '"+especialidad+"');");
        }else if(rol=='PACIENTE'){
            let datos = await pool.query("INSERT INTO persona("+
            "cedula, nombres, apellidos, correo, password, fecha_naci, direccion, celular, rol,estado)"+
            "VALUES ('"+cedula+"', '"+nombres+"', '"+apellidos+"', '"+correo+"', '"+password+"', '"+fecha_naci+"', '"+direccion+"', '"+celular+"', 'PACIENTE','ACTIVO');");
        }
        return 1;
    } catch (error) {
        if(error.constraint=="ced_u"){
            return 2;
        }else if(error.constraint=="celu_u"){
            return 3;
        }else if(error.constraint=="correo_u"){
            return 4;
        }
        return 0;
    }
}

//VALIDAR CEDULA
Usuario.valida_cedula = async (cedula) => {
    try {
        if(cedula.length==10){
            var cad = cedula.trim();
            var total = 0;
            var longitud = cad.length;
            var longcheck = longitud - 1;
            if (cad !== "" && longitud === 10) {
              for (i = 0; i < longcheck; i++) {
                if (i % 2 === 0) {
                  var aux = cad.charAt(i) * 2;
                  if (aux > 9) aux -= 9;
                  total += aux;
                } else {
                  total += parseInt(cad.charAt(i)); // parseInt o concatenará en lugar de sumar
                }
              }
              total = total % 10 ? 10 - total % 10 : 0;
              if (cad.charAt(longitud - 1) == total) {
                return true;
              } else {
                return false;
              }
            }
        }else{
            return false;
        }
    } catch (error) {
        return false;
    }
}

//INICIO DE SESION
Usuario.inciarSesion = async (usuario, clave) => {
    try {
        let datos = await pool.query("select nombres||' '||apellidos as nombres, password, rol, cedula,id, estado from persona where correo='"+usuario+"'");
        if(clave==datos.rows[0].password){
            return datos;
        }else{
            return 0;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
}

//Llama a la función para obtener los datos de 1 usuario
Usuario.getUser = async (cedula) => {
    try {
        console.log(cedula);
        let datos = await pool.query("select nombres,apellidos, cedula, date_part('year',AGE(CURRENT_DATE, fecha_naci)) as edad from persona where cedula='"+cedula+"';");
        if (datos.rowCount > 0)
            return datos.rows[0];
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Llama a la función para obtener los nombres de todos los medicos
Usuario.obtener_nombres_medicos = async (especialidad) => {
    try {
        let datos = await pool.query("select nombres||' '||apellidos as nombres, id_medico from medico M inner join persona P on M.id_persona=P.id where especialidad='"+especialidad+"' and estado='ACTIVO'");
        if (datos.rowCount > 0)
            return datos.rows;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

Usuario.ver_perfil = async (cedula) => {
    try {
        let datos = await pool.query("select cedula,nombres,apellidos,direccion,celular,fecha_naci,especialidad from persona P left join medico M "+
        "on P.id=M.id_persona "+
        "where cedula='"+cedula+"'");
        if (datos.rowCount > 0)
            return datos.rows[0];
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//actualizar datos personales
Usuario.actualizar_datos = async (id, cedula,nombres, apellidos, direccion, fecha_naci, celular,especialidad,rol) => {
    try {
        console.log(rol);
        if(rol =='MEDICO'){
            console.log(especialidad);
            let datos = await pool.query("UPDATE public.persona "+
            "SET cedula='"+cedula+"', nombres='"+nombres+"', apellidos='"+apellidos+"', fecha_naci='"+fecha_naci+"', direccion='"+direccion+"', celular='"+celular+"' "+
            "WHERE cedula='"+cedula+"'");
            datos=await pool.query("UPDATE public.medico "+
            "SET especialidad='"+especialidad+"'"+
            " WHERE id_persona="+id);
        }else if(rol=='PACIENTE'){
            let datos = await pool.query("UPDATE persona "+
            "SET cedula='"+cedula+"', nombres='"+nombres+"', apellidos='"+apellidos+"', fecha_naci='"+fecha_naci+"', direccion='"+direccion+"', celular='"+celular+"' "+
            "WHERE id="+id);
            console.log(datos);
        }
        return 1;
    } catch (error) {
        if(error.constraint=="ced_u"){
            return 2;
        }else if(error.constraint=="celu_u"){
            return 3;
        }else if(error.constraint=="correo_u"){
            return 4;
        }
        return 0;
    }
}

Usuario.eliminar_pacientes = async (id) => {
    try {
        let datos = await pool.query("delete from persona where id="+id);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

Usuario.eliminar_medicos = async (id) => {
    try {
        let datos = await pool.query("delete from medico where id_persona="+id);
        datos = await pool.query("delete from persona where id="+id);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

//actualizar datos personales
Usuario.aprobar_medico = async (id) => {
    try {
        console.log(id);
        let datos = await pool.query("UPDATE persona "+
            "SET estado='ACTIVO' "+
            "WHERE id="+id);
        return 1;
    } catch (error) {
        console.log(error);
        return 0;
    }
}

Usuario.get_id_medico = async (id) => {
    try {
        let datos = await pool.query("select id_medico from medico where id_persona="+id);
        if (datos.rowCount > 0)
            return datos.rows[0];
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//actualizar datos personales
Usuario.actualiza_cita = async (id_paciente) => {
    try {
            let datos = await pool.query("UPDATE citas"+
            " SET estado='ATENDIDO'"+
            " WHERE id_turno="+id_paciente);
            
        return 1;
    } catch (error) {
        return 0;
    }
}


///////////////////////

module.exports = Usuario;
