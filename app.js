import {
    ENTER_KEY_CODE
} from './modules/constants.js';
import {
    state
} from './modules/gamedata.js';
import {
    renderScreen,
    renderStartScreen,
    renderVictoryScreen,
    renderGameOverScreen
} from './modules/screenctrl.js';
import processInput from './modules/core.js';
import parseInput from './modules/parseinput.js';

const launchGame = () => {
    let gameState;

    // Реакция программы на ввод игрока
    const handleEnter = () => {
        // Реакция на нажатие клавиши ENTER игроком в зависимости от того, на каком экране он находится
        switch (gameState) {
            case "start":
                // Если он был на стартовом экране, то надо запустить игру
                state.resetGameState();
                gameState = "game";
                renderScreen("Ваше приключение начинается. Что будете делать?");
                break;
            case "game":
                // Если он был внутри игры
                const inputField = document.getElementById("input-field");

                // 1. Получаем введённую игроком команду и очищаем поле ввода
                const inputText = inputField.value;
                inputField.value = "";

                // 2. Отправляем команду в словоанализатор
                const words = parseInput(inputText);

                // 3. Выполняем действие игрока 
                const output = processInput(words);

                // 4. Отрисовываем экран
                switch (output.gameFlag) {
                    case "game":
                        renderScreen(output.answer);
                        break;
                    case "victory":
                        renderVictoryScreen();
                        gameState = "readyToStart";
                        break;
                    case "gameover":
                        renderGameOverScreen();
                        gameState = "readyToStart";
                        break;
                }
                break;
            case "readyToStart":
                // Если он был на экране победы или смерти
                gameState = "start";
                renderStartScreen();
                break;
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
                    handleEnter();
                }
            }
        });
    };

    console.log('Application has started.');

    // выводим стартовый экран
    gameState = "start";
    renderStartScreen();
    state.resetGameState();
    setupEventListeners();
}

launchGame();