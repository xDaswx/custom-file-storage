import { Router,Request,Response } from "express"
import { indexPage, seeFilePage } from "../controllers/websiteController";
import { uploadImagev2,removeImage } from "../controllers/apiController";
import multerHandler from "../multer/multerValidator"

const route = Router()

//websiteController
route.get('/',indexPage)
//apiController
route.post('/upload/',multerHandler ,uploadImagev2)
route.get('/media/:id',seeFilePage)
route.get('/remove/:id',removeImage)

export default route;