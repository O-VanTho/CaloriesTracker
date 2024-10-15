const axios = require('axios');
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const { signUp, checkIfUserExist, login, getCurrentUser } = require('./src/controllers/authControllers');
const Food = require('./src/schema/Food');
const Meal = require('./src/schema/Meal');
const UserDiary = require('./src/schema/UserDiary');
const app = express();

app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();

// app.post('/add-food-to-diary/:user/:diaryDate/:mealType', async (req, res) => {
//     try {
//         const { user, foodObject } = req.body;
//         const diaryDate = req.params.diaryDate;
//         const mealType = req.params.mealType;

//         const diary = UserDiary.findOne({ user });

//         if (!diary) {
//             const meal = Meal.create({
//                 mealType: mealType,
//                 foods: foodObject,
//                 totalCalories: foodObject.nutrients.findOne({name: "calories"}),
//                 totalProteins: foodObject.nutrient.findOne({name: "Protein"})

//             })
//         } else {

//         }

//     } catch (error) {

//     }
// })

app.get('/add-food/:name', async (req, res) => {
    const foodName = req.params.name;
    try {
        const foodData = await fetchFoodData(foodName);
        if (foodData) {
            await saveFoodData(foodData);
            res.status(200).json({
                message: "Food data added successfully!",
                food: foodData
            });
        } else {
            res.status(404).json({ message: "Food not found." });
        }
    } catch (error) {
        console.error('Error adding food data:', error);
        res.status(500).json({ message: "Error adding food data." });
    }
});

// On progressing
app.get('/add-food-by-id/:foodId', async (req, res) => {
    const foodId = req.params.foodId;
    try {
        let food = await Food.findOne({ id: foodId });

        if (!food) {
            const foodData = await fetchFoodDataById(foodId);
            if (foodData) {
                food = await saveFoodDataOneObject(foodData);

                console.log('Food data saved:', food);
            } else {
                res.status(404).json({ message: "Food not found." });
            }
        }

        res.status(200).json({
            message: "Food found successfully!",
            food: food
        });
    } catch (error) {
        console.error('Error adding food data:', error);
        res.status(500).json({ message: "Error adding food data." });
    }
});

app.get('/view-food', async (req, res) => {
    const { foodId } = req.query;

    try {
        const foodData = await fetchFoodDataById(foodId);
        res.status(200).json(foodData);
    } catch (error) {
        console.log("Error view Food");
    }
});

// AuthControllers 
app.post('/check-email', checkIfUserExist);

app.post('/create-user', signUp);

app.post('/sign-in', login);

app.get('/current-user', getCurrentUser);

// 404 handler
app.use((req, res) => {
    res.status(404).send("404 - Not Found");
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send("Something broke!");
});

app.listen(5000, () => {
    console.log("App is running on http://localhost:5000");
});

// Fetch food data
const fetchFoodData = async (foodName) => {
    const apiKey = '20FnJUBnx3LNNqhalYcz5x7ZZfvFYImjXtcarKwF';
    const url = `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodName}&api_key=${apiKey}`;

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching food data:', error);
    }
};

const fetchFoodDataById = async (foodId) => {
    const apiKey = '20FnJUBnx3LNNqhalYcz5x7ZZfvFYImjXtcarKwF';
    const url = `https://api.nal.usda.gov/fdc/v1/food/${foodId}?api_key=${apiKey}`;
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching food data:', error);
    }
}

// Save food data to the database
const saveFoodData = async (foodData) => {
    const foodItems = foodData.foods.map(item => ({
        name: foodData.description,
        brand: foodData.brandName || '',
        description: foodData.description || '',
        category: foodData.foodCategory || 'Unknown',
        servingSize: {
            size: item.servingSize || 0,
            unit: item.servingSizeUnit || 'g', // Assume grams if no unit is provided
        },
        nutrients: item.foodNutrients
          ?.filter(nutrient => 
            ['Energy', 'Protein', 'Total lipid (fat)', 'Carbohydrate, by difference'].includes(nutrient.nutrientName))
          .map(nutrient => ({
            name: nutrient.nutrientName,
            unit: nutrient.unitName,
            value: nutrient.value,
          })) || []
    }));

    try {
        await Food.insertMany(foodItems);
        console.log('Food data saved successfully');
    } catch (error) {
        console.error('Error saving food data:', error);
    }
};

const saveFoodDataOneObject = async (foodData) => {
    const nutrients = foodData.foodNutrients
    ?.filter(nutrient => ['Energy', 'Protein', 'Total lipid (fat)', 'Carbohydrate, by difference'].includes(nutrient.nutrientName))
    .map(nutrient => ({
        name: nutrient.nutrientName,
        unit: nutrient.unitName,
        value: nutrient.value
    })) || [];
    
    const servingSize = {
        size: foodData.servingSize || 1,  
        unit: foodData.servingSizeUnit || 'g'
    };

    const foodItem = {
        name: foodData.description,
        brand: foodData.brandName || '',
        description: foodData.description || '',
        category: foodData.foodCategory || 'Unknown',
        servingSize,
        nutrients,
    };

    try {
        await Food.create(foodItem);
        console.log('Food data saved successfully');
    } catch (error) {
        console.error('Error saving food data:', error);
        throw new Error('Error saving food data to the database');
    }
};

// 
const addFoodToDiary = async (foodData) => {

}