import express,{Request,Response} from "express";
import bodyParser  from "body-parser";
import mustacheExpress from "mustache-express";
import path from 'path';
import route from './routes/routes';

require('dotenv').config()

const app = express()

app.engine('mustache',mustacheExpress())
app.set('view engine', 'mustache')
app.set('views',path.join(__dirname, '/views'))


app.use(express.static('public'))
app.use(bodyParser.json({limit:'50mb'}))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));


app.use(route)
app.use('/api',route)


app.use((req:Request, res:Response)=>{
    res.status(404).send('404')
})


const port = process.env.PORT || 80
app.listen(port, ()=> console.log('Servidor iniciado na porta: '+port))