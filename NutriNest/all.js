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
