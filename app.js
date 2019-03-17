import {
    ENTER_KEY_CODE
} from './modules/constants.js';
import {
    defaultTexts, initialFlags, initialItemPlaces
} from './modules/gamedata.js';
import {
    renderGameScreen,
    renderNonGameScreen,
    getUserInput
} from './modules/screenctrl.js';
import processInput from './modules/core.js';
import parseInput from './modules/parseinput.js';

import Inventory from './classes/inventory.js'
import CurrentLocation from './classes/location.js'
import Flags from './classes/flags.js'
import ItemPlaces from './classes/itemplaces.js'

const launchGame = () => {
    let gameState;

    // Сброс игрового состояния к первоначальным настройкам
    const resetGameState = () => {
        CurrentLocation.set(0);
        Flags.init(initialFlags);
        ItemPlaces.init(initialItemPlaces);
        Inventory.clear();
    }

    // Реакция программы на ввод игрока
    const handleEnter = () => {
        // Реакция на нажатие клавиши ENTER игроком в зависимости от того, на каком экране он находится
        switch (gameState) {
            case "start":
                // Если он был на стартовом экране, то надо запустить игру
                resetGameState();
                gameState = "game";
                renderGameScreen(defaultTexts.firstGameMessage);
                break;
            case "game":
                // Если он был внутри игры
                // 1. Получаем введённую игроком команду и очищаем поле ввода
                const inputText = getUserInput();

                // 2. Отправляем команду в словоанализатор
                const words = parseInput(inputText);

                // 3. Выполняем действие игрока 
                const output = processInput(words);

                // 4. Отрисовываем экран
                switch (output.gameFlag) {
                    case "game":
                        renderGameScreen(output.answer);
                        break;
                    default:
                        renderNonGameScreen(output.gameFlag);
                        gameState = "readyToStart";
                        break;
                }
                break;
            case "readyToStart":
                // Если он был на экране победы или смерти
                gameState = "start";
                renderNonGameScreen(gameState);
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
                    handleEnter();
            }
        });
    };

    console.log('Application has started.');

    // выводим стартовый экран
    gameState = "start";
    renderNonGameScreen(gameState);
    resetGameState();
    setupEventListeners();
}

launchGame();