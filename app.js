import {
    ENTER_KEY_CODE,
    GAME_STATES
} from './modules/constants.js';

import {
    initialFlags,
    initialItemPlaces,
    initialCounters,
    initialInventory,
    defaultLocation
} from './gamedata/initialdata.js';

import {
    defaultTexts
} from './gamedata/defaultmedia.js';

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
import Counters from './classes/counters.js';

const launchGame = () => {
    let gameState;

    // Сброс игрового состояния к первоначальным настройкам
    const resetGameState = () => {
        CurrentLocation.set(defaultLocation);
        Flags.init(initialFlags);
        ItemPlaces.init(initialItemPlaces);
        Counters.init(initialCounters);
        Inventory.init(initialInventory);
    }

    // Реакция программы на ввод игрока
    const handleEnter = () => {
        // Реакция на нажатие клавиши ENTER игроком в зависимости от того, на каком экране он находится
        switch (gameState) {
            case GAME_STATES.start:
                // Если он был на стартовом экране, то надо запустить игру
                resetGameState();
                gameState = GAME_STATES.game;
                renderGameScreen(defaultTexts.firstGameMessage);
                break;
            case GAME_STATES.game:
                // Если он был внутри игры
                // 1. Получаем введённую игроком команду и очищаем поле ввода
                const inputText = getUserInput();

                // 2. Отправляем команду в словоанализатор
                const words = parseInput(inputText);

                // 3. Выполняем действие игрока 
                const output = processInput(words);

                // 4. Отрисовываем экран
                switch (output.gameFlag) {
                    case GAME_STATES.game:
                        renderGameScreen(output.answer);
                        break;
                    default:
                        renderNonGameScreen(output.gameFlag);
                        gameState = GAME_STATES.readyToStart;
                        break;
                }
                break;
            case GAME_STATES.readyToStart:
                // Если он был на экране победы или смерти
                gameState = GAME_STATES.start;
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
    gameState = GAME_STATES.start;
    renderNonGameScreen(gameState);
    resetGameState();
    setupEventListeners();
}

launchGame();