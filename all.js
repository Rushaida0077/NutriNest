const wrapper= document.querySelector('.wrapper');
const signin= document.querySelector('.signin-link');
const signup= document.querySelector('.signup-link');
const signinPopup= document.querySelectorAll('.signin-popup');
const iconClose= document.querySelector('.icon-close');

signup.addEventListener('click',()=>
    {
        wrapper.classList.add('active');
    });
signin.addEventListener('click',()=>
        {
            wrapper.classList.remove('active');
        });
signinPopup.forEach(link => {
link.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});
});

iconClose.addEventListener('click',()=>{
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

function filterRecipes() {
  const checkboxes = document.querySelectorAll('.filter-checkbox');
  const recipes = document.querySelectorAll('.recipe-card');
  const ingredientSearch = document.getElementById('ingredient-search').value.toLowerCase();

  console.log('Filtering Recipes...');

  const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
  if (!anyCheckboxChecked && ingredientSearch === "") {
    recipes.forEach(recipe => {
      recipe.style.display = 'block';
    });
    return;
  }

  recipes.forEach(recipe => {
    let showRecipe = false;
    const recipeDiet = recipe.getAttribute('data-diet').toLowerCase();
    const recipeMealType = recipe.getAttribute('data-meal-type').toLowerCase();
    const recipeDescription = recipe.querySelector('p').textContent.toLowerCase();

    console.log(`Checking recipe: ${recipe.querySelector('h3').textContent}`);
    console.log(`Recipe Diet: ${recipeDiet}`);
    console.log(`Recipe Meal Type: ${recipeMealType}`);

    if (ingredientSearch && recipeDescription.includes(ingredientSearch)) {
      showRecipe = true;
    }

    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const filterType = checkbox.getAttribute('data-filter');
        const filterValue = checkbox.value.toLowerCase();

        console.log(`Filter applied: ${filterValue} for ${filterType}`);

        if (filterType === 'diet' && recipeDiet.includes(filterValue)) {
          showRecipe = true;
        }

        if (filterType === 'meal-type' && recipeMealType.includes(filterValue)) {
          showRecipe = true;
        }
      }
    });

    if (showRecipe) {
      console.log(`Showing recipe: ${recipe.querySelector('h3').textContent}`);
      recipe.style.display = 'block';
    } else {
      console.log(`Hiding recipe: ${recipe.querySelector('h3').textContent}`);
      recipe.style.display = 'none';
    }
  });
}

document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
  checkbox.addEventListener('change', filterRecipes);
});

document.getElementById('ingredient-search').addEventListener('input', filterRecipes);



document.querySelector('.search-btn').addEventListener('click', async function () {
  const query = document.querySelector('.search-input').value.trim();
  if (query) {
      try {
          const apiKey = 'b3ff25fc71df4c6eb47b4a28fb39b233'; // Use your actual API key here
          const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${encodeURIComponent(query)}&apiKey=${apiKey}`);
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
              updateRecipesGrid(data.results); // Use "results" instead of "hits" based on Spoonacular's API response structure
          } else {
              alert('No recipes found for your search.');
          }
      } catch (error) {
          console.error('Error fetching recipes:', error);
          alert('Something went wrong while fetching recipes.');
      }
  } else {
      alert('Please enter a search query.');
  }
});


function updateRecipesGrid(recipes) {
  const recipesGrid = document.querySelector('.recipes-grid');
  recipesGrid.innerHTML = ''; 

  recipes.forEach((recipeData) => {
      const recipe = recipeData;

      const recipeCard = document.createElement('div');
      recipeCard.classList.add('recipe-card');
      recipeCard.innerHTML = `
          <a href="https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, '-').toLowerCase()}-${recipe.id}" target="_blank">
              <img src="${recipe.image}" alt="${recipe.title}">
              <h3>${recipe.title}</h3>
              <p class="nutrition">Calories: ${Math.round(recipe.calories)}</p>
          </a>
      `;
      recipesGrid.appendChild(recipeCard);
  });
}
