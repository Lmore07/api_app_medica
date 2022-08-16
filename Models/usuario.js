let { pool } = require("./conexion");

const Usuario = {}

//Devuelve todos los usuarios pacientes registrados
Usuario.listar_pacientes = async () => {
    try {
        let aux = [];
        let datos = await pool.query("select * from persona where rol='Paciente'");
        datos.rows.forEach(element => {
            aux.push(element);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Devuelve todos los usuarios medicos registrados
Usuario.listar_medicos = async () => {
    try {
        let aux = [];
        let datos = await pool.query("select * from persona where rol='Medico'");
        datos.rows.forEach(element => {
            aux.push(element);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Se registra una nueva persona
Usuario.registrapersona = async (cedula,nombres, apellidos, correo, password,direccion, fecha_naci, celular,rol,especialidad,fecha_registro) => {
    try {
        console.log(celular);
        if(rol =='MEDICO'){
            console.log(especialidad);
            let datos = await pool.query("INSERT INTO persona("+
            "cedula, nombres, apellidos, correo, password, fecha_naci, direccion, celular, rol,estado)"+
            "VALUES ('"+cedula+"', '"+nombres+"', '"+apellidos+"', '"+correo+"', '"+password+"', '"+fecha_naci+"', '"+direccion+"','"+celular+"', 'MEDICO','PENDIENTE');");
            datos = await pool.query("select max(id) as id from persona");
            let id=datos.rows[0].id;
            console.log(id,especialidad,fecha_registro);
            datos=await pool.query("INSERT INTO medico(id_persona, especialidad,fecha_registro) VALUES ("+id+", '"+especialidad+"', '"+fecha_registro+"');");
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
        let datos = await pool.query("select password from persona where correo='"+usuario+"'");
        if(clave==datos.rows[0].password){
            return 1;
        }else{
            return 0;
        }
    } catch (error) {
        console.log(error);
        return 0;
    }
}

///////////////////////


///////////////////////


Usuario.listarUsuariosp = async (usuario) => {
    try {
        let aux = [];
        console.log(usuario);
        let datos = await pool.query("select listar_usuarios($1)",[usuario]);
        console.log(datos);
        datos.rows.forEach(element => {
            aux.push(element.listar_usuarios);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//enviar solicitud
Usuario.enviar_solicitud = async (usuario1, usuario2) => {
    try {
        let datos = await pool.query("select enviar_solicitud($1,$2)",
            [usuario1, usuario2]);
        return datos.rows[0].enviar_solicitud;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//qceptar solicitud
Usuario.aceptar_solicitud = async (usuario1, usuario2) => {
    try {
        let datos = await pool.query("select aceptar_solicitud($1,$2)",
            [usuario1, usuario2]);
        return datos.rows[0].aceptar_solicitud;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//mostrar amigos
Usuario.mostraramigos = async (usuario) => {
    try {
        let aux = [];
        console.log(usuario);
        let datos = await pool.query("select mostrar_amigos($1)",[usuario]);
        console.log(datos);
        datos.rows.forEach(element => {
            aux.push(element.mostrar_amigos);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//mostrar numero de amigos
Usuario.numamigos = async (usuario) => {
    try {
        let aux = [];
        console.log(usuario);
        let datos = await pool.query("select numero_amigos($1)",[usuario]);
        console.log(datos);
        datos.rows.forEach(element => {
            aux.push(element.numero_amigos);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//obtener solicitudes
Usuario.solicitudes = async (usuario) => {
    try {
        let aux = [];
        console.log(usuario);
        let datos = await pool.query("select obtener_solicitudes($1)",[usuario]);
        console.log(datos);
        datos.rows.forEach(element => {
            aux.push(element.obtener_solicitudes);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

Usuario.solicitudespendientes = async (usuario) => {
    try {
        let aux = [];
        console.log(usuario);
        let datos = await pool.query("select obtener_solicitudes_pendientes($1)",[usuario]);
        console.log(datos);
        datos.rows.forEach(element => {
            aux.push(element.obtener_solicitudes_pendientes);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Llama a la función para obtener los datos de 1 usuario
Usuario.getUser = async (usuario) => {
    try {

        let datos = await pool.query("select obtener_usuario($1)", [usuario]);
        if (datos.rowCount > 0)
            return datos.rows[0].obtener_usuario;
        else
            return null;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Se envian datos de inicio de sesión para su verificación


//cierra sesion
Usuario.cierrasesion = async (usuario) => {
    try {
        let datos = await pool.query("select cerrar_sesion($1)", [usuario]);
        return datos.rows[0].cerrar_sesion;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Se envian los datos para hacer la actualización
Usuario.modificarUser = async (nombres, usuario, correo, foto_perfil, 
    pais, ciudad, estado, sobremi, hobbies, celular) => {
    try {
        console.log(nombres, usuario, correo, foto_perfil, 
            pais, ciudad, estado, sobremi, hobbies, celular);
        let datos = await pool.query("select modificar_usuario($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)",
            [usuario, nombres ,sobremi, correo, foto_perfil, pais, ciudad, estado, hobbies, celular]);
            console.log(datos.rows);
        return datos.rows[0].modificar_usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
}

//Se envian los datos para registrar un nuevo usuario
Usuario.registrarUser = async (usuario, nombres, correo, clave, foto_perfil) => {
    try {
        let datos = await pool.query(
            "select nuevo_usuario($1,$2,$3,$4,$5)",
            [usuario, nombres, correo, clave, foto_perfil]);
        return datos.rows[0].nuevo_usuario;
    } catch (error) {
        return null;
    }
}

//Se envía el usuario que se va a eliminar
Usuario.eliminarUser = async (usuario) => {
    try {
        let datos = await pool.query("select eliminar_usuario($1)", [usuario]);
        return datos.rows[0].eliminar_usuario;
    } catch (error) {
        console.log(error);
        return null;
    }
}
Usuario.cambiarClave = async (usuario, clave_actual, clave_nuevo) =>{
    try {
        let datos = await pool.query("select cambiar_clave($1,$2,$3)", [usuario, clave_actual, clave_nuevo]);
        console.log(datos.rows);
        return datos.rows[0].cambiar_clave;
    } catch (error) {
        return null;
    }
}

Usuario.modificarpersona = async (cedula, apellidos, nombres, id_tipo, id_especialidad, celular, mail, fecha, genero, ocupacion, tipo_sangre, 
    ciudad) => {
    try {
            
            let datos = await pool.query("select modificar_persona('"+cedula+"','"+apellidos+"','"+nombres+"',"+id_tipo+","+id_especialidad+",'"+celular+"','"+mail+"','"+fecha+"','"+genero+"','"+ocupacion+"','"+tipo_sangre+"','"+ciudad+"')");

        return datos.rows[0].modificar_persona;
    } catch (error) {
        console.log(error);
        return null;
    }
}

Usuario.listarpersonas = async () => {
    try {
        let aux = [];
        let datos = await pool.query("select listar_personas()");
        datos.rows.forEach(element => {
            aux.push(element.listar_personas);
        });
        return aux;
    } catch (error) {
        console.log(error);
        return null;
    }
}



//Se envía el usuario que se va a eliminar
Usuario.eliminarpersona = async (cedula) => {
    try {
        let datos = await pool.query("select eliminar_persona($1)", [cedula]);
        return datos.rows[0].eliminar_persona;
    } catch (error) {
        console.log(error);
        return null;
    }
}


module.exports = Usuario;
