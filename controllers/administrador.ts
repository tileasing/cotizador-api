import { Request, Response } from "express";
import {
  IDTOAdministrador,
  IDTOUpdatePassword,
  IDTOReplacePassword,
} from "../interfaces/administradorInterfaces";
import bcrypt from "bcrypt";
import { BaseResponseType } from "../interfaces/BaseResponseType";
import { Administrador, Cliente } from "../models";

export const getAdmin = async (req: Request, res: Response) => {
  const admin = await Administrador.findAll();
  res.json({ msg: "Admins", admin });
};

export const registerAdministrador = async (
  req: Request<{}, {}, IDTOAdministrador>,
  res: Response<BaseResponseType>
) => {
  const { nombre, email, password, tipo_administrador } = req.body;
  try {
    const adminExist = await Administrador.findOne({
      where: {
        email,
      },
    });
    if (adminExist) {
      return res.status(404).json({
        success: false,
        errors: ["Ya existe un usuario con el email: " + email],
      });
    }
    const hash = await bcrypt.hash(password, 10);
    const saveAdmin = await Administrador.create({
      nombre,
      email,
      tipo_administrador,
      password: hash,
    });
    if (!saveAdmin) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo crear el administrador: " + nombre],
      });
    }
    return res.status(201).json({
      success: true,
      data: {
        msg: "Administrador creado con éxito",
      },
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateAdmin = async (
  req: Request<{}, {}, IDTOAdministrador>,
  res: Response<BaseResponseType>
) => {
  const { id, nombre, tipo_administrador, email } = req.body;
  try {
    const myID = req.authData?.id;
    const adminExist = await Administrador.findOne({
      where: {
        id: myID,
      },
    });
    if (!adminExist) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el administrador"],
      });
    }
    if (id !== myID) {
      console.log("Dentro de la condicional");
      const adminEdit = await Administrador.findOne({
        where: {
          id,
        },
      });
      if (!adminEdit) {
        return res.status(404).json({
          success: false,
          errors: ["No se encuentra el administrador a editar"],
        });
      }
      await adminEdit.update({
        nombre,
        tipo_administrador,
        email,
      });
      return res.status(201).json({
        success: true,
        data: {
          msg: "El administrador fue actualizado con éxito",
        },
      });
    }
    await adminExist.update({
      nombre,
      tipo_administrador,
      email,
    });
    return res.status(201).json({
      success: true,
      data: {
        msg: "El administrador fue actualizado con éxito",
      },
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const updateAdminPass = async (
  req: Request<{}, {}, IDTOUpdatePassword>,
  res: Response<BaseResponseType>
) => {
  const { password, newPassword } = req.body as IDTOUpdatePassword;
  try {
    // Encuentra al administrador
    const adminExist = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    // Verifica que se haya encontrado el administrador
    if (!adminExist) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el administrador"],
      });
    }
    // Verifica que sea un usuario activo
    if (adminExist.dataValues.deleted === true) {
      return res.status(400).json({
        success: false,
        errors: ["Este usuario ha sido eliminado"],
      });
    }
    // Verifica que los tipos de datos sean correctos
    if (typeof password !== "string" || typeof newPassword !== "string") {
      return res.status(400).json({
        success: false,
        errors: ["Los tipos de datos son incorrectos"],
      });
    }
    // Verifica que la contraseña actual del usuario sea válida
    const validPassword = await bcrypt.compare(
      password,
      adminExist.dataValues.password
    );
    if (!validPassword) {
      return res.status(401).json({
        success: false,
        errors: ["La contraseña actual es incorrecta"],
      });
    }

    // Actualiza la contraseña del usuario
    const passCifrada = await bcrypt.hash(newPassword, 10);
    await adminExist.update({ password: passCifrada });

    // Retorna la respuesta de la contraseña si es efectuada con éxito
    return res.status(201).json({
      success: true,
      data: {
        msg: "Contraseña actualizada con éxito",
      },
    });
  } catch (error) {
    // Retorna un error si es que ocurre en la operación
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const deleteOtherAdmin = async (
  req: Request<{}, {}, { id_eliminar: number }>,
  res: Response<BaseResponseType>
) => {
  const { id_eliminar } = req.body;
  try {
    // Encuentra al administrador
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el administrador"],
      });
    }
    const eliminado = await Administrador.findOne({
      where: {
        id: id_eliminar,
      },
    });
    if (!eliminado) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo eliminar el administrador"],
      });
    }
    await eliminado.update({
      deleted: true,
      who_deleted: admin.dataValues.email,
      when_deleted: new Date(),
    });
    return res.status(201).json({
      success: true,
      data: {
        msg: "El administrador eliminado con éxito",
      },
    });
  } catch (error) {
    // Retorna un error si es que ocurre en la operación
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const showAdmin = async (
  req: Request,
  res: Response<BaseResponseType>
) => {
  try {
    const users = await Administrador.findAll({
      where: { deleted: false },
      attributes: ["id", "nombre", "email", "tipo_administrador"],
      order: [
        // Will escape title and validate DESC against a list of valid direction parameters
        ["createdAt", "ASC"],
      ],
    });
    if (!users) {
      return res.status(404).json({
        success: false,
        errors: ["Ha ocurrido un error al cargar los usuarios"],
      });
    }
    return res.json({
      success: true,
      data: { users },
    });
  } catch (error) {
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const replacePassword = async (
  req: Request<{}, {}, IDTOReplacePassword>,
  res: Response<BaseResponseType>
) => {
  const { id_editPassword, newPassword } = req.body;
  try {
    // Encuentra al administrador
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin) {
      return res.status(404).json({
        success: false,
        errors: ["No se encuentra el administrador"],
      });
    }
    // Encuentra al administrador al cual se le cambiará la contraseña
    const administradorUpdate = await Administrador.findOne({
      where: {
        id: id_editPassword,
      },
    });
    if (!administradorUpdate) {
      return res.status(404).json({
        success: false,
        errors: ["No se pudo econtrar al administrador"],
      });
    }
    const hash = await bcrypt.hash(newPassword, 10);
    await administradorUpdate.update({
      password: hash,
    });
    return res.status(201).json({
      success: true,
      data: {
        msg: "Se ha actualizado la contraseña con éxito",
      },
    });
  } catch (error) {
    // Retorna un error si es que ocurre en la operación
    console.log({ error });
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};

export const testCreateAdmins = async (req: Request, res: Response) => {
  try {
    const resultados = await Administrador.findAll();
    const administradoresExistentes = [
      "juan@gmail.com",
      "daniel@gmail.com",
      "leo@gmail.com",
    ];
    const correoABuscar = "brian@gmail.com";
    const objetoBrian = resultados.find(
      (objeto) => objeto.dataValues.email === correoABuscar
    );
    if (objetoBrian) {
      await objetoBrian.destroy();
    }
    const administradoresEncontrados = resultados.filter((objeto) =>
      administradoresExistentes.includes(objeto.dataValues.email)
    );
    if (administradoresEncontrados.length > 0) {
      return res.status(404).json({ msg: "Los administradores ya existen" });
    }
    const hash = await bcrypt.hash("123456789", 10);
    const saveAdmin = await Administrador.create({
      nombre: "Juan",
      email: "juan@gmail.com",
      tipo_administrador: "Administrador",
      password: hash,
    });
    const saveAdmin1 = await Administrador.create({
      nombre: "Daniel",
      email: "daniel@gmail.com",
      tipo_administrador: "Promotor",
      password: hash,
    });
    const saveAdmin2 = await Administrador.create({
      nombre: "Leo",
      email: "leo@gmail.com",
      tipo_administrador: "Validador",
      password: hash,
    });
    if (!saveAdmin || !saveAdmin1 || !saveAdmin2) {
      return res.status(404).json({
        msg: "No se pudo crear el administrador: ",
      });
    }
    return res.status(201).json({
      msg: "Administrador creado con éxito",
    });
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
};

export const viewClients = async (
  req: Request<{}, {}, {}>,
  res: Response<BaseResponseType>
) => {
  try {
    const admin = await Administrador.findOne({
      where: {
        id: req.authData?.id,
      },
    });
    if (!admin)
      return res.status(401).json({
        success: false,
        errors: ["Ha ocurrido un error de autenticación"],
      });

    const clientes = await Cliente.findAll({
      attributes: ["id", "nombre"],
    });

    return res.json({
      success: true,
      data: { clientes },
    });
  } catch (error) {
    const err = error as Error;
    res.status(400).json({
      success: false,
      errors: [err.message],
    });
  }
};
