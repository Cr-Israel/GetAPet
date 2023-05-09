import express from 'express';
import cors from 'cors';
import conn from './db/conn.js';

const app = express();

// Config JSON Response
app.use(express.json());

// Solve CORS
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Public Folder for Imgaes
app.use(express.static('public'));

// Routes
import UserRoutes from './routes/UserRoutes.js';
import PetRoutes from './routes/PetRoutes.js';
app.use('/users', UserRoutes);
app.use('/pets', PetRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}!`);
});