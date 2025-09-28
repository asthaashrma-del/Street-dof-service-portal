require('dotenv').config()
const mongoose = require('mongoose');
const Dog = require('./models/Dog'); // Adjust path if necessary
const { faker } = require('@faker-js/faker');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log("MongoDB connected");
    seedDogs();
})
.catch((err) => {
    console.error("Connection error:", err);
});

async function seedDogs() {
    await Dog.deleteMany(); // Clears existing data (optional)

    const dogSizes = ['Small', 'Medium', 'Large'];
    const dogStatus = ['Available', 'Adopted', 'Fostered'];

    const dogs = Array.from({ length: 100 }, () => ({
        name: faker.person.firstName(),
        breed: faker.animal.dog(),
        age: faker.number.int({ min: 1, max: 15 }),
        size: faker.helpers.arrayElement(dogSizes),
        color: faker.color.human(),
        vaccinated: faker.datatype.boolean(),
        adoptionStatus: faker.helpers.arrayElement(dogStatus),
        location: {
      type: "Point",
      coordinates: [
        parseFloat(faker.location.longitude()),
        parseFloat(faker.location.latitude())
      ]
    },
        imageUrl: faker.image.urlLoremFlickr({ category: 'dog' }), // Random dog image URL
        description: faker.lorem.sentence(),
    }));

    try {
        await Dog.insertMany(dogs);
        console.log("✅ 100 Dogs inserted successfully!");
        mongoose.connection.close();
    } catch (err) {
        console.error("Insert error:", err);
    }
}

