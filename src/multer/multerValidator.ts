import {Request,Response,NextFunction } from "express"
import upload from './config/multer'
import multer from "multer"


const image = upload.single('image')

const multerHandler = (req:Request,res:Response,next:NextFunction)=> {
    image(req, res, (err)=>{
        if (err instanceof multer.MulterError) {
            return res.status(400).json({error:err.message})
          } 
        if(err){
            return res.status(400).json({error:err.message})
        }
        next()
    })
}

export default multerHandler