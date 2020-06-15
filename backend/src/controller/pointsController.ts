import knex from '../database/connection'
import {Request, Response} from 'express'

class PointsController{

  async index (request: Request, response: Response){
    const {city, uf, items} = request.query

    const parsedItems = String(items)
                          .split(',')
                          .map(item => Number(item.trim()))

    const points = await knex('points')
        .join('point_items', 'pont_id', '=', 'point_items.pont_id')
        .whereIn('point_items.item_id', parsedItems)
        .where('city', String(city))
        .where('uf', String(uf))
        .distinct()
        .select('points.*')

        const serializedPoints = points.map( point => {
          return{
           ...point,
            image_url: `http:localhost:3333/uploads/${point.image}`,
          };
        });
    return response.json(serializedPoints)
  }

  async create(request: Request, response: Response)  {
    const {name,email,whatsapp,latitute,longitude,city,uf,
      items
    } = request.body
  
    const point = {
      image: request.file.filename,
      name,
      email,
      whatsapp,
      latitute,
      longitude,
      city,
      uf,
    };

    const ids = await knex('points').insert(point);
  
    const pont_id = ids[0];
  
    const pointItems = items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => {
              return {
                item_id,
                pont_id
              };
    })
    await knex('point_items').insert(pointItems)
  
      return response.json({
        id: pont_id,
        ...point
      });
  }

  async show(request: Request, response: Response){
    const {id} = request.params

    const point = await knex('points').where('id', id).first()

    if(!point){
      return response.status(400).json({error: 'Point not found'})
    }

    const serializedPoint = {
      ...point,
      image_url: `http:localhost:3333/uploads/${point.image}`,
    }

    const items = await knex('items')
          .join('point_items', 'items.id', '=', 'point_items.item_id')
          .where('point_items.pont_id', id) 

    return response.json({serializedPoint, items});
  }
  
}
export default PointsController