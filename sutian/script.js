async function loadFlashcards() {

const response = await fetch('audioFiles.json');

const flashcards = await response.json();

return flashcards;

}

async function startFlashcard() {

const flashcards = await loadFlashcards();

setInterval(() => {

const randomIndex = Math.floor(Math.random() * flashcards.length);

const card = flashcards[randomIndex];

const displayWord = Math.random() < 0.5;

const displayText = displayWord ? card.word : card.roma;

document.getElementById('flashcard').textContent = displayText;

}, 1000);

}

startFlashcard();