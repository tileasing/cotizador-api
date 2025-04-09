import { Request, Response } from "express"
import { Administrador, Marca } from "../models"


export const getMarca = async (req: Request, res: Response) => {
    try {
        const marca = await Marca.findAll()
        return res.status(200).json({
            data: marca
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const registerMarca = async (req: Request<{}, {}, { marca: string }>, res: Response) => {
    const { marca } = req.body
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
        const saveMarca = await Marca.create({
            marca,
            who_created: admin.dataValues.email,
            when_created: new Date(),
            deleted: false
        })
        if (!saveMarca) {
            return res.status(404).json({
                msg: 'No se pudo crear el valor'
            })
        }
        return res.status(201).json({
            msg: 'Registro de la marca exitoso'
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
}

export const updateMarca = async (req: Request<{}, {}, { id: number, marca: string }>, res: Response) => {
    const { id, marca } = req.body;
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
        const updatedRow = await Marca.update(
            {
                marca,
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

export const showMarca = async (req: Request, res: Response) => {
    try {
        const marca = await Marca.findAll({
            where: { deleted: false },
            attributes: ['id', 'marca']
        })
        return res.json({
            data: marca
        })
    } catch (error) {
        return res.status(500).json({
            msg: 'Ocurrió un error en el servidor'
        })
    }
}

export const deleteMarca = async (req: Request<{}, {}, { id_eliminar: number }>, res: Response) => {
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
        const eliminado = await Marca.findOne({
            where: {
                id: id_eliminar
            }
        })
        if (!eliminado) {
            return res.status(404).json({
                msg: 'No se pudo eliminar la marca'
            })
        }
        await eliminado.update({
            deleted: true,
            who_deleted: admin.dataValues.email,
            when_deleted: new Date()
        })
        return res.status(201).json({
            msg: 'La marca se ha eliminado con éxito'
        })
    } catch (error) {
        return res.status(500).json({
            msg: "Error al actualizar la fila",
        });
    }
}
