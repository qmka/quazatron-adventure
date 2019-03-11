import {
    vocabulary,
    locations,
    encounters,
    gameDefaultTexts
} from './gamedata.js';

import {
    Inventory as inventory
} from './inventory.js'

import {
    getCurrentLocation,
    setCurrentLocation,
    getItemPlace,
    setItemPlace,
    getFlag
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
        return {
            access: false,
            answer: "Я не могу туда пройти"
        }
    }

    // Проверяем частные случаи для определённых локаций
    // В объекте encounters указаны условия, по которым куда-то нельзя пройти

    const result = encounters.checkPlayerObstacles(direction);
    if (result) {
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
    const gameDirections = locations[getCurrentLocation()].dir;
    const indexOfTransitionLocation = gameDirections[direction];
    let newLocation = -1;
    let canChangeLocation = false;

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

const playerStandartActions = {
    takeItem(itemId) {
        let answer;

        // Особые случаи
        answer = encounters.take(itemId);

        // Общий случай
        if (!inventory.isItemInInventory(itemId) && getItemPlace(itemId) === getCurrentLocation()) {
            inventory.addItem(itemId);
            setItemPlace(itemId, -1);
            answer = "Ок, взял.";
        }

        return answer;
    },

    dropItem(itemId) {
        let answer;

        // Особые случаи
        answer = encounters.drop(itemId);

        // Общий случай

        if (inventory.isItemInInventory(itemId)) {
            inventory.removeItem(itemId);
            setItemPlace(itemId, getCurrentLocation());
            answer = "Ок, положил.";
        }

        return answer;
    },

    examine(objectId) {
        let answer;

        // Особый случай наступает, когда в локации есть соотв. функция
        const result = encounters.examine(objectId);
        if (result !== "Ничего необычного.") answer = result;

        // Общий случай осмотра предмета

        else if (getItemPlace(objectId) === getCurrentLocation()) answer = "Чтобы внимательно осмотреть предмет, нужно взять его в руки.";
        else if (inventory.isItemInInventory(objectId)) answer = getItemDescriptionById(objectId);
        else answer = result;

        return answer;
    },
};

const processInput = (userInput) => {
    // Разбираем полученный из парсера объект на object1Id, object2Id, verbId
    const object1Id = userInput.object1;
    const object2Id = userInput.object2;
    const objects = [object1Id, object2Id];
    const verbId = userInput.verb;
    const uniqueEncounter = encounters.getUniqueEncounter(verbId, objects);
    let answer = userInput.message;
    let gameFlag = "game";

    // Обрабатываем особые игровые ситуации. Так, в комнате с ведьмой игрок может только отразить заклятье, и если не делает этого, то его выкидывает в предыдущую комнату
    if (uniqueEncounter.flag) {
        return {
            answer: uniqueEncounter.answer,
            gameFlag
        };
    } else {
        // Выдаём игроку сообщение об ошибке, если парсер выдал сообщение об ошибке
        if (answer !== "Ок") return {
            answer,
            gameFlag
        };
        // Дефолтное значение answer на случай, если программа не понимает введённый игроком глагол
        answer = "Я не понимаю";
        // Обрабатываем команду игрока (по глаголу)
        // Если это глагол перемещения
        switch (verbId) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
                const resultOfMove = movePlayer(verbId);
                if (resultOfMove.canChangeLocation) {
                    setCurrentLocation(resultOfMove.newLocation);
                }
                answer = resultOfMove.answer;
                break;
            case 6:
                // Глагол "ИНФО" (6)
                answer = gameDefaultTexts.info;
                break;
            case 7:
                // Выход из игры
                gameFlag = "gameover";
                break;
            case 8:
                // Инвентарь
                answer = inventory.getItemsTextList();
                break;
            case 9:
            case 10:
            case 11:
                // Отдельно обрабатываем глаголы "ВЗЯТЬ" (9), "ПОЛОЖИТЬ" (10), "ОСМОТРЕТЬ" (11)
                answer = playerStandartActions[vocabulary.verbs[verbId].method](object1Id);
                break;
            default:
                answer = encounters[vocabulary.verbs[verbId].method](objects);
                break            
        }

        // Проверяем, победил или проиграл ли игрок?
        if (getFlag("isVictory")) {
            gameFlag = "victory";
        }
        if (getFlag("isGameOver")) {
            gameFlag = "gameover";
        }
        // Возвращаем реакцию программы на действие игрока
        return {
            answer,
            gameFlag
        }
    }
};

export default processInput