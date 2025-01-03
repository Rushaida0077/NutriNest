const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb+srv://rushaidakhanam:1@cluster0.t8ykc.mongodb.net/recipesDB?retryWrites=true&w=majority')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('Error connecting to MongoDB:', err));
  
// Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: String,
  description: String,
  calories: Number,
  carbs: Number,
  protein: Number,
  fats: Number,
});

const Recipe = mongoose.model('Recipe', recipeSchema);

// Route to save recipe
app.post('/save-recipe', async (req, res) => {
  try {
    const recipeData = req.body;

    // Create a new recipe document
    const newRecipe = new Recipe(recipeData);

    // Save the document to the database
    await newRecipe.save();

    res.status(201).json({ message: 'Recipe saved successfully!' });
  } catch (error) {
    console.error('Error saving recipe:', error);
    res.status(500).json({ error: 'Failed to save recipe' });
  }
});

const commentSchema = new mongoose.Schema({
  name: String,
  email: String,
  comment: String,
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

const Comment = mongoose.model('Comment', commentSchema);

// Route to save a comment
app.post('/api/comments', async (req, res) => {
  try {
    const commentData = req.body;

    // Create a new comment document
    const newComment = new Comment(commentData);

    // Save the document to the database
    await newComment.save();

    res.status(201).json({ message: 'Comment submitted successfully!' });
  } catch (error) {
    console.error('Error saving comment:', error);
    res.status(500).json({ error: 'Failed to save comment' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
