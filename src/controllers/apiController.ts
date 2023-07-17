import {Request,Response } from "express"
import jimp from "jimp"
import {v4 as uuidv4} from "uuid"
import fs from 'fs';
import path from 'path';


const saveImage = async (buffer:Buffer,filetype:string) => {
    let imgname = `${uuidv4().split('-')[0]}.${filetype}`
    if (['png', 'jpg', 'jpeg'].includes(filetype)){
        let tmpImg = await jimp.read(buffer)
        tmpImg.quality(80).write(`./public/media/${imgname}`);
        return imgname;
    }
    fs.writeFileSync(path.join(__dirname, '../../public/media/'+imgname),buffer)
    return imgname

}

const removeImageFromMedia = (nomeArquivo: string): string => {
    try {
      const files = fs.readdirSync('./public/media/');
      const find = files.filter((file) => file.startsWith(nomeArquivo));

      if (find.length !== 0) {
        const filePath = `./public/media/${find[0]}`;
        fs.unlinkSync(filePath);
        return 'Arquivo removido com sucesso!';

      } else {
        return 'Não encontrado';
      }
    } 

    catch (err) {
      console.error('Erro ao verificar ou remover o arquivo:', err);
      return 'Erro ao remover o arquivo';
    }
  };

const mediaTamanho = ():number => {
    const dir = fs.readdirSync('./public/media/');
    return dir.length
}


const uploadImage = async (req:Request, res: Response)=>{
    try {
        const numberOfFiles = mediaTamanho();
        console.log('Quantidade de arquivos na pasta "public":', numberOfFiles);
    
        if (numberOfFiles > 10) {
          return res.status(400).json({ message: 'Armazenamento cheio' });
        }
    
    }
    catch (err) {
        console.log("Erro em uploadImage: ",err)
        return res.status(500).json({ message: 'Erro ao verificar armazenamento' });
    }


    let fileUrl:string = ''

    if (req.files && req.files.imagem) {
        const filesArray = Array.isArray(req.files) ? req.files : Object.values(req.files);

        if (Array.isArray(req.files.imagem) || Object.values(req.files).length > 1){
            return res.status(400).json({message:'Somente uma imagem pode ser enviada'})
        }
        console.log(req.files.imagem)
        const allowed = ['image/png','image/jpeg','video/mp4','image/gif']
        for (const file of filesArray) {
          if (allowed.includes(file.mimetype)){
                const filetype:string= file.name.split('.').pop()
                const url = await saveImage(file.data,filetype);
                fileUrl = `${req.protocol}://${req.headers.host}/media/${url}`
          }
          else{
            return res.status(400).json({message:'Apenas arquivos com formato png ou jpg'})
          }
 
        }
    }
    else{
        return res.json({message:"Os arquivos de imagens deve possuir o form-data name chamado imagem"})
    }
    res.json({message:"conteudo recebido!",fileUrl})
}

const removeImage = async (req:Request, res: Response)=>{
    const {id} = req.params
    if (id.length != 8 ) return res.json({message:'Nome incorreto'})
    const message = removeImageFromMedia(id)
    return res.json({message:message})
}

export {uploadImage,removeImage}