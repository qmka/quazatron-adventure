import {
    ENTER_KEY_CODE,
    GAME_STATES
} from './modules/constants.js';

import {
    log
} from './modules/utils.js';

import {
    initialFlags,
    initialItemPlaces,
    initialCounters,
    initialInventory,
    defaultLocation
} from './gamedata/initial-data.js';

import {
    defaultTexts
} from './gamedata/default-data.js';

import {
    renderGameScreen,
    renderNonGameScreen,
    getUserInput,
    setFocusOnInput
} from './modules/screen-ctrl.js';

import processInput from './modules/core.js';
import parseInput from './modules/parse-input.js';

import Inventory from './classes/inventory.js'
import CurrentLocation from './classes/location.js'
import Flags from './classes/flags.js'
import ItemPlaces from './classes/itemplaces.js'
import Counters from './classes/counters.js';

{
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
        $(document).on("keypress", function (event) {
            let code;
            setFocusOnInput();
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

    log('Application has started.');

    $(document).ready(function () {
        gameState = GAME_STATES.start;
        renderNonGameScreen(gameState);
        resetGameState();
        setFocusOnInput();
        setupEventListeners();
    });
}