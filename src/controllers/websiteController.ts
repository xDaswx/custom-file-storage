import {Request,Response } from "express"


const indexPage = (req:Request, res: Response)=>{
    res.render('index')
}

const seeFilePage = (req:Request, res: Response)=>{
    res.render('index')
}



export {indexPage,seeFilePage}