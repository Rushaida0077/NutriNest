const wrapper = document.querySelector('.wrapper');
const signin = document.querySelector('.signin-link');
const signup = document.querySelector('.signup-link');
const signinPopup = document.querySelectorAll('.signin-popup');
const iconClose = document.querySelector('.icon-close');

// Toggle between Sign-In and Sign-Up Forms
signup.addEventListener('click', () => {
  wrapper.classList.add('active');
});

signin.addEventListener('click', () => {
  wrapper.classList.remove('active');
});

signinPopup.forEach((link) => {
  link.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
  });
});

iconClose.addEventListener('click', () => {
  wrapper.classList.remove('active-popup');
});

 
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const filterToggleBtn = document.getElementById('filter-toggle-btn');
const sidebar = document.getElementById('sidebar');

filterToggleBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Unified Search and Filter Function
async function unifiedSearchAndFilter() {
  const ingredientSearch = document.getElementById('ingredient-search').value.trim().toLowerCase();
  const selectedDiets = Array.from(document.querySelectorAll('input[data-filter="diet"]:checked')).map(cb => cb.value);
  const selectedMealTypes = Array.from(document.querySelectorAll('input[data-filter="meal-type"]:checked')).map(cb => cb.value);
  const recipes = document.querySelectorAll('.recipe-card');

  console.log('Filtering and Searching Recipes...');

  // Local Filtering
  if (!selectedDiets.length && !selectedMealTypes.length && ingredientSearch === "") {
    recipes.forEach(recipe => {
      recipe.style.display = 'block'; // Show all recipes if no filters are applied
    });
    return;
  }

  recipes.forEach(recipe => {
    let showRecipe = false;

    // Get attributes for filtering
    const recipeDiet = recipe.getAttribute('data-diet')?.toLowerCase() || '';
    const recipeMealType = recipe.getAttribute('data-meal-type')?.toLowerCase() || '';
    const recipeDescription = recipe.querySelector('p')?.textContent.toLowerCase() || '';

    console.log(`Checking recipe: ${recipe.querySelector('h3').textContent}`);

    // Check Ingredient Search
    if (ingredientSearch && recipeDescription.includes(ingredientSearch)) {
      showRecipe = true;
    }

    // Check Diet and Meal Type Filters
    if (selectedDiets.some(diet => recipeDiet.includes(diet.toLowerCase()))) {
      showRecipe = true;
    }

    if (selectedMealTypes.some(mealType => recipeMealType.includes(mealType.toLowerCase()))) {
      showRecipe = true;
    }

    // Show or Hide Recipe
    recipe.style.display = showRecipe ? 'block' : 'none';
  });

  // API Call for External Search
  const query = document.querySelector('.search-input').value.trim();
  if (query || ingredientSearch || selectedDiets.length || selectedMealTypes.length) {
    try {
      const apiKey = 'b3ff25fc71df4c6eb47b4a28fb39b233'; // Replace with your actual API key
      const url = new URL('https://api.spoonacular.com/recipes/complexSearch');
      const params = {
        query: query,
        addRecipeNutrition: true,
        apiKey: apiKey,
        diet: selectedDiets.join(','),
        type: selectedMealTypes.join(','),
        includeIngredients: ingredientSearch,
      };

      // Append query parameters to URL
      Object.keys(params).forEach(key => {
        if (params[key]) {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString());
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        updateRecipesGrid(data.results);
      } else {
        alert('No recipes found for your search and filters.');
      }
    } catch (error) {
      console.error('Error fetching recipes:', error);
      alert('Unable to fetch recipes. Please try again later.');
    }
  } else {
    console.log('Local filtering only, no API call required.');
  }
}

// Function to Update the Recipe Grid (Replace this with your UI update logic)
function updateRecipesGrid(recipes) {
  const recipeContainer = document.querySelector('.recipes-container');
  recipeContainer.innerHTML = ''; // Clear existing recipes

  recipes.forEach(recipe => {
    const recipeCard = document.createElement('div');
    recipeCard.classList.add('recipe-card');
    recipeCard.setAttribute('data-diet', recipe.diets.join(','));
    recipeCard.setAttribute('data-meal-type', recipe.dishTypes.join(','));

    recipeCard.innerHTML = `
      <h3>${recipe.title}</h3>
      <img src="${recipe.image}" alt="${recipe.title}">
      <p>${recipe.summary || 'No description available.'}</p>
    `;

    recipeContainer.appendChild(recipeCard);
  });
}

// Attach Event Listeners
document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
  checkbox.addEventListener('change', unifiedSearchAndFilter);
});

