import {
    vocabulary,
    locations,
    encounters,
    gameDefaultTexts
} from './gamedata.js';

import {
    getCurrentLocation,
    setCurrentLocation,
    getItemPlace,
    setItemPlace,
    isItemInInventory,
    addItemToInventory,
    removeItemFromInventory,
    getFlag,
    setFlag
} from './functions.js';

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

const action = {
    takeItem(item) {
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
    },

    dropItem(item) {
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
    },

    examine(object) {
        let answer = "Ничего необычного";

        // Особый случай наступает, когда в локации есть соотв. функция

        const result = encounters.examine(object);
        if (result !== undefined) answer = result;

        // Общий случай осмотра предмета

        else if (getItemPlace(object) === getCurrentLocation()) answer = "Чтобы внимательно осмотреть предмет, нужно взять его в руки.";
        else if (isItemInInventory(object)) answer = getItemDescriptionById(object);

        return answer;
    },
};

const inputProcessing = (userInput) => {
    // Разбираем полученный из парсера объект на item1, item2, object, verb; записываем в них соотв. id
    const object1 = userInput.object1;
    const object2 = userInput.object2;
    const verb = userInput.verb;
    let answer = userInput.message;
    const objects = [object1, object2];

    // Обрабатываем особые игровые ситуации. Так, в комнате с ведьмой игрок может только отразить заклятье, и если не делает этого, то его выкидывает в предыдущую комнату
    const uniqueEncounter = encounters.uniqueEncounter(verb, objects);
    console.log(uniqueEncounter);
    if (uniqueEncounter.flag) {
        return uniqueEncounter.answer;
    } else {
        // Выдаём игроку сообщение об ошибке, если парсер выдал сообщение об ошибке
        if (answer !== "Ок") return answer;
        // Дефолтное значение answer на случай, если программа не понимает введённый игроком глагол
        answer = "Я не понимаю";
        // Обрабатываем команду игрока (по глаголу)
        // Если это глагол перемещения
        if (verb <= 5) {
            const resultOfMove = movePlayer(verb);
            if (resultOfMove.canChangeLocation) {
                setCurrentLocation(resultOfMove.newLocation);
            }
            answer = resultOfMove.answer;
        } else if (verb === 6) {
            // Глагол "ПОМОГИ" (6)
            answer = gameDefaultTexts.help;
        } else if (verb === 7) {
            // TODO: сделать обработку команды выхода из игры "ВЫХОД" (7)
        } else if (verb >= 8 && verb <= 10) {
            // Отдельно обрабатываем глаголы "ВЗЯТЬ" (8), "ПОЛОЖИТЬ" (9), "ОСМОТРЕТЬ" (10), БРОСИТЬ (11)
            answer = action[vocabulary.verbs[verb].method](object1);
        } else {
            // Все остальные глаголы обрабатываем по одной и той же схеме
            answer = encounters[vocabulary.verbs[verb].method](objects);
        }

        // Возвращаем реакцию программы на действие игрока
        return answer
    }
};

export default inputProcessing