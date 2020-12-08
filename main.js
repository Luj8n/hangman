// JQUERY-------------------------------------------------------------------------------------

$('body').mousemove(function (e) {
    var moveX = (e.pageX * -1 / 50);
    var moveY = (e.pageY * -1 / 50);
    $(this).css('background-position', moveX + 'px ' + moveY + 'px');
})



// VARIABLES----------------------------------------------------------------------------------



let answer;
let lives;
let points;
let currentGame;
let selectedLives;
let leftLives;
let isGameWon;
let selectedWord;

const inputContainer = document.querySelector('.input-container');
const gameContainer = document.querySelector('.game-container');
const inputAnswer = inputContainer.querySelector('.js-answer');
const letters = document.querySelectorAll('.js-letter');
const answerContainer = document.querySelector('.js-ans-container');
const answerObjects = [];
const firstLetterOpt = document.querySelector('#first-letter-opt');
const lastLetterOpt = document.querySelector('#last-letter-opt');
const up = document.querySelector('.up');
const down = document.querySelector('.down');
const livesNumber = document.querySelector('.lives');
const body = document.querySelector('body');
const activeLives = document.querySelector('.active-lives');
const gameOver = document.querySelector('.game-over');
const gameEndText = document.querySelector('.game-end-text');
const resetButton = document.querySelector('.reset-button');




// FUNCTIONS----------------------------------------------------------------------------------



function startGame(e) {
    if (e.keyCode == 13) {
        answer = inputAnswer.value;
        selectedWord = inputAnswer.value;


        if (answer !== "" && /^[a-zA-Z]+$/.test(answer)) {
            inputContainer.classList.add('hidden', 'transform-to-small');
            gameContainer.classList.remove('transform-to-bigger');
            gameContainer.classList.remove('transform-to-big');
            setTimeout(() => {
                gameContainer.classList.remove('d-none');
                inputContainer.classList.add('d-none');
                setTimeout(() => {
                    formAnswerLetters();
                    lives = parseInt(livesNumber.innerHTML, 10);
                    selectedLives = lives;
                    displaylives();
                    if (firstLetterOpt.checked == true) {
                        revealFirstLetter();
                    }
                    if (lastLetterOpt.checked == true) {
                        revealLastLetter();
                    }
                    gameContainer.classList.remove('hidden');
                    gameContainer.classList.add('transform-to-big');
                }, 50);
            }, 600);
        } else {
            alert('No cheating!');
        }

    }
}

function formAnswerLetters() {
    for (let i = 0; i < answer.length; i++) {
        let letterContainer = document.createElement('span');
        letterContainer.className = 'js-letter-ans';
        answerContainer.appendChild(letterContainer);
        answerObjects.push({
            letter: answer.charAt(i).toLowerCase(),
            visible: false,
            element: letterContainer
        });
    }
}

function revealFirstLetter() {
    let letter = answerObjects[0].letter;
    let letterButton;
    letters.forEach((letterBtn) => {
        if (letterBtn.innerHTML.toUpperCase() == letter.toUpperCase()) {
            letterButton = letterBtn;
        }
    });
    guessLetter({
        target: letterButton
    });
}

function revealLastLetter() {
    let letter = answerObjects.slice(-1)[0].letter;
    let letterButton;
    letters.forEach((letterBtn) => {
        if (letterBtn.innerHTML.toUpperCase() == letter.toUpperCase()) {
            letterButton = letterBtn;
        }
    });
    guessLetter({
        target: letterButton
    });
}

function guessLetter(e) {
    let element = e.target;
    let letter = e.target.innerHTML;
    let correctLetters = answerObjects.filter((letterObj) => letterObj.letter == letter);
    correctLetters.forEach((answerObj) => {
        answerObj.element.innerHTML = letter;
        answerObj.visible = true;
    });
    if (correctLetters.length > 0) {
        element.classList.add('bg-green');
    } else {
        element.classList.add('bg-red');
        lives = lives - 1;
        displaylives();
        shake();
    }
    element.classList.remove('available');
    element.removeEventListener('click', guessLetter);

    if (answerObjects.filter((el) => !el.visible).length == 0) {
        gameWon();
        finalizeGame();
    }
    if (lives == 0) {
        gameLost();
        finalizeGame();
    }
}

