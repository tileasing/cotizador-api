"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsuarios = void 0;
const usuario_1 = __importDefault(require("../models/usuario"));
const getUsuarios = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const usuario = yield usuario_1.default.findAll();
    res.json({ msg: 'Usuarios', usuario });
});
exports.getUsuarios = getUsuarios;
// export const getUsuario = async( req: Request, res: Response ) => {
//     const { id } = req.params
//     const usuario = await Usuario.findByPk( id )
//     if (usuario){
//         res.json(usuario)
//     }else{
//         res.status(404).json({
//             msg:`No existe un usuario con el id ${ id }`
//         })
//     }
// }
// export const postUsuario = async( req: Request, res: Response ) => {
//     const { body } = req
//     try {
//         const existeEmail = await Usuario.findOne({
//             where:{
//                 email: body.email
//             }
//         })
//         if(existeEmail){
//             return res.status(400).json({
//                 msg: 'Ya existe un usuario con el email: ' + body.email 
//             })
//         }
//         const usuario = await Usuario.create(body)
//         // const usuario = Usuario.build(body)
//         // await usuario.save()
//         res.json(usuario)
//         // const usuario = new Usuario(body)
//         // await usuario.save()
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Consulte al administrador'
//         })
//     }
// }
// export const putUsuario = async( req: Request, res: Response ) => {
//     const { id } = req.params
//     const { body } = req
//     try {
//         const usuario = await Usuario.findByPk( id )
//         if (!usuario){
//             return res.status(404).json({
//                 msg: 'No existe el usuario con el id: '+ id
//             })
//         }
//         await usuario.update( body )
//         res.json(usuario)
//     } catch (error) {
//         console.log(error)
//         res.status(500).json({
//             msg: 'Consulte al administrador'
//         })
//     }
// }
// export const deleteUsuarios = async( req: Request, res: Response ) => {
//     const { id } = req.params
//     const usuario = await Usuario.findByPk( id )
//     if (!usuario){
//         return res.status(404).json({
//             msg: 'No existe el usuario con el id: '+ id
//         })
//     }
//     await usuario.update({estado:0})
//     //Borra definitivamente
//     // await usuario.destroy()
//     res.json(usuario)
// }
