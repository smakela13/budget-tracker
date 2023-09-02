const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3002;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// Mongoose connection
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
};

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/budget', mongooseOptions)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB:', err.message);
  });

// Mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to the database.');
});

mongoose.connection.on('error', (err) => {
  console.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected.');
});

// Function to close Mongoose connection gracefully
function gracefulShutdown(msg, callback) {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
}

// For app termination
process.on('SIGINT', () => {
  gracefulShutdown('app termination', () => {
    process.exit(0);
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  res.status(err.status || 500).send({ error: err.message || 'An unexpected error occurred!' });
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});