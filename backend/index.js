const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

const app = express();
const port = 5001;

// Allowed origins (can be adjusted as needed)
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'https://ash-foods.vercel.app'];

// CORS options
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("Not allowed");
            callback(new Error('Not allowed by CORS'));
        }
    },
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
};

// Use CORS middleware
app.use(cors(corsOptions));

// Custom CORS middleware to handle 'Access-Control-Allow-Origin'
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allows all origins
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(express.json());

// Database connection
connectDB((err, data, CatData) => {
    if (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    } else {
        console.log('Connected to MongoDB');
        global.foodData = data;
        global.foodCategory = CatData;

        // Start the server after database connection
        app.listen(port, () => {
            console.log(`Server running on http://localhost:${port}`);
        });

        // Define routes after database is initialized
        app.use('/api/auth', require('./routes/auth'));

        // Root route
        app.get('/', (req, res) => {
            res.send('Hello World!');
        });
    }
});
