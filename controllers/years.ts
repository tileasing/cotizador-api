import { Request, Response } from "express"
import { Administrador, Years } from "../models"


export const getYears = async (req: Request, res: Response) => {
    try {
        const years = await Years.findAll()
        return res.status(200).json({
            data: years
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const registerYears = async (req: Request<{}, {}, { year: number }>, res: Response) => {
    const { year } = req.body
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
        const saveYear = await Years.create({
            year,
            who_created: admin.dataValues.email,
            when_created: new Date(),
            deleted: false
        })
        if (!saveYear) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor'
            })
        }
        return res.status(201).json({
            msg: 'Registro del año exitoso'
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

export const updateYears = async (req: Request<{}, {}, { id: number, year: number }>, res: Response) => {
    const { id, year } = req.body;
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
        const updatedRow = await Years.update(
            {
                year,
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

export const showYears = async (req: Request, res: Response) => {
    try {
        const year = await Years.findAll({
            where: { deleted: false },
            attributes: ['id', 'year']
        })
        return res.json({
            data: year
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const deleteYears = async (req: Request<{}, {}, { id_eliminar: number }>, res: Response) => {
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
        const eliminado = await Years.findOne({
            where: {
                id: id_eliminar
            }
        })
        if (!eliminado) {
            return res.status(404).json({
                msg: 'No se pudo eliminar el año'
            })
        }
        await eliminado.update({
            deleted: true,
            who_deleted: admin.dataValues.email,
            when_deleted: new Date()
        })
        return res.status(201).json({
            msg: 'El año se ha eliminado con éxito'
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
}