function displaylives() {
    activeLives.innerHTML = "Lives: " + lives;
}

function shake() {
    gameContainer.classList.add('shake', 'shake-constant');
    setTimeout(() => {
        gameContainer.classList.remove('shake', 'shake-constant');
    }, 200);
}

function gameWon() {
    gameEndText.innerHTML = 'Game Won!';
    // is game won?
    isGameWon = true;
}

function gameLost() {
    gameEndText.innerHTML = 'Game Lost...';
    // is game won?
    isGameWon = false;
}

function finalizeGame() {
    // count which game it is
    if (Number(localStorage.getItem('Current game:'))) {
        currentGame = Number(localStorage.getItem('Current game:')) + 1;
    } else {
        currentGame = 1;
    }

    // count the points
    leftLives = lives;
    // points: from 0 to 10 (10 is the best)
    points = leftLives / selectedLives * 10;

    // save data to localStorage

    localStorage.setItem(`${currentGame}th game's points`, points);
    localStorage.setItem(`Was game no. ${currentGame} won?`, isGameWon);
    localStorage.setItem(`Current game:`, currentGame);
    localStorage.setItem(`${currentGame}th game's word`, selectedWord);
    console.log(localStorage);

    // clear the answerContainer
    let children = answerContainer.children;

    for (let i = 0; i < answerObjects.length; i++) {
        children[i].innerHTML = answerObjects[i].letter;
    }
    letters.forEach((letter) => {
        letter.classList.remove('available');
        letter.removeEventListener('click', guessLetter);
    });

    //animation from gameContainer -> gameOver
    setTimeout(() => {
        gameContainer.classList.add('hidden', 'transform-to-bigger');
        setTimeout(() => {
            gameOver.classList.remove('d-none');
            gameContainer.classList.add('d-none');
            setTimeout(() => {
                gameOver.classList.remove('hidden');
                gameOver.classList.remove('transform-to-small');
                gameOver.classList.add('transform-to-big');
                inputContainer.classList.add('transform-to-small');
            }, 50);
        }, 600);
    }, 2000);

}


function resetGame() {
    // reset variables, innerHTML and values
    inputAnswer.value = "";
    livesNumber.innerHTML = "10";
    letters.forEach((letter) => {
        letter.classList.add('available');
        letter.classList.remove('bg-green');
        letter.classList.remove('bg-red');
        letter.addEventListener('click', guessLetter);
    });
    answer = null;
    points = null;
    lives = null;
    selectedLives = null;
    leftLives = null;
    isGameWon = null;
    selectedWord = null;
    answerContainer.innerHTML = "";
    answerObjects.length = 0;
    firstLetterOpt.checked = false;
    lastLetterOpt.checked = false;

    // reset objects and go back to inputContainer
    gameOver.classList.remove('transform-to-big');
    setTimeout(() => {
        gameOver.classList.add('hidden', 'transform-to-small');
        setTimeout(() => {
            inputContainer.classList.remove('d-none');
            gameOver.classList.add('d-none');
            setTimeout(() => {
                inputContainer.classList.remove('hidden');
                inputContainer.classList.add('transform-to-big');
            }, 50);
        }, 600);

    }, 50);


}


// OTHER-------------------------------------------------------------------------------------



letters.forEach((letter) => {
    letter.classList.add('available');
    letter.addEventListener('click', guessLetter);
});




// EVENT LISTENERS---------------------------------------------------------------------------



up.addEventListener('click', () => {
    livesNumber.innerHTML = parseInt(livesNumber.innerHTML, 10) + 1;
});

down.addEventListener('click', () => {
    if (parseInt(livesNumber.innerHTML, 10) > 1) {
        livesNumber.innerHTML = parseInt(livesNumber.innerHTML, 10) - 1;
    }
});

inputContainer.addEventListener('keyup', startGame);

resetButton.addEventListener('click', resetGame);