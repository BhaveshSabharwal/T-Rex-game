const character = document.getElementById("dino-img");
const obstacle = document.getElementById("obstacle-img");

let score = 0;
let isJumping = false;
let gameOver = false;
let hasShield = false;
let shieldTimer = null;

// Define images for the character states
const characterImages = {
    running: "./images/C1.gif",
    jumping: "./images/C2.gif",
    hit: "./images/C3.gif",
    shield: "./images/CSonamB.gif"
};

// List of obstacle images
const obstacleImages = [
    "./images/O1.png", "./images/O2.png", "./images/O3.png", "./images/O4.png", "./images/O5.png",
    "./images/O6.png", "./images/O7.png", "./images/O8.png", "./images/O9.png", "./images/O10.png",
    "./images/O11.png"
];

// Function to update the character's image
function updateCharacterImage(state) {
    character.src = characterImages[state];
}

// Function to update the obstacle image
function randomObstacle() {
    const randomIndex = Math.floor(Math.random() * obstacleImages.length);
    obstacle.src = obstacleImages[randomIndex];
    return randomIndex;
}

// Function to handle collision effects
function handleCollision(obstacleIndex) {
    if (obstacleIndex >= 2 && obstacleIndex <= 4) {
        // Game over obstacles
        if (!hasShield) {
            updateCharacterImage("hit");
            alert(`Game Over! Your score: ${score}`);
            gameOver = true;
        }
    } else if (obstacleIndex >= 5 && obstacleIndex <= 9) {
        // Bonus obstacles
        const bonusPoints = [100, 150, 200, 250];
        score += bonusPoints[obstacleIndex - 5]; // Adjust based on index
    } else if (obstacleIndex === 10) {
        // Shield obstacle
        activateShield();
    }
}
// Function to activate shield
function activateShield() {
    hasShield = true;
    updateCharacterImage("shield");

    shieldTimer = setTimeout(() => {
        hasShield = false;
        updateCharacterImage("running");
    }, 4000); // Shield lasts 4 seconds
}

// Dino jump functionality using translateY for smooth jump effect
function jump() {
    if (isJumping || gameOver) return; // Prevent double jumps or jumps after game over
    isJumping = true;
    updateCharacterImage("jumping");

    // Apply CSS transformation to simulate the jump
    character.style.transition = "transform 0.5s ease"; // Smooth jump
    character.style.transform = "translateY(-220px)"; // Move up by 260px

    // After the jump, reset the character back to the ground
    setTimeout(() => {
        character.style.transform = "translateY(0);"; // Return to original position
        character.style.transition = "transform 0.5s ease"; // Smooth landing
        isJumping = false;
        updateCharacterImage("running"); // Return to running state
    }, 500); // Jump lasts for 0.5 seconds
}

// Move the obstacle and check for collisions
function moveObstacle() {
    let obstaclePosition = 90; // Start off-screen to the right
    obstacle.style.right = `${obstaclePosition}vw`;

    const moveInterval = setInterval(() => {
        if (obstaclePosition <= -10) { // Once it moves off-screen to the left
            clearInterval(moveInterval);
            if (!gameOver) {
                startGame();   // Start the next obstacle
            }
        } else {
            obstaclePosition -= 1.5; // Adjust speed here
            obstacle.style.right = `${obstaclePosition}vw`;
        }

        // Check for collisions
        const dinoBottom = parseInt(window.getComputedStyle(character).getPropertyValue("bottom"));
        if (obstaclePosition < 15 && obstaclePosition > 0 && dinoBottom <= 180) {
            const obstacleIndex = randomObstacle(); // Get the current obstacle index
            handleCollision(obstacleIndex); // Check what happens based on the obstacle
        }

    }, 20);
}

// Start the game loop
function startGame() {
    const obstacleIndex = randomObstacle(); // Choose a random obstacle
    moveObstacle();   // Move the selected obstacle

    // Score increase over time
    const scoreLoop = setInterval(() => {
        if (!gameOver) {
            score++;
            updateScore(); // Update the score display
        } else {
            clearInterval(scoreLoop);
        }
    }, 1000); // Score increases every second
}

// Function to update the score display
function updateScore() {
    document.getElementById("score").innerText = `Score: ${score}`;
}

// Listen for the spacebar key to jump
document.addEventListener("keydown", function (event) {
    if (event.code === "Space") {
        jump();
    }
});

// Change the obstacle image when the animation iterates
obstacle.addEventListener("animationiteration", function () {
    const randomIndex = Math.floor(Math.random() * obstacleImages.length);
    obstacle.src = obstacleImages[randomIndex];
});

// Start the game when the page loads
startGame();
