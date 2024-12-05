// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Function to filter recipes based on selected filters
function filterRecipes() {
    const checkboxes = document.querySelectorAll('.filter-checkbox'); // Get all checkboxes
    const recipes = document.querySelectorAll('.recipe-card'); // Get all recipe cards
    const ingredientSearch = document.getElementById('ingredient-search').value.toLowerCase(); // Get ingredient search input

    console.log('Filtering Recipes...');

    // If no checkboxes are checked, show all recipes
    const anyCheckboxChecked = Array.from(checkboxes).some(checkbox => checkbox.checked);
    if (!anyCheckboxChecked && ingredientSearch === "") {
        // Show all recipes if no filters are selected and no ingredient search term is entered
        recipes.forEach(recipe => {
            recipe.style.display = 'block';
        });
        return; // Exit early, no need to filter further
    }

    // Loop through each recipe and show/hide based on selected filters and ingredient search
    recipes.forEach(recipe => {
        let showRecipe = false; // Start with the assumption that the recipe will not be shown
        const recipeDiet = recipe.getAttribute('data-diet').toLowerCase(); // Get data-diet attribute
        const recipeMealType = recipe.getAttribute('data-meal-type').toLowerCase(); // Get data-meal-type attribute
        const recipeDescription = recipe.querySelector('p').textContent.toLowerCase(); // Get recipe description (you can adjust this depending on your HTML structure)

        console.log(`Checking recipe: ${recipe.querySelector('h3').textContent}`);
        console.log(`Recipe Diet: ${recipeDiet}`);
        console.log(`Recipe Meal Type: ${recipeMealType}`);

        // Check if the ingredient search term matches the recipe description
        if (ingredientSearch && recipeDescription.includes(ingredientSearch)) {
            showRecipe = true; // Match found for ingredient search
        }

        // Check if at least one filter matches
        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const filterType = checkbox.getAttribute('data-filter'); // Get filter type (e.g., 'diet' or 'meal-type')
                const filterValue = checkbox.value.toLowerCase(); // Get filter value (e.g., 'vegan', 'breakfast')

                console.log(`Filter applied: ${filterValue} for ${filterType}`);

                if (filterType === 'diet' && recipeDiet.includes(filterValue)) {
                    showRecipe = true; // Match found for diet
                }

                if (filterType === 'meal-type' && recipeMealType.includes(filterValue)) {
                    showRecipe = true; // Match found for meal type
                }
            }
        });

        // Show or hide the recipe based on filtering criteria
        if (showRecipe) {
            console.log(`Showing recipe: ${recipe.querySelector('h3').textContent}`);
            recipe.style.display = 'block'; // Show recipe
        } else {
            console.log(`Hiding recipe: ${recipe.querySelector('h3').textContent}`);
            recipe.style.display = 'none'; // Hide recipe
        }
    });
}

// Event listener for filter changes
document.querySelectorAll('.filter-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', filterRecipes); // Call filterRecipes on filter change
});

// Event listener for ingredient search input
document.getElementById('ingredient-search').addEventListener('input', filterRecipes); // Call filterRecipes on input change

