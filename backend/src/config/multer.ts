import multer from 'multer'
import path from 'path'
import crypto from 'crypto'

//Updade de imagens
export default {
  storage: multer.diskStorage({
    destination: path.resolve(__dirname, '..' , '..', 'uploads'),
    filename(request, file, callback){
        const hash = crypto.randomBytes(6).toString('hex'); // Gerando o hash

        const fileName = `${hash}-${file.originalname}`; //Gerando o nome do arquivo

        callback(null, fileName); //Retorna o nome do arquigo

    }
  }),

};