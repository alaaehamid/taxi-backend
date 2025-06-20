const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

const db = require('./database'); // Initializes and verifies DB connection
const driverRoutes = require('./routes/drivers');
const carRoutes = require('./routes/cars');
const shiftRoutes = require('./routes/shifts');
const expenseRoutes = require('./routes/expenses');
const authRoutes = require('./routes/auth');

// Optional test route
app.get('/', (req, res) => res.send('FleetLogix API is running ✅'));

// Register API routes
app.use('/drivers', driverRoutes);
app.use('/cars', carRoutes);
app.use('/shifts', shiftRoutes);
app.use('/expenses', expenseRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Connected to PostgreSQL database`);
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
