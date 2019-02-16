import { ENTER_KEY_CODE } from './modules/constants.js';
import { state } from './modules/gamedata.js';
import * as screenCtrl from './modules/screenctrl.js';
// import outputCtrl from './modules/outputctrl.js';
import game from './modules/core.js';
import parseInput from './modules/parseinput.js';

// TODO: start and end screens
const controller = () => {

    // Реакция программы на ввод игрока
    const userInput = () => {

        // 1. Получаем введённую игроком команду и очищаем поле ввода
        const inputText = document.getElementById("input-field").value;
        document.getElementById("input-field").value = "";

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
            if (event.keyCode === ENTER_KEY_CODE || event.which === ENTER_KEY_CODE) {
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