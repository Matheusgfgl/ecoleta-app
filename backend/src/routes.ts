import express from 'express'
import {celebrate, Joi} from 'celebrate'
import multer from 'multer'
import multerConfig  from './config/multer'

import ItemsController from './controller/itemsController';
import PointsController from './controller/pointsController';

const itemsController = new ItemsController();
const pointsController = new PointsController();

const routes = express.Router();
const upload = multer(multerConfig)


routes.get('/items', itemsController.index);
routes.get('/points/:id', pointsController.show);
routes.get('/points', pointsController.index);

routes.post(
    '/points',
  upload.single('image'),
  celebrate({
    body: Joi.object().keys({
        name: Joi.string().required(),
        email: Joi.string().required().email(),
        whatsapp: Joi.number().required(),
        latitute: Joi.number().required(),
        longitude: Joi.number().required(),
        city: Joi.string().required(),
        uf: Joi.string().required().max(2),
        items: Joi.string().required()
    })
  }), 
  pointsController.create
  
  );


export default routes;