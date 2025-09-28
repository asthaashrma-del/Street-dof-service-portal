require('dotenv').config(); // 🔹 Load .env before using MONGO_URI
const mongoose = require('mongoose');
const Dog = require('./models/Dog');

const locations = ['Delhi', 'Mumbai', 'Chennai', 'Kolkata'];

async function addLocations() {
  await mongoose.connect(process.env.MONGO_URI); // Now it will not be undefined
  const dogs = await Dog.find();

  for (const dog of dogs) {
    if (!dog.location) {
      dog.location = locations[Math.floor(Math.random() * locations.length)];
      await dog.save();
    }
  }

  mongoose.disconnect();
  console.log('✅ Locations added to dogs!');
}

addLocations();
