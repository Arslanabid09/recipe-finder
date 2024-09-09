let container = document.querySelector(".container");
let searchbox = document.querySelector('.search-box');
let body = document.querySelector(".inner");
let input = document.getElementById('input');
let btn = document.getElementById('btn');
let title = document.getElementById('recipe');
let img = document.getElementById('img');
let city = document.getElementById('city');
let ingredients1 = document.getElementById('ingredients1'); // First ingredients list
let ingredients2 = document.getElementById('ingredients2'); // Measures list
let instructions = document.getElementById('instructions'); // Element to display instructions
let btn2 = document.getElementById('btn2'); // Button to display instructions
let backButton = document.createElement('button'); // Create back button dynamically
let url = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;

let currentRecipe = null; // Variable to store current recipe details

// Style the back button (optional)
backButton.innerText = "Back to Recipe";
backButton.style.display = 'none'; // Initially hidden
backButton.classList.add('back-btn'); // Add custom class for styling

// Add backButton to the container (or anywhere in the DOM)
container.appendChild(backButton);

// Event listener for btn to search for a recipe
btn.addEventListener('click', async () => {
    let searchQuery = input.value.trim(); // Trim any extra whitespace
    body.style.display = 'none'; // Hide the result section initially
    instructions.style.display = 'none'; // Hide instructions initially
    backButton.style.display = 'none'; // Hide the back button initially
    input.style.display = 'block'; // Make sure input is visible initially

    if (!searchQuery) {
        input.value = "empty Search";
        setTimeout(() => {
            input.value = "";
        }, 1000);
        return; // Stop execution if the search query is empty
    }

    try {
        let response = await fetch(url + searchQuery);
        let result = await response.json();

        if (!result.meals) {
            // No meal found for the search term
            displayError("No recipe found");
            return;
        }

        // Store the current recipe details
        currentRecipe = result.meals[0];

        // Displaying meal data
        body.style.display = 'block';
        title.innerText = currentRecipe.strMeal;
        img.src = currentRecipe.strMealThumb;
        city.innerText = currentRecipe.strArea || "Unknown Area";

        // Clear existing ingredients
        ingredients1.innerHTML = "";
        ingredients2.innerHTML = "";

        // Displaying ingredients and measures
        for (let i = 1; i <= 10; i++) {
            let ingredient = currentRecipe[`strIngredient${i}`];
            let measure = currentRecipe[`strMeasure${i}`];

            if (ingredient && ingredient.trim()) {
                // Add ingredient to the list
                let ingredientItem = document.createElement('li');
                ingredientItem.innerText = ingredient;
                ingredients1.appendChild(ingredientItem);

                // Add corresponding measure to the list
                let measureItem = document.createElement('li');
                measureItem.innerText = measure || ""; // Handle cases where there might not be a measure
                ingredients2.appendChild(measureItem);
            }
        }

    } catch (error) {
        console.error("Error fetching data: ", error);
        displayError("Something went wrong. Please try again.");
    }
});

// Event listener for btn2 to show instructions and hide the recipe details
btn2.addEventListener('click', () => {
    if (currentRecipe) {
        // Hide meal details and search bar
        body.style.display = 'none';
        ingredients1.style.display = 'none';
        ingredients2.style.display = 'none';
        img.style.display = 'none';
        title.style.display = 'none';
        city.style.display = 'none';
        searchbox.style.display = 'none';

        // Show instructions and back button
        instructions.style.display = 'block';
        instructions.innerText = currentRecipe.strInstructions;
    
        backButton.style.display = 'block'; // Show back button
    }
});

// Event listener for backButton to return to recipe details
backButton.addEventListener('click', () => {
    if (currentRecipe) {
        // Show meal details
    window.location.reload()
        // Hide instructions and back button
        // instructions.style.display = 'none';
        // backButton.style.display = 'none';
    }
});

// Helper function to display error messages
function displayError(message) {
    let errorElement = document.createElement('p');
    errorElement.innerText = message;
    errorElement.classList.add("error");
    container.appendChild(errorElement);
    setTimeout(() => {
        errorElement.remove(); // Remove the error message after some time
    }, 3000);
}
