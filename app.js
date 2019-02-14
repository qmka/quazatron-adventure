import { ENTER_KEY_CODE } from './modules/constants.js';
import { flags } from './modules/gamedata.js';
import * as screenCtrl from './modules/screenctrl.js';
import outputCtrl from './modules/outputctrl.js';
import inputCtrl from './modules/inputctrl.js';

// TODO: start and end screens__
const controller = () => {
    const userInput = () => {

        const inputText = document.getElementById("input-field").value;
        document.getElementById("input-field").value = "";

        const words = inputCtrl(inputText);

        const processed = outputCtrl(g, words);
        g = processed.gameData;
        const outputText = processed.answer;

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

    let g = flags;
    console.log('Application has started.');
    // Выводим экран, отправляем туда текущие флаги
    screenCtrl.makeScreen(g, 'Что будете делать?');
    setupEventListeners();
}

controller();