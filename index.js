// Select all DOM elements 
const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseButton = document.querySelector('.recipe-close-button');
const favoritesLink = document.querySelector('.favorites-link');

// Function to fetch recipes based on search input
const fetchRecipes = async (MealData) => {
    // Display loading message
    recipeContainer.innerHTML = "<h3>Fetching Recipes...</h3>";
    try {
        // Fetch recipes from TheMealDB API
        const recipeData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${MealData}`);
        const result = await recipeData.json();

        // Clear the container
        recipeContainer.innerHTML = "";
        if (result.meals) {
            // Loop through the meals and create recipe elements
            result.meals.forEach(meal => {
                const recipeDiv = document.createElement('div');
                recipeDiv.classList.add('recipe');

                // Populate the recipe div with meal data
                recipeDiv.innerHTML = `
                    <img src="${meal.strMealThumb}">
                    <h4>${meal.strMeal}</h4>
                    <p>${meal.strArea}</p>
                    <p>${meal.strCategory}</p>
                `;

                // Create and add 'View Recipe' button
                const button = document.createElement('button');
                button.textContent = "View Recipe";
                recipeDiv.appendChild(button);

                // Event listener for 'View Recipe' button
                button.addEventListener('click', () => {
                    openRecipePopup(meal);
                });

                // Create and add 'Favorite' button
                const favButton = document.createElement('button');
                favButton.textContent = isFavorite(meal) ? "Remove from Favorites" : "Add to Favorites";
                recipeDiv.appendChild(favButton);

                // Event listener for 'Favorite' button
                favButton.addEventListener('click', () => {
                    toggleFavorite(meal, favButton);
                });

                // Append the recipe div to the container
                recipeContainer.appendChild(recipeDiv);
            });
        } else {
            // Display message if no recipes are found
            recipeContainer.innerHTML = "<p>No recipes found</p>";
        }
    } catch (error) {
        // Handle errors
        recipeContainer.innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
        console.error("Error fetching recipes:", error);
    }
}

// Function to fetch and format ingredients list
const fetchIngredients = (meal) => {
    let ingredientsList = "";
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        if (ingredient) {
            const measure = meal[`strMeasure${i}`];
            ingredientsList += `<li>${measure} ${ingredient}</li>`;
        } else {
            break;
        }
    }
    return ingredientsList;
}

// Function to open the recipe popup with meal details
const openRecipePopup = (meal) => {
    recipeDetailsContent.innerHTML = `
        <h2 class="recipeName">${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul class="ingredients list">${fetchIngredients(meal)}</ul>
        <div>
            <h3>Instructions:</h3>
            <p class="recipeInstructions">${meal.strInstructions}</p>                         
        </div>
        ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank">Watch Recipe Video</a>` : ''}
    `;

    // Display the recipe details popup
    recipeDetailsContent.parentElement.style.display = 'block';
}

    // Display the recipe details popup
    recipeDetailsContent.parentElement.style.display = 'block';


// Function to check if a meal is in favorites
const isFavorite = (meal) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.idMeal === meal.idMeal);
}

// Function to toggle favorite status of a meal
const toggleFavorite = (meal, button) => {
    if (isFavorite(meal)) {
        removeFromFavorites(meal);
        button.textContent = "Add to Favorites";
    } else {
        addToFavorites(meal);
        button.textContent = "Remove from Favorites";
    }
}

// Function to add a meal to favorites
const addToFavorites = (meal) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(meal);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Added to favorites');
    displayFavorites();
}

// Function to remove a meal from favorites
const removeFromFavorites = (meal) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.idMeal !== meal.idMeal);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Removed from favorites');
    displayFavorites();
}

// Function to display favorite recipes
const displayFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favoriteContainer = document.querySelector('.favorite-container');
    favoriteContainer.innerHTML = "<h2>Favorites</h2>";

    if (favorites.length === 0) {
        favoriteContainer.innerHTML += "<p>No favorite recipes found</p>";
    } else {
        favorites.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            // Populate the recipe div with meal data
            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h4>${meal.strMeal}</h4>
                <p>${meal.strArea}</p>
                <p>${meal.strCategory}</p>
                <button>Remove from Favorites</button>
            `;

            // Event listener for 'Remove from Favorites' button
            const removeButton = recipeDiv.querySelector('button');
            removeButton.addEventListener('click', () => {
                removeFromFavorites(meal);
            });

            // Append the recipe div to the favorites container
            favoriteContainer.appendChild(recipeDiv);
        });
    }
}

// Event listener for search button
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});

// Event listener for recipe close button
recipeCloseButton.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Event listener for favorites link to display favorites
favoritesLink.addEventListener('click', (e) => {
    e.preventDefault();
    displayFavorites();
});
