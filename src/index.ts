import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/database';
import routes from './presentation/routes';
import cookieParser from 'cookie-parser';
import http from 'http';
import setupSocketIO from './utils/socket';
import { CLIENTURL, PORT} from './config/env';

const app: Application = express();
const Port = PORT|| 3000;

const corsOptions = {
  origin: CLIENTURL,
  //  origin:'https://qnn863k8-5173.inc1.devtunnels.ms',
   methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};



app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use('/', routes);




const server = http.createServer(app);
const io = setupSocketIO(server);

connectDB().then(()=>{
  server.listen(Port, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})
