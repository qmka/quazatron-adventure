import { ENTER_KEY_CODE } from './modules/constants.js';
import {
    state
} from './modules/gamedata.js';
import * as screenCtrl from './modules/screenctrl.js';
import game from './modules/core.js';
import parseInput from './modules/parseinput.js';

// TODO: start and end screens
const controller = () => {

    // Реакция программы на ввод игрока
    const userInput = () => {

        const inputField = document.getElementById("input-field");

        // 1. Получаем введённую игроком команду и очищаем поле ввода
        const inputText = inputField.value;
        inputField.value = "";

        // 2. Отправляем команду в словоанализатор
        const words = parseInput(inputText);

        // 3. Выполняем действие игрока 
        /*
        const processed = outputCtrl(g, words);

        g = processed.gameData;
        const outputText = processed.answer; */
        const outputText = game(words);

        // 4. Обновляем экран
        screenCtrl.makeScreen(g, outputText);
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
                    userInput();
                }
            }
        });
    };

    let g = state;
    console.log('Application has started.');
    screenCtrl.makeScreen(g, 'Что будете делать?');
    setupEventListeners();
}

controller();