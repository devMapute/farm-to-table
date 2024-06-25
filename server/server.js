
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

// Initialize server
const app = express();
app.use(cors({origin: 'http://localhost:3000'}))

// middleware
app.use(bodyParser.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }));

// Import router
import router from '../router/router.js';
router(app);


// Server listens at Port 3001
app.listen(3001, () => { console.log("API listening at port 3001.")});