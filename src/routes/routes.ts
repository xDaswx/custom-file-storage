import { Router,Request,Response } from "express"
import { indexPage,getImagePipe,seeImagePreview } from "../controllers/websiteController";
import { uploadImagev2,removeImage } from "../controllers/apiController";
import multerHandler from "../multer/multerValidator"

const route = Router()

//websiteController
route.get('/',indexPage)
route.get('/media/:id',getImagePipe)
route.get('/view/:id',seeImagePreview)
//apiController
route.post('/upload/',multerHandler ,uploadImagev2)

route.get('/remove/:id',removeImage)

export default route;