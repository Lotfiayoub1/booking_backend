require('dotenv').config();
const app = require('./src/config/app');
const { sequelize } = require('./src/models');

const PORT = parseInt(process.env.PORT, 10) || 3000;

const start = async () => {
  try {
    await sequelize.authenticate();
    console.log('✔  Database connection established');

    app.listen(PORT, () => {
      console.log(`✔  Server running on port ${PORT} [${process.env.NODE_ENV || 'development'}]`);
    });
  } catch (err) {
    console.error('✘  Failed to start server:', err.message);
    process.exit(1);
  }
};

start();
