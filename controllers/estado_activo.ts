import { Request, Response } from "express"
import { Administrador, Estado_Activo } from "../models"


export const getEstadoActivo = async (req: Request, res: Response) => {
    try {
        const estadoActivo = await Estado_Activo.findAll()
        return res.status(200).json({
            data: estadoActivo
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const registerEstadoActivo = async (req: Request<{}, {}, { estado_activo: string }>, res: Response) => {
    const { estado_activo } = req.body
    try {
        const admin = await Administrador.findOne({
            where: {
                id: req.authData?.id
            }
        })
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            })
        }
        const saveEstadoActivo = await Estado_Activo.create({
            estado_activo,
            who_created: admin.dataValues.email,
            when_created: new Date(),
            deleted: false
        })
        if (!saveEstadoActivo) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor'
            })
        }
        return res.status(201).json({
            msg: 'Registro del estado del activo exitoso'
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

export const updateEstadoActivo = async (req: Request<{}, {}, { id: number, estado_activo: string }>, res: Response) => {
    const { id, estado_activo } = req.body;
    try {
        const admin = await Administrador.findOne({
            where: {
                id: req.authData?.id
            }
        })
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            })
        }
        const updatedRow = await Estado_Activo.update(
            {
                estado_activo,
                who_modified: admin.dataValues.email,
                when_modified: new Date(),
            },
            { where: { id } }
        )

        if (updatedRow[0] === 0) {
            return res.status(404).json({
                msg: `No se encontró la fila con el id ${id}`,
            });
        }
        return res.status(200).json({
            msg: "La fila se actualizó correctamente",
        });
    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
}

export const showEstadoActivo = async (req: Request, res: Response) => {
    try {
        const estadoActivo = await Estado_Activo.findAll({
            where: { deleted: false },
            attributes: ['id', 'estado_activo']
        })
        return res.json({
            data: estadoActivo
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const deleteEstadoActivo = async (req: Request<{}, {}, { id_eliminar: number }>, res: Response) => {
    const { id_eliminar } = req.body;
    try {
        const admin = await Administrador.findOne({
            where: {
                id: req.authData?.id
            }
        })
        if (!admin) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor, ocurrió un error con la identificación del usuario'
            })
        }
        const eliminado = await Estado_Activo.findOne({
            where: {
                id: id_eliminar
            }
        })
        if (!eliminado) {
            return res.status(404).json({
                msg: 'No se pudo eliminar el estado del activo'
            })
        }
        await eliminado.update({
            deleted: true,
            who_deleted: admin.dataValues.email,
            when_deleted: new Date()
        })
        return res.status(201).json({
            msg: 'El estado del activo eliminado con éxito'
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error al eliminar la fila",
        });
    }
}
