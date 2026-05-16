import express from 'express';
import cors from 'cors';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors());

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get('/folders', async (req, res) => {

  try {
    console.log( process.env.CLOUDINARY_CLOUD_NAME)
    const result = await cloudinary.api.root_folders();

    res.json(result);

  } catch (error) {
    console.error("Error en Cloudinary:", error); // Esto lo ves tú en la terminal
    res.status(500).json({ error: 'No se pudieron obtener las carpetas' });

  }

});

// La URL para probar esto será: http://localhost:3000/fotos/kalvar
app.get('/fotos/:folderName', async (req, res) => {
  const folder = req.params.folderName;

  try {
    const result = await cloudinary.search
      .expression(`asset_folder="${folder}"`) // Usamos comillas dobles dentro del string por seguridad
      .sort_by('created_at', 'desc')
      .max_results(100) // ¡Acá controlás el límite real!
      .execute();

    // El Search API devuelve un objeto con un array llamado 'resources'
    if (result.resources.length === 0) {
      return res.status(404).json({ message: "No se encontraron fotos en esa carpeta lógica." });
    }

    res.json(result.resources);
  } catch (error) {
    console.error("Error en Search API:", error);
    res.status(500).json({ error: "Error al buscar fotos de forma eficiente" });
  }
});

app.get('/api/ping', (req, res) => {
  res.status(200).json({ ok: true });
});

app.listen(3000, () => {
  console.log('server running');
});