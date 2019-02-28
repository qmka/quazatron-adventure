import {
    vocabulary,
    locations,
    state,
    inventory,
    encounters
} from './gamedata.js';

import {
    getCurrentLocation,
    setCurrentLocation,
    getItemPlace,
    setItemPlace,
    getFlag,
    setFlag,
    isItemInInventory,
    addItemToInventory,
    removeItemFromInventory
} from './functions.js'

// Возвращаем описание предмета по его id
const getItemDescriptionById = (id) => {
    const item = vocabulary.objects.find((e) => e.id === id);
    return item.desc;
}

// Проверяем, может ли игрок пройти в указанном направлении
const canPlayerMove = (direction, newLocation) => {
    let access = true,
        answer = "Что будете делать?";

    // Проверяем доступность в общем случае
    if (newLocation === -1) {
        answer = "Я не могу туда пройти";
        access = false;
        return {
            access,
            answer
        }
    }

    // Проверяем частные случаи для определённых локаций
    // В объекте encounters указаны условия, по которым куда-то нельзя пройти

    const result = encounters.playerCanNotMove(direction);
    if (result !== undefined) {
        answer = result;
        access = false;
    }


    return {
        access,
        answer
    }
}

// Перемещение игрока из одной локации в другую
const movePlayer = (direction) => {
    let newLocation = -1;
    let canChangeLocation = false;
    const gameDirections = locations[getCurrentLocation()].dir;
    const indexOfTransitionLocation = gameDirections[direction];

    // Проверяем, можно ли туда пройти
    const canMove = canPlayerMove(direction, indexOfTransitionLocation);

    // Если можно, то перемещаем игрока
    if (canMove.access) {
        newLocation = indexOfTransitionLocation;
        canChangeLocation = true;
    }
    return {
        answer: canMove.answer,
        newLocation,
        canChangeLocation
    };
}


const takeItem = (item) => {
    let answer = "Я не могу это взять.";

    // Особые случаи
    const result = encounters.take(item);
    if (result !== undefined) {
        answer = result;
    }

    // Общий случай
    if (!isItemInInventory(item) && getItemPlace(item) === getCurrentLocation()) {

        addItemToInventory(item);
        setItemPlace(item, -1);
        answer = "Ок, взял.";
    }

    return answer;
}

const dropItem = (item) => {
    let answer = "У меня нет этого.";

    // Особые случаи
    // В демо-игре отсутствуют

    const result = encounters.drop(item);
    if (result !== undefined) answer = result;

    // Общий случай

    if (isItemInInventory(item)) {
        removeItemFromInventory(item);
        setItemPlace(item, getCurrentLocation());
        answer = "Ок, положил.";
    }

    return answer;
}

const examine = (object) => {
    let answer = "Ничего необычного";

    // Особый случай наступает, когда в локации есть соотв. функция

    const result = encounters.examine(object);
    if (result !== undefined) answer = result;

    // Общий случай осмотра предмета

    else if (getItemPlace(object) === getCurrentLocation()) answer = "Чтобы внимательно осмотреть предмет, нужно взять его в руки.";
    else if (isItemInInventory(object)) answer = getItemDescriptionById(object);

    return answer;
}

const lean = (object1, object2) => {
    let answer = "Хм, это делу не поможет.";

    // Особый случай
    const result = encounters.lean(object1, object2);
    if (result !== undefined) {
        answer = result;
    }

    return answer;
}

const destroy = (object1, object2) => {
    let answer = "Я не могу это сломать.";

    // Особый случай
    const result = encounters.destroy(object1, object2);
    if (result !== undefined) {
        answer = result;
    }

    if (isItemInInventory(object1)) return "Не стоит ломать. Вдруг мне это ещё пригодится?";
    return answer;
}

const cross = (object1) => {
    let answer = "Я не могу это сделать.";

    // Особый случай
    const result = encounters.cross(object1);
    if (result !== undefined) {
        answer = result;
    }

    return answer;
}

const game = (userInput) => {
    // Разбираем полученный из парсера объект на item1, item2, object, verb; записываем в них соотв. id
    const object1 = userInput.object1;
    const object2 = userInput.object2;
    const verb = userInput.verb;
    let answer = userInput.message;

    // TODO: Выдаём игроку сообщение об ошибке, если парсер выдал сообщение об ошибке
    if (answer !== "Ок") return answer;

    // TODO: Здесь предусмотреть функцию для отработки особых игровых ситуаций

    // Обрабатываем команду игрока (по глаголу)
    answer = processVerb(verb, object1, object2);

    // Возвращаем реакцию программы на действие игрока
    return answer;
}

const processVerb = (verb, object1, object2) => {
    let answer;

    // TODO: сделать обработку неигровых глаголов "ПОМОГИ", "ВЫХОД", "ИДИ"

    // Если это глагол перемещения
    if (verb <= 5) {
        const resultOfMove = movePlayer(verb);
        if (resultOfMove.canChangeLocation) {
            setCurrentLocation(resultOfMove.newLocation);
        }
        answer = resultOfMove.answer;
    } else {
        switch (verb) {
            case 8:
                answer = takeItem(object1);
                break;
            case 9:
                answer = dropItem(object1);
                break;
            case 19:
                answer = cross(object1);
                break;
            case 20:
                answer = destroy(object1, object2);
                break;
            case 22:
                answer = examine(object1);
                break;
            case 21:
                answer = lean(object1, object2);
                break;
            default:
                answer = "Я не понимаю.";
                break;

        } 
    }


    return answer
};

export default game



