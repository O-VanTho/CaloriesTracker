const axios = require('axios');
const express = require('express');
const connectDB = require('./db');
const cors = require('cors');
const { signUp, checkIfUserExist, login, getCurrentUser } = require('./src/controllers/authControllers');
const Food = require('./src/schema/Food');
const Meal = require('./src/schema/Meal');
const UserDiary = require('./src/schema/UserDiary');
const Post = require('./src/schema/Post');
const app = express();

app.use(cors());

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

connectDB();

// 
app.post('/create_post', async (req, res) => {
    try {
        const { postData, userId } = req.body;

        if (!postData.title || !postData.category || !postData.content || !postData.difficulty) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newPost = await Post.create({
            title: postData.title,
            author: userId,
            category: postData.category,
            timeCost: postData.timeCost || 30,
            content: postData.content,
            difficulty: postData.difficulty,
            rate: 0,
            image: postData.image
        });

        await newPost.save();

        res.status(200).json({message: "Create post success", post: newPost});
    } catch (error) {
        res.status(500).json({message: "Error to create post"});
    }
})


// 
app.post('/get-meal-from-diary', async (req, res) => {
    try {
        const { diaryId, mealType } = req.body;

        const diary = await UserDiary.findById(diaryId).populate({
            path: 'meals',
            match: { mealType: mealType },
            populate: {
                path: 'foods.food'
            }
        });

        if (!diary) {
            return res.status(201).json({ message: "Diary not found" });
        }

        const meal = diary.meals[0];

        if (!meal) {
            return res.status(201).json({ message: "Meal not found" });
        }

        res.status(200).json({ message: "Success get meal", meal: meal });

    } catch (error) {
        console.log("Error: ", error);
        res.status(500).json({ message: "Error get meal" });
    }
});

