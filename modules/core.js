import {
    USER_HAVE_ITEM
} from './constants.js';
import {
    vocabulary
} from './gamedata.js';
import {
    locations
} from './gamedata.js';
import {
    state
} from './gamedata.js';

import { userExamineObject, userExamineItem } from './userfunctions.js'

// Возвращаем описание предмета по его id
const getItemDescriptionById = (id) => {
    const item = vocabulary.objects.find(e => e.id === id);
    return item.desc;
}

// Проверяем, может ли игрок пройти в указанном направлении
const canPlayerMove = (direction, newLocation, flags, currentLocation) => {
    let access, answer;

    // Проверяем доступность в общем случае
    if (newLocation !== -1) {
        access = true;
        answer = "Что будете делать?";
    } else {
        access = false;
        answer = "Я не могу туда пройти";
    }

    // Проверяем частные случаи для определённых локаций
    switch (currentLocation) {
        case 8:
            // Если у дерева не стоит лестница
            if (!flags.isLadderLeanToTree && direction === "вверх") {
                answer = "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
                access = false;
            }
            break;
        case 7:
            // Если тролль жив
            if (!flags.isTrollKilled && direction === "в") {
                answer = "Тролль рычит и не даёт мне пройти.";
                access = false;
            }
            break;
        case 11:
            // Если дверь закрыта
            if (!flags.isDoorOpened && direction === "в") {
                answer = "Дверь закрыта, я не могу туда пройти.";
                access = false;
            }
            break;
        case 17:
            // Если решётка опущена
            if (!flags.isPortcullisOpened && direction === "с") {
                answer = "Решётка опущена до пола, я не могу туда пройти.";
                access = false;
            }
            break;
        case 18:
            if (!flags.isTrapdoorOpened && direction === "вниз") {
                answer = "Путь вниз мне преграждает закрытый люк.";
                access = false;
            }
            break;
        case 20:
            if (!flags.isMonsterKilled && direction === "с") {
                answer = "Ледяной монстр мешает мне пройти.";
                access = false;
            }
            break;
        case 23:
            if (!flags.isWormKilled && direction === "ю") {
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

// Перемещение игрока из одной локации в другую
const movePlayer = (direction, currentLocation, flags) => {
    let newLocation = -1;
    let playerChangeLocation = false;
    const gameDirections = locations[currentLocation].dir;
    const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
    const index = directionTypes.indexOf(direction);
    const indexOfTransitionLocation = gameDirections[index];

    // Проверяем, можно ли туда пройти
    const canMove = canPlayerMove(direction, indexOfTransitionLocation, flags, currentLocation);

    // Если можно, то перемещаем игрока
    if (canMove.access) {
        newLocation = indexOfTransitionLocation;
        playerChangeLocation = true;
    }

    return {
        answer: canMove.answer,
        newLocation: newLocation,
        playerChangeLocation: playerChangeLocation
    };
}

const takeItem = (item, inventory, itemPlaces, currentLocation, flags) => {
    let answer;
    // Проверяем особые игровые случаи
    // Если лестница прислонена к дереву, то её можно забрать
    if (item === "лестница" && currentLocation === 8 && flags.isLadderLeanToTree) {
        inventory[item] = true;
        itemPlaces = -1;
        flags.isLadderLeanToTree = false;
        answer = "Я забрал лестницу.";
    } else

        // Общий случай
        if (inventory[item] === false && itemPlaces[item] === currentLocation) {
            inventory[item] = true;
            itemPlaces[item] = -1;
            answer = "Ок, взял.";
        } else {
            answer = "Я не могу это взять.";
        }
    return {
        answer: answer,
        inventory: inventory,
        itemPlaces: itemPlaces,
        flags: flags
    }
}

const dropItem = (item, inventory, itemPlaces, currentLocation, flags) => {
    let answer;

    // Общий случай
    if (inventory[item] === true) {
        inventory[item] = false;
        itemPlaces[item] = currentLocation;
        answer = "Ок, положил.";
    } else {
        answer = "У меня нет этого.";
    }
    return {
        answer: answer,
        inventory: inventory,
        itemPlaces: itemPlaces,
        flags: flags
    }
}

const examine = (item, object, inventory, itemPlaces, currentLocation, flags) => {
    let answer = "Ничего необычного.";

    // Проверяем особые случаи для игровых объектов
    const examineObj = userExamineObject(object, inventory, itemPlaces, currentLocation, flags);
    inventory = examineObj.inventory;
    itemPlaces = examineObj.itemPlaces;
    flags = examineObj.flags;
    if (examineObj.answer !== undefined) answer = examineObj.answer;

    // Проверяем особые случаи для предметов

    const examineItem = userExamineObject(object, inventory, itemPlaces, currentLocation, flags);
    inventory = examineItem.inventory;
    itemPlaces = examineItem.itemPlaces;
    flags = examineItem.flags;
    if (examineItem.answer !== undefined) answer = examineItem.answer;

    // Общий случай осмотра предмета
    if (itemPlaces[item] === currentLocation) answer = `Чтобы внимательно осмотреть предмет, нужно взять его в руки.`;
    if (inventory[item]) answer = getItemDescriptionById(item);

    return {
        answer: answer,
        inventory: inventory,
        itemPlaces: itemPlaces,
        flags: flags
    }
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
    answer = processVerb(verb, mainItem, secondItem, gameObject);

    // Возвращаем реакцию программы на действие игрока
    return answer;
}

const processVerb = (verb, mainItem, secondItem, gameObject) => {
    let answer;
    switch (verb) {
        case "с":
        case "ю":
        case "в":
        case "з":
        case "вверх":
        case "вниз":
            const resultOfMove = movePlayer(verb, state.currentLocation, state.flags);
            if (resultOfMove.playerChangeLocation) {
                state.currentLocation = resultOfMove.newLocation;
            }
            answer = resultOfMove.answer;
            break;
        case "возьми":
            const resultOfTake = takeItem(mainItem, state.inventory, state.itemPlaces, state.currentLocation, state.flags);
            state.inventory = resultOfTake.inventory;
            state.itemPlaces = resultOfTake.itemPlaces;
            state.flags = resultOfTake.flags;
            answer = resultOfTake.answer;
            break;
        case "положи":
            const resultOfDrop = dropItem(mainItem, state.inventory, state.itemPlaces, state.currentLocation, state.flags);
            state.inventory = resultOfDrop.inventory;
            state.itemPlaces = resultOfDrop.itemPlaces;
            state.flags = resultOfDrop.flags;
            answer = resultOfDrop.answer;
            break;
        case "осмотри":
            const resultOfExamine = examine(mainItem, gameObject, state.inventory, state.itemPlaces, state.currentLocation, state.flags);
            state.inventory = resultOfExamine.inventory;
            state.itemPlaces = resultOfExamine.itemPlaces;
            state.flags = resultOfExamine.flags;
            answer = resultOfExamine.answer;
            break;
    }

    return answer
};

export default game