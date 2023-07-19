import {Request,Response } from "express"
import S3storage from "../utils/S3storage";

const indexPage = (req:Request, res: Response)=>{
    res.render('index')
}

const getImagePipe = (req:Request, res: Response) =>{
    const {id} = req.params
    if(id){
      const aws_resposne = S3storage.getFileStream(id)
  
      aws_resposne.on('error', (err: any) => {
        if (err.code === 'AccessDenied') {
          return res.status(403).json({ error: 'Acesso negado ao acessar o arquivo' });
        }
        return res.status(500).json({ error: 'Erro ao acessar o arquivo' });
      });
      return aws_resposne.pipe(res)
      
    }
    else{
      return res.status(500).json({ error: 'Parâmetro id não foi informado' });
    }
  }


export {indexPage,getImagePipe}