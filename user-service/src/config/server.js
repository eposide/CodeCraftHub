const express = require('express');
   const mongoose = require('mongoose');
   const userRoutes = require('../routes/userRoutes');
   const app = express();
   require('dotenv').config();

   // Middleware
   app.use(express.json());

   // Routes
   app.use('/api/users', userRoutes);

   // Database connection
   mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
       .then(() => console.log('MongoDB connected'))
       .catch(err => console.error(err));

   const PORT = process.env.PORT || 5000;
   app.listen(PORT, () => {
       console.log(`Server running on port ${PORT}`);
   });