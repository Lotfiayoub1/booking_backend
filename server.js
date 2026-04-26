require('dotenv').config();
const app = require('./src/config/app');
const { sequelize } = require('./src/models');

const PORT = parseInt(process.env.PORT, 10) || 3000;

// Start HTTP server immediately — Railway needs the port bound right away
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
});

// Attempt DB connection in the background; retry until it succeeds
const connectDB = async (attempt = 1) => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established');
    app.locals.dbReady = true;
  } catch (err) {
    const delay = Math.min(attempt * 5000, 30000); // cap at 30s
    console.error(`Database not ready (attempt ${attempt}): ${err.message}. Retrying in ${delay / 1000}s...`);
    setTimeout(() => connectDB(attempt + 1), delay);
  }
};

connectDB();
