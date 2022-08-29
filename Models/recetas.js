let { pool } = require("./conexion");

const Recetas = {}

Recetas.registra_receta_detalle = async (id_receta, medicamento, cantidad,descripcion) => {
    try {
            let datos = await pool.query("INSERT INTO public.detalles_receta("+
                " id_receta, medicamento, cantidad, descripcion)"+
                " VALUES ("+id_receta+", '"+medicamento+"', '"+cantidad+"', '"+descripcion+"');");
            return 1;
    } catch (error) {
        return 0;
    }
}

Recetas.registra_receta = async (id_diagnostico) => {
    try {
            let datos = await pool.query("INSERT INTO receta("+
                " id_diagnostico)"+
                " VALUES ("+id_diagnostico+");");
                datos = await pool.query("select max(id_diagnostico) as id from diagnostico");
            let id=datos.rows[0].id;
            return id;
    } catch (error) {
        return 0;
    }
}

module.exports = Recetas;