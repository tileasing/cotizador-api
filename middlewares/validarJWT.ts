import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'

export const validarJWT = ( req:Request, res:Response, next:NextFunction ) => {
    // Pendiente
    const token = req.header('token')
    // console.log('Aqui esta el token: ',token)
    if( !token ){
        // return res.status(401).json({ msg:'El token es necesario para la petición' })
        return res.status(401).send()
    }
    try {
        const extraccion = jwt.verify( token, process.env.SECRET_JWT as string )
        // console.log(extraccion)
        req.authData = extraccion as { id?:string, iat?: any }
        next() 
    } catch (error) {
        // res.status(401).json({  msg:'Token no válido' })
        res.status(401).send()
    }
}

module.exports = {
    validarJWT
}
