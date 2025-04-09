import { Request, Response } from "express"
import { Administrador, Tipo_Activo } from "../models"


export const getTipoActivo = async (req: Request, res: Response) => {
    try {
        const tipo_activo = await Tipo_Activo.findAll()
        return res.status(200).json({
            data: tipo_activo
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const registerTipoActivo = async (req: Request<{}, {}, { tipo_activo: string }>, res: Response) => {
    const { tipo_activo } = req.body
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
        const saveTipoActivo = await Tipo_Activo.create({
            tipo_activo,
            who_created: admin.dataValues.email,
            when_created: new Date(),
            deleted: false
        })
        if (!saveTipoActivo) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor'
            })
        }
        return res.status(201).json({
            msg: 'Registro del activo exitoso'
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

export const updateTipoActivo = async (req: Request<{}, {}, { id: number, tipo_activo: string }>, res: Response) => {
    const { id, tipo_activo } = req.body;
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
        const updatedRow = await Tipo_Activo.update(
            {
                tipo_activo,
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

export const showTipoActivo = async (req: Request, res: Response) => {
    try {
        const tipo_activo = await Tipo_Activo.findAll({
            where: { deleted: false },
            attributes: ['id', 'tipo_activo']
        })
        return res.json({
            data: tipo_activo
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const deleteTipoActivo = async (req: Request<{}, {}, { id_eliminar: number }>, res: Response) => {
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
        const eliminado = await Tipo_Activo.findOne({
            where: {
                id: id_eliminar
            }
        })
        if (!eliminado) {
            return res.status(404).json({
                msg: 'No se pudo eliminar el tipo de activo'
            })
        }
        await eliminado.update({
            deleted: true,
            who_deleted: admin.dataValues.email,
            when_deleted: new Date()
        })
        return res.status(201).json({
            msg: 'El tipo de activo se ha eliminado con éxito'
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
}