document.getElementById('ingredient-search').addEventListener('input', unifiedSearchAndFilter);
document.querySelector('.search-input').addEventListener('input', unifiedSearchAndFilter);


document.querySelector('.search-btn').addEventListener('click', handleSearch);

// Add event listener to trigger search on "Enter" key press
document.querySelector('.search-input').addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        handleSearch();
    }
});

async function handleSearch() {
  const query = document.querySelector('.search-input').value.trim();
  if (query) {
      try {
          const apiKey = 'b3ff25fc71df4c6eb47b4a28fb39b233'; // Replace with your actual API key
          const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&addRecipeNutrition=true&apiKey=${apiKey}`);
          
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.results && data.results.length > 0) {
              updateRecipesGrid(data.results);
          } else {
              alert('No recipes found for your search.');
          }
      } catch (error) {
          console.error('Error fetching recipes:', error);
          alert('Unable to fetch recipes. Please try again later.');
      }
  } else {
      alert('Please enter a search query.');
  }
}

// Function to update the recipes grid with search results
function updateRecipesGrid(recipes) {
  const recipesGrid = document.querySelector('.recipes-grid');
  recipesGrid.innerHTML = ''; // Clear existing recipes

  recipes.forEach((recipe) => {
      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');

      // Truncate the summary to 2-3 sentences
      const summary = recipe.summary
          ? recipe.summary.replace(/<[^>]+>/g, '').split('. ').slice(0, 2).join('. ') + '.'
          : 'No description available.';

      // Extract nutritional information
      const calories = recipe.nutrition?.nutrients?.find(n => n.name === 'Calories')?.amount || 'N/A';
      const protein = recipe.nutrition?.nutrients?.find(n => n.name === 'Protein')?.amount || 'N/A';
      const fat = recipe.nutrition?.nutrients?.find(n => n.name === 'Fat')?.amount || 'N/A';
      const carbs = recipe.nutrition?.nutrients?.find(n => n.name === 'Carbohydrates')?.amount || 'N/A';

      recipeCard.innerHTML = `
      
      <button class="save"> <span class="icon"> <ion-icon name="bookmark"></ion-icon></span> </button>
      <img src="${recipe.image}" alt="${recipe.title}">
      <h3>${recipe.title}</h3>
      <p>${summary}</p>
      <p class="nutrition">
          Calories: ${calories} | Protein: ${protein} g | Fat: ${fat} g | Carbs: ${carbs} g
      </p>
      <button class="view-recipe-btn" data-recipe-id="${recipe.id}" data-title="${recipe.title.replace(/\s+/g, '-')}">View Recipe</button>
    `;
    recipesGrid.appendChild(recipeCard);
  });

  
}

// Function to fetch recipe details and dynamically update the page
async function fetchAndShowRecipeDetails(recipeId) {
  console.log(recipeId);
  const apiKey = 'b3ff25fc71df4c6eb47b4a28fb39b233'; // Replace with your actual API key

  try {
    // Fetch recipe details from the API
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
    );

    if (!response.ok) {
      const rawText = await response.text();
      console.error('Error response:', rawText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const recipe = await response.json();

    // Open Overnight Oats.html and replace its content
    const newWindow = window.open('Overnight Oats.html', '_blank');
    newWindow.onload = function () {
      const mainSection = newWindow.document.querySelector('.main'); // Main section to update

      // Dynamically update the page content
      mainSection.innerHTML = `
        <div class="recipe-container">
          <div class="content">
            <h1 class="title">${recipe.title}</h1>
            <p class="description">${recipe.summary?.replace(/<[^>]+>/g, '') || 'No description available.'}</p>
            <ul class="time-info">
              <li><span class="icon">🕒</span> Ready in: ${recipe.readyInMinutes} minutes</li>
              <li><span class="icon">🍴</span> Servings: ${recipe.servings}</li>
            </ul>
          </div>
          <div class="image-section">
            <div class="image-container">
              <img src="${recipe.image}" alt="${recipe.title}">
            </div>
          </div>
        </div>

        <div class="recipe-overview">
          <h2 class="section-title">Recipe at a glance</h2>
          <ul class="overview-list">
            <li><strong>Cuisine Inspiration:</strong> ${recipe.cuisines?.join(', ') || 'N/A'}</li>
            <li><strong>Cooking Method:</strong> ${recipe.dishTypes?.join(', ') || 'N/A'}</li>
            <li><strong>Dietary Information:</strong> ${recipe.diets?.join(', ') || 'N/A'}</li>
            <li><strong>Skill Level:</strong> Easy</li>
          </ul>
        </div>

        <div class="ingredients">
          <h2 class="section-title">Base Ingredients You Need</h2>
          <ul class="ingredients-list">
            ${recipe.extendedIngredients
              .map((ingredient) => `<li>${ingredient.original}</li>`)
              .join('') || '<li>No ingredients available.</li>'}
          </ul>
        </div>

        <div class="base-recipe">
          <h2 class="section-title">Steps to Prepare</h2>
          <ol class="instruction-steps">
            ${
              recipe.analyzedInstructions[0]?.steps
                .map((step) => `<li>${step.step}</li>`)
                .join('') || '<li>Instructions not available.</li>'
            }
          </ol>
        </div>
        <div class="feedback-form">
        <h3 class="section-title">Rate and Comment</h3>
        <hr class="divider">
        <form>
            <input type="text" id="name" name="name" placeholder="Your Name (Required)" required>
            <input type="email" id="email" name="email" placeholder="Your Email (Required)" required>
            <textarea id="comment" name="comment" placeholder="Your Comment (Required)" rows="4" required></textarea>
            <button type="submit" class="submit1">Submit</button>
        </form>
        </div>

      
      `;
    };
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    alert('Failed to load recipe details. Please try again later.');
  }
}

// Event listener for "View Recipe" button clicks
document.querySelector('.recipes-grid').addEventListener('click', function (event) {
  if (event.target && event.target.classList.contains('view-recipe-btn')) {
    const recipeId = event.target.dataset.recipeId; // Get recipe ID from data attribute
    const title = event.target.dataset.title; // Get recipe title from data attribute
    // Redirect to overnight-oats.html with query parameters
    fetchAndShowRecipeDetails(recipeId);
  }
});


document.querySelectorAll('.save').forEach(button => {
  button.addEventListener('click', function (e) {
    e.preventDefault();

    // Get the parent recipe card
    const recipeCard = this.closest('.recipe-card');

    // Extract dynamic data
    const title = recipeCard.querySelector('h3').textContent;
    const description = recipeCard.querySelector('p:not(.nutrition)').textContent;
    const nutritionText = recipeCard.querySelector('.nutrition').textContent;

    // Parse nutrition data
    const nutrition = {};
    const matches = nutritionText.match(/(\w+):\s*(\d+)/g);
    if (matches) {
      matches.forEach(match => {
        const [key, value] = match.split(':').map(s => s.trim());
        nutrition[key.toLowerCase()] = Number(value);
      });
    }

    // Prepare recipe data
    const recipeData = {
      title,
      description,
      ...nutrition,
    };

    // Send data to backend
    fetch('http://localhost:5000/save-recipe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
    })
      .then(response => response.json())
      .then(data => {
        if (data.message) {
          alert(data.message); // Success alert
        }
      })
      .catch(error => {
        console.error('Error:', error);
        alert('Failed to save recipe.');
      });
  });
});

document.querySelectorAll('.submit').forEach(button => {
  button.addEventListener('click', async function (e) {
    e.preventDefault();

  // Collect form data
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const comment = document.getElementById('comment').value.trim();

  // Validate input
  if (!name || !email || !comment) {
    alert('All fields are required.');
    return;
  }

  try {
    // Send data to the backend
    const response = await fetch('http://localhost:5000/api/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, comment }),
    });

    const data = await response.json();

    if (response.ok) {
      alert('Comment submitted successfully!');
      // Optionally clear the form
      document.getElementById('name').value = '';
      document.getElementById('email').value = '';
      document.getElementById('comment').value = '';
    } else {
      throw new Error(data.error || 'Failed to submit comment');
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
    alert('An error occurred. Please try again.');
  }
});
}
);

