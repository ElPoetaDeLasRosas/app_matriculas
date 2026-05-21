const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite que el móvil se conecte

// Configuración del almacenamiento organizado
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Obtenemos los datos que envía el móvil
        const anioFolder = req.body.anio || `fotos ${new Date().getFullYear()}`;
        const matriculaFolder = req.body.matricula || 'SIN_MATRICULA';
        
        // Creamos la ruta: Carrocerias / fotos 2026 / 1234ABC
        const dir = path.join(__dirname, 'Carrocerias', anioFolder, matriculaFolder);
        
        // Si las carpetas no existen, las creamos automáticamente
        fs.mkdirSync(dir, { recursive: true });
        
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Mantiene el nombre de archivo enviado por el móvil
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Ruta que recibe la foto desde el móvil
app.post('/guardar-foto', upload.single('foto'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No se recibió ninguna foto.');
    }
    console.log(`Foto guardada con éxito en la carpeta de la matrícula: ${req.body.matricula}`);
    res.status(200).send('Foto guardada en el equipo.');
});

// Arranca el servidor en el puerto 3000
app.listen(3000, '0.0.0.0', () => {
    console.log('Servidor escuchando en http://192.168.13.190:3000');
});