app.post('/get-diary-week', async (req, res) => {
    try {
        const { userId } = req.body;

        const diaryWeekly = Array(7).fill(null);
        const now = new Date();
        const dayOfWeek = now.getUTCDay(); // Get current day in UTC
        const startOfWeek = new Date(now);
        startOfWeek.setUTCDate(now.getUTCDate() - dayOfWeek); // Set to start of the week (Sunday)

        for (let i = 0; i < 7; i++) {
            const diaryDate = new Date(startOfWeek);
            diaryDate.setUTCDate(startOfWeek.getUTCDate() + i);

            const startOfDay = new Date(diaryDate);
            startOfDay.setUTCHours(0, 0, 0, 0);

            const endOfDay = new Date(diaryDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            const diaryDaily = await UserDiary.findOne({
                user: userId,
                date: { $gte: startOfDay, $lt: endOfDay }
            }).populate({
                path: 'meals',
                populate: {
                    path: 'foods.food'
                }
            });

            if (diaryDaily) {
                diaryWeekly[i] = diaryDaily;
            }
        }

        res.status(200).json({ message: "Success api diary week", diaryWeekly: diaryWeekly });
    } catch (error) {
        res.status(500).json({ message: "Error api diary week" }, error);
    }


})

app.post('/get-userdiary', async (req, res) => {
    try {
        const { userId, date } = req.body;
        const diaryDate = new Date(date);
        const startOfDay = new Date(diaryDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(diaryDate.setUTCHours(23, 59, 59, 999));

        const diary = await UserDiary.findOne(
            {
                user: userId,
                date: { $gte: startOfDay, $lt: endOfDay }
            });

        res.status(200).json({ message: "Success fetch diary data", diary: diary });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Fail to fetch Diary" });
    }
})

app.post('/add-food-to-diary/:diaryDate/:mealType', async (req, res) => {
    try {
        const { userId, foodId, quantity } = req.body;
        const diaryDate = new Date(req.params.diaryDate);
        const startOfDay = new Date(diaryDate.setUTCHours(0, 0, 0, 0));
        const endOfDay = new Date(diaryDate.setUTCHours(23, 59, 59, 999));
        const mealType = req.params.mealType;

        const foodObject = await Food.findOne({ foodId });

        const totalCalories = (foodObject.nutrients.find(nutrient => nutrient.name === "Calories")?.value || 0) * quantity;
        const totalProteins = (foodObject.nutrients.find(nutrient => nutrient.name === "Protein")?.value || 0) * quantity;
        const totalCarbs = (foodObject.nutrients.find(nutrient => nutrient.name === "Carbohydrates")?.value || 0) * quantity;
        const totalFats = (foodObject.nutrients.find(nutrient => nutrient.name === "Fat")?.value || 0) * quantity;

        let diary = await UserDiary.findOne({
            user: userId,
            date: { $gte: startOfDay, $lte: endOfDay }
        }).populate({
            path: 'meals',
            match: { mealType: mealType }
        });

        if (!diary) {
            let meal = await Meal.create({
                mealType: mealType,
                foods: [{
                    food: foodObject._id,
                    quantity: quantity
                }],
                totalCalories,
                totalCarbs,
                totalFats,
                totalProteins
            })

            diary = await UserDiary.create({
                user: userId,
                date: startOfDay,
                meals: [meal],
                totalCalories,
                totalCarbs,
                totalFats,
                totalProteins
            })

        } else {
            let meal = diary.meals.find((m) => m.mealType === mealType);

            if (meal) {
                meal.foods.push({
                    food: foodObject._id,
                    quantity: quantity
                }),
                    meal.totalCalories += totalCalories,
                    meal.totalProteins += totalProteins,
                    meal.totalCarbs += totalCarbs,
                    meal.totalFats += totalFats

                await meal.save();
            } else {
                meal = await Meal.create({
                    mealType: mealType,
                    foods: [{
                        food: foodObject._id,
                        quantity: quantity
                    }],
                    totalCalories,
                    totalCarbs,
                    totalFats,
                    totalProteins
                });

                diary.meals.push(meal);

            }

            diary.totalCalories += totalCalories;
            diary.totalProteins += totalProteins,
                diary.totalCarbs += totalCarbs;
            diary.totalFats += totalFats;

            await diary.save();
        }

        return res.status(200).json({ message: "Add food to Diary Success" });
    } catch (error) {
        console.log("Fail to log food", error);
        res.status(500).json({ message: "Fail to add food to diary" });
    }
})

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

app.post('/add-food-by-id/:foodId', async (req, res) => {
    const foodId = req.params.foodId;
    const { userId } = req.body;

    try {
        let food = await Food.findOne({ foodId: foodId });

        if (!food) {
            const foodData = await fetchFoodDataById(foodId);
            if (foodData) {
                food = await saveFoodDataOneObject(foodData, userId);
            } else {
                res.status(404).json({ message: "Food not found." });
            }
        }

        res.status(200).json({
            message: "Food found successfully!",
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

// app.get('/get-all', {

// });

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
// 
const filterFoodData = async (filterType, userId) => {
    try {
        if (filterType === 'all') {
            const foodData = await Food.find({ user: userId });

            return foodData;
        } else if (filterType === 'my meals') {

        } else if (filterType === 'my recipes') {

        }


    } catch (error) {

    }
};

// Fetch food data from API
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
const saveFoodData = async (foodData, userId) => {
    const foodItems = foodData.foods.map(item => {
        const labelNutrients = foodData.labelNutrients || {};

        const nutrients = [
            { name: 'Fat', value: labelNutrients.fat ? labelNutrients.fat.value : 0, unit: 'g' },
            { name: 'Saturated Fat', value: labelNutrients.saturatedFat ? labelNutrients.saturatedFat.value : 0, unit: 'g' },
            { name: 'Trans Fat', value: labelNutrients.transFat ? labelNutrients.transFat.value : 0, unit: 'g' },
            { name: 'Cholesterol', value: labelNutrients.cholesterol ? labelNutrients.cholesterol.value : 0, unit: 'mg' },
            { name: 'Sodium', value: labelNutrients.sodium ? labelNutrients.sodium.value : 0, unit: 'mg' },
            { name: 'Carbohydrates', value: labelNutrients.carbohydrates ? labelNutrients.carbohydrates.value : 0, unit: 'g' },
            { name: 'Fiber', value: labelNutrients.fiber ? labelNutrients.fiber.value : 0, unit: 'g' },
            { name: 'Sugars', value: labelNutrients.sugars ? labelNutrients.sugars.value : 0, unit: 'g' },
            { name: 'Protein', value: labelNutrients.protein ? labelNutrients.protein.value : 0, unit: 'g' },
            { name: 'Calcium', value: labelNutrients.calcium ? labelNutrients.calcium.value : 0, unit: 'mg' },
            { name: 'Iron', value: labelNutrients.iron ? labelNutrients.iron.value : 0, unit: 'mg' },
            { name: 'Calories', value: labelNutrients.calories ? labelNutrients.calories.value : 0, unit: 'kcal' }
        ];

        return {
            foodId: foodData.fdcId,
            name: foodData.description,
            brand: foodData.brandName || '',
            description: foodData.description || '',
            category: foodData.foodCategory || 'Unknown',
            servingSize: {
                size: item.servingSize || 0,
                unit: item.servingSizeUnit || 'g',
            },
            nutrients,
            user: userId
        }
    });

    try {
        await Food.insertMany(foodItems);
        console.log('Food data saved successfully');
    } catch (error) {
        console.error('Error saving food data:', error);
    }
};

const saveFoodDataOneObject = async (foodData, userId) => {
    const labelNutrients = foodData.labelNutrients || {};

    const nutrients = [
        { name: 'Fat', value: labelNutrients.fat ? labelNutrients.fat.value : 0, unit: 'g' },
        { name: 'Saturated Fat', value: labelNutrients.saturatedFat ? labelNutrients.saturatedFat.value : 0, unit: 'g' },
        { name: 'Trans Fat', value: labelNutrients.transFat ? labelNutrients.transFat.value : 0, unit: 'g' },
        { name: 'Cholesterol', value: labelNutrients.cholesterol ? labelNutrients.cholesterol.value : 0, unit: 'mg' },
        { name: 'Sodium', value: labelNutrients.sodium ? labelNutrients.sodium.value : 0, unit: 'mg' },
        { name: 'Carbohydrates', value: labelNutrients.carbohydrates ? labelNutrients.carbohydrates.value : 0, unit: 'g' },
        { name: 'Fiber', value: labelNutrients.fiber ? labelNutrients.fiber.value : 0, unit: 'g' },
        { name: 'Sugars', value: labelNutrients.sugars ? labelNutrients.sugars.value : 0, unit: 'g' },
        { name: 'Protein', value: labelNutrients.protein ? labelNutrients.protein.value : 0, unit: 'g' },
        { name: 'Calcium', value: labelNutrients.calcium ? labelNutrients.calcium.value : 0, unit: 'mg' },
        { name: 'Iron', value: labelNutrients.iron ? labelNutrients.iron.value : 0, unit: 'mg' },
        { name: 'Calories', value: labelNutrients.calories ? labelNutrients.calories.value : 0, unit: 'kcal' }
    ];

    const servingSize = {
        size: foodData.servingSize || 1,
        unit: foodData.servingSizeUnit || 'g'
    };


    const foodItem = {
        foodId: foodData.fdcId,
        name: foodData.description,
        brand: foodData.brandName || '',
        description: foodData.description || '',
        category: foodData.foodCategory?.description || 'Unknown',
        servingSize,
        nutrients,
        user: userId
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