import {
    ENTER_KEY_CODE
} from './modules/constants.js';
import * as screenCtrl from './modules/screenctrl.js';
import inputProcessing from './modules/core.js';
import parseInput from './modules/parseinput.js';

// TODO: start and end screens
const game = () => {

    // Реакция программы на ввод игрока
    const gameLoop = () => {

        const inputField = document.getElementById("input-field");

        // 1. Получаем введённую игроком команду и очищаем поле ввода
        const inputText = inputField.value;
        inputField.value = "";

        // 2. Отправляем команду в словоанализатор
        const words = parseInput(inputText);

        // 3. Выполняем действие игрока 
        const outputText = inputProcessing(words);

        // 4. Обновляем экран
        screenCtrl.makeScreen(outputText);
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
    screenCtrl.makeScreen('Что будете делать?');
    setupEventListeners();
}

game();