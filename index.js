const searchBox = document.querySelector('.searchBox');
const searchButton = document.querySelector('.searchButton');
const recipeContainer = document.querySelector('.recipe-container');
const recipeDetailsContent = document.querySelector('.recipe-details-content');
const recipeCloseButton = document.querySelector('.recipe-close-button');
const favoritesLink = document.querySelector('.favorites-link');

// Function to get recipes
const fetchRecipes = async (MealData) => {
    recipeContainer.innerHTML = "<h3>Fetching Recipes...</h3>";
    const recipeData = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${MealData}`);
    const result = await recipeData.json();

    recipeContainer.innerHTML = "";
    if (result.meals) {
        result.meals.forEach(meal => {
            const recipeDiv = document.createElement('div');
            recipeDiv.classList.add('recipe');

            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h4>${meal.strMeal}</h4>
                <p>${meal.strArea}</p>
                <p>${meal.strCategory}</p>
            `;

            const button = document.createElement('button');
            button.textContent = "View Recipe";
            recipeDiv.appendChild(button);

            // Adding event listener to recipe button
            button.addEventListener('click', () => {
                openRecipePopup(meal);
            });

            const favButton = document.createElement('button');
            favButton.textContent = isFavorite(meal) ? "Remove from Favorites" : "Add to Favorites";
            recipeDiv.appendChild(favButton);

            favButton.addEventListener('click', () => {
                toggleFavorite(meal);
                favButton.textContent = isFavorite(meal) ? "Remove from Favorites" : "Add to Favorites";
            });

            recipeContainer.appendChild(recipeDiv);
        });
    } else {
        recipeContainer.innerHTML = "<p>No recipes found</p>";
    }
}

// Function to fetch ingredients 
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

// Function to open recipe popup
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
        <button id="deleteFavorite">Delete from Favorites</button>
    `;

    document.getElementById('deleteFavorite').addEventListener('click', () => {
        removeFromFavorites(meal);
        document.querySelector('.recipe-details').style.display = 'none';
    });

    recipeDetailsContent.parentElement.style.display = 'block';
}

const isFavorite = (meal) => {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.some(fav => fav.idMeal === meal.idMeal);
}

const toggleFavorite = (meal) => {
    if (isFavorite(meal)) {
        removeFromFavorites(meal);
    } else {
        addToFavorites(meal);
    }
}

const addToFavorites = (meal) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites.push(meal);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Added to favorites');
    displayFavorites();
}

const removeFromFavorites = (meal) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(fav => fav.idMeal !== meal.idMeal);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    alert('Removed from favorites');
    displayFavorites();
}

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

            recipeDiv.innerHTML = `
                <img src="${meal.strMealThumb}">
                <h4>${meal.strMeal}</h4>
                <p>${meal.strArea}</p>
                <p>${meal.strCategory}</p>
                <button>Remove from Favorites</button>
            `;

            const removeButton = recipeDiv.querySelector('button');
            removeButton.addEventListener('click', () => {
                removeFromFavorites(meal);
            });

            favoriteContainer.appendChild(recipeDiv);
        });
    }
}

/* Adding event listener */
searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    fetchRecipes(searchInput);
});

recipeCloseButton.addEventListener('click', () => {
    recipeDetailsContent.parentElement.style.display = "none";
});

// Display favorites when the favorites link is clicked
favoritesLink.addEventListener('click', (e) => {
    e.preventDefault();
    displayFavorites();
});
