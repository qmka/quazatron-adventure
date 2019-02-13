import { ENTER_KEY_CODE } from './constants.js';
import setStartParameters from './gamedata.js';
import * as screenCtrl from './screenctrl.js';
import outputCtrl from './outputctrl.js';
import inputCtrl from './inputctrl.js';

// TODO: start and end screens
const controller = () => {
    const userInput = () => {

        // 1. Получаем фразу, которую ввёл игрок
        const inputText = document.getElementById("input_field").value;
        document.getElementById("input_field").value = "";

        // 2. Обрабатываем фразу через анализатор
        const words = inputCtrl(g, inputText);

        // 3. Выполняем действие игрока
        const processed = outputCtrl(g, words);
        g = processed.gameData;
        const outputText = processed.answer;

        // 4. Обновляем экран
        screenCtrl.makeScreen(g, outputText);
    };
    /*
        const startScreen = (g) => {
            g = setStartParameters();
            screenCtrl.makeStaticScreen('Из уст в уста ходит легенда о том, что в далёком королевстве есть замок, окружённый мрачным лесом. Много лет назад тем королевством правил мудрый король, у которого была красавица-дочь и волшебный меч, способный разрушить любые злые чары. Никто не мог одолеть армию короля силой или колдовством.<br><br>И вот прознала о могуществе правителя злая ведьма. Обернулась она красавицей и очаровала короля, да так, что спустя пару недель сыграли они свадьбу. В брачную ночь подарила она королю неземные ласки, а после, когда монарх уснул, задушила его. После пробралась она к принцессе и усыпила её вечным сном, а во всех бедах обвинила одного из слуг. И стала править единовластно.<br><br>Да только не захотели люди служить ведьме и покинули замок. С тех пор ничего о тех местах и не слыхать.', '<img src="img/castleman.png">', 'Вы - искатель приключений, который решил вернуть добро в земли далёкого королевства. Ваше путешествие начинается на самом краю леса, в заброшенной хижине дровосека...<br><span style="color: yellow;">В игре вы в любой момент можете ввести команду "И" для получения инструкций.</span><br><span style="color: cyan;">Нажмите ENTER для начала игры.</span>');
            g.state = "game";
            return g;
        }
    */

    const setupEventListeners = () => {
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === ENTER_KEY_CODE || event.which === ENTER_KEY_CODE) {
                {
                    userInput();
                }
            }
        });
    };

    let g = setStartParameters();
    console.log('Application has started.');
    screenCtrl.makeScreen(g, 'Что будете делать?');
    setupEventListeners();
}

controller();