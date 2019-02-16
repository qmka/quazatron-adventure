import {
    USER_HAVE_ITEM
} from './constants.js';
import {
    vocabulary as v
} from './gamedata.js';
import {
    locations
} from './gamedata.js';
import {
    state
} from './gamedata.js';


const canPlayerMove = (direction, locationIndex) => {
    let access, answer;

    // Проверяем доступность в общем случае
    if (locationIndex !== -1) {
        access = true;
        answer = "Что будете делать?";
    } else {
        access = false;
        answer = "Я не могу туда пройти";
    }

    // Проверяем частные случаи для определённых локаций
    switch (state.currentLocation) {
        case 8:
            // Если у дерева не стоит лестница
            if (!state.flags.isLadderLeanToTree && direction === "вверх") {
                answer = "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
                access = false;
            }
            break;
        case 7:
            // Если тролль жив
            if (!state.flags.isTrollKilled && direction === "в") {
                answer = "Тролль рычит и не даёт мне пройти.";
                access = false;
            }
            break;
        case 11:
            // Если дверь закрыта
            if (!state.flags.isDoorOpened && direction === "в") {
                answer = "Дверь закрыта, я не могу туда пройти.";
                access = false;
            }
            break;
        case 17:
            // Если решётка опущена
            if (!state.flags.isPortcullisOpened && direction === "с") {
                answer = "Решётка опущена до пола, я не могу туда пройти.";
                access = false;
            }
            break;
        case 18:
            if (!state.flags.isTrapdoorOpened && direction === "вниз") {
                answer = "Путь вниз мне преграждает закрытый люк.";
                access = false;
            }
            break;
        case 20:
            if (!state.flags.isMonsterKilled && direction === "с") {
                answer = "Ледяной монстр мешает мне пройти.";
                access = false;
            }
            break;
        case 23:
            if (!state.flags.isWormKilled && direction === "ю") {
                answer = "Скальный червь мешает мне пройти.";
                access = false;
            }
            break;
    }

    return {
        access: access,
        answer: answer
    }
}

const movePlayer = (direction) => {
    const gameDirections = locations[state.currentLocation].dir;
    const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
    const index = directionTypes.indexOf(direction);
    const indexOfTransitionLocation = gameDirections[index];

    // Проверяем, можно ли туда пройти
    const canMove = canPlayerMove(direction, indexOfTransitionLocation);

    // Если можно, то перемещаем игрока
    if (canMove.access) {
        state.currentLocation = indexOfTransitionLocation;
    }
    return canMove.answer;
}

const game = (userInput) => {
    // Разбираем полученный из парсера объект на item1, item2, object, verb; записываем в них соотв. id
    const mainItem = userInput.item1;
    const secondItem = userInput.item2;
    const gameObject = userInput.obj;
    const verb = userInput.verb;
    let answer = userInput.answer;

    // TODO: Здесь предусмотреть функцию выхода, если обработчик слов выдал сообщение об ошибке

    // TODO: Здесь предусмотреть функцию для отработки особых игровых ситуаций

    // Обрабатываем команду игрока (по глаголу)
    answer = processVerb(verb);

    // Возвращаем реакцию программы на действие игрока
    return answer;
}

const processVerb = (verb) => {
    let answer;
    switch (verb) {
        case "с":
        case "ю":
        case "в":
        case "з":
        case "вверх":
        case "вниз":
            answer = movePlayer(verb);
            break;
    }

    return answer
};

export default game