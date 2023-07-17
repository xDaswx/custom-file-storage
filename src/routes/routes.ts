import { Router,Request,Response } from "express"
import { indexPage, seeFilePage } from "../controllers/websiteController";
import { uploadImage,removeImage } from "../controllers/apiController";


const route = Router()

//websiteController
route.get('/',indexPage)
route.get('/archive',seeFilePage)

//apiController
route.post('/upload/',uploadImage)
route.get('/remove/:id',removeImage)

export default route;