import {
    ENTER_KEY_CODE
} from './modules/constants.js';
import {
    state
} from './modules/gamedata.js';
import {
    makeScreen,
    makeStartScreen,
    makeVictoryScreen,
    makeGameOverScreen
} from './modules/screenctrl.js';
import inputProcessing from './modules/core.js';
import parseInput from './modules/parseinput.js';

const game = () => {

    let gameState;

    const resetGameState = () => {
        state.resetGameState();
    }

    // Реакция программы на ввод игрока
    const gameLoop = () => {
        // Реакция на нажатие клавиши ENTER игроком в зависимости от того, на каком экране он находится

        if (gameState === "start") {

            // Если он был на стартовом экране, то надо запустить игру
            resetGameState();
            gameState = "game";
            makeScreen("Ваше приключение начинается. Что будете делать?");
        } else if (gameState === "game") {

            // Если он был внутри игры
            const inputField = document.getElementById("input-field");

            // 1. Получаем введённую игроком команду и очищаем поле ввода
            const inputText = inputField.value;
            inputField.value = "";

            // 2. Отправляем команду в словоанализатор
            const words = parseInput(inputText);
            
            // 3. Выполняем действие игрока 
            const output = inputProcessing(words);

            // 4. Отрисовываем экран
            if (output.gameFlag === "game") {
                makeScreen(output.answer);
            } else if (output.gameFlag === "victory") {
                makeVictoryScreen();
                gameState = "readyToStart";
            } else if (output.gameFlag === "gameover") {
                makeGameOverScreen();
                gameState = "readyToStart";
            }     
        } else if (gameState === "readyToStart") {

            // Если он был на экране победы или смерти
            gameState = "start";
            makeStartScreen();
        }
    };

    const setupEventListeners = () => {
        document.addEventListener('keypress', function (event) {
            let code;

            if (event.key !== undefined) {
                code = event.key;
            } else if (event.keyIdentifier !== undefined) {
                code = event.keyIdentifier;
            } else if (event.keyCode !== undefined) {
                code = event.keyCode;
            }

            if (code === "Enter" || code === ENTER_KEY_CODE) {
                {
                    gameLoop();
                }
            }
        });
    };

    console.log('Application has started.');

    // выводим стартовый экран
    gameState = "start";
    makeStartScreen();
    resetGameState();
    setupEventListeners();
}

game();