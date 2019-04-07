import objects from '../gamedata/objects.js';
import verbs from '../gamedata/verbs.js';
import encounters from '../gamedata/encounters.js';
import locations from '../gamedata/locations.js';

import {
    defaultTexts
} from '../gamedata/default-data.js';

import Inventory from '../classes/inventory.js';
import CurrentLocation from '../classes/location.js';
import Flags from '../classes/flags.js';
import ItemPlaces from '../classes/itemplaces.js';
import Counters from '../classes/counters.js';
import GameState from '../classes/gamestate.js';

import {
    GAME_STATES
} from './constants.js';

// Сохраняем игровое состояние

const saveGameState = () => {
    localStorage.setItem('currentLocation', CurrentLocation.get());
    localStorage.setItem('inventory', JSON.stringify(Inventory.getAll()));
    localStorage.setItem('flags', JSON.stringify(Flags.getAll()));
    localStorage.setItem('itemPlaces', JSON.stringify(ItemPlaces.getAll()));
    return defaultTexts.saveGame;
}

// Загружаем игровое состояние
const loadGameState = () => {
    if (localStorage.length !== 0) {
        GameState.clear();
        CurrentLocation.set(parseInt(localStorage.getItem('currentLocation')));
        Inventory.init(JSON.parse(localStorage.getItem('inventory')));
        Flags.init(JSON.parse(localStorage.getItem('flags')));
        ItemPlaces.init(JSON.parse(localStorage.getItem('itemPlaces')));
        return defaultTexts.loadGame;
    } else {
        return defaultTexts.cantLoadGame;
    }
}

// Возвращаем описание предмета по его id
const getItemDescriptionById = (id) => {
    const item = objects.find((e) => e.id === id);

    return item.desc;
}

// Проверяем, может ли игрок пройти в указанном направлении
const canPlayerMove = (direction, newLocation) => {
    let access = true,
        answer = defaultTexts.defaultQuestion;

    // Проверяем доступность в общем случае
    if (newLocation === -1) {
        return {
            access: false,
            answer: defaultTexts.playerCantGo
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
const movePlayer = (verbId) => {
    const directions = ['n', 'e', 's', 'w', 'u', 'd', 'ne', 'nw', 'se', 'sw'];
    const direction = directions[verbId];
    const gameDirections = locations[CurrentLocation.get()].dir;
    let indexOfTransitionLocation = -1;
    let newLocation = -1;
    let canChangeLocation = false;

    if (gameDirections[direction] >= 0) indexOfTransitionLocation = gameDirections[direction];

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

const playerStandardActions = {
    takeItem(objectIds) {
        // Особые случаи
        let answer = encounters.take(objectIds);

        // Общий случай
        if (objectIds[0] !== -1) {
            const itemId = objectIds[0];
            if (!Inventory.includes(itemId) && ItemPlaces.get(itemId) === CurrentLocation.get()) {
                Inventory.addItem(itemId);
                ItemPlaces.set(itemId, -1);
                return defaultTexts.defaultAnswerToTake;
            }
        }
        return answer;
    },

    dropItem(objectIds, objectsInInput) {
        // Особые случаи - проверяем энкаунтеры
        let answer = encounters.drop(objectIds);

        // Общий случай
        // Если игрок указал один предмет, то кладём его
        if (answer === defaultTexts.playerUselessAction && objectsInInput === 1) {
            const itemId = objectIds[0];
            if (Inventory.includes(itemId)) {
                Inventory.removeItem(itemId);
                ItemPlaces.set(itemId, CurrentLocation.get());
                return defaultTexts.playerDropsItem;
            } else {
                return defaultTexts.playerHasNoItem;
            }
        }
        return answer;
    },

    examine(objectIds) {
        let answer;
        const objectId = objectIds[0];
        // Особый случай наступает, когда в локации есть соотв. функция
        const result = encounters.examine(objectId);
        if (result !== defaultTexts.defaultDescription) answer = result;

        // Общий случай осмотра предмета
        // Если предмет в локации, но не в инвентаре
        else if (ItemPlaces.get(objectId) === CurrentLocation.get()) answer = defaultTexts.itemNotInInventory;
        // Если предмет в инвентаре
        else if (Inventory.includes(objectId)) answer = getItemDescriptionById(objectId);
        // Если объект приписан к этой локации
        else if ("location" in objects[objectId]) {
            if ((typeof objects[objectId].location === "number" && objects[objectId].location === CurrentLocation.get()) || (typeof objects[objectId].location === "object" && objects[objectId].location.includes(CurrentLocation.get()))) answer = getItemDescriptionById(objectId);
            else answer = defaultTexts.objectIsNotInLocation;
        } else answer = result;

        return answer;
    },

    go(objectIds) {
        const objectId = objectIds[0];
        const result = encounters.go(objectId);
        if (result !== defaultTexts.playerCantGo) return result;
        const resultOfMove = movePlayer(objectId - 29); // Магическое число 29 жёстко привязано к номеру объекта "Север".
        // В дальнейшем нужно создать объект с направлениями, и уже отталкиваться от него
        if (resultOfMove.canChangeLocation) {
            CurrentLocation.set(resultOfMove.newLocation);
        }
        return resultOfMove.answer;
    }
};

const processInput = (userInput) => {
    // Разбираем полученный из парсера объект на object1Id, object2Id, verbId
    const object1Id = userInput.object1;
    const object2Id = userInput.object2;
    const objectIds = [object1Id, object2Id];
    const verbId = userInput.verb;
    const objectsInInput = userInput.objectsInInput;
    const uniqueEncounter = encounters.getUniqueEncounter(verbId, objectIds);
    let answer;
    if (userInput.message) answer = userInput.message;
    let gameFlag = GAME_STATES.game;

    // Обрабатываем особые игровые ситуации. Так, в комнате с ведьмой игрок может только отразить заклятье, и если не делает этого, то его выкидывает в предыдущую комнату
    if (uniqueEncounter.flag) {
        return {
            answer: uniqueEncounter.answer,
            gameFlag
        };
    } else {
        // Выдаём игроку сообщение об ошибке, если парсер выдал сообщение об ошибке
        if (answer) return {
            answer,
            gameFlag
        };
        // Дефолтное значение answer на случай, если программа не понимает введённый игроком глагол
        answer = defaultTexts.defaultAnswer;
        // Прокручиваем все нужные счётчики
        encounters.setCounters();
        // Обрабатываем команду игрока (по глаголу)
        // Если это глагол перемещения
        switch (verbId) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
                const resultOfMove = movePlayer(verbId);
                if (resultOfMove.canChangeLocation) {
                    CurrentLocation.set(resultOfMove.newLocation);
                }
                answer = resultOfMove.answer;
                GameState.save();
                break;
            case 10:
                // Прорабатываем глагол ИДИ
                if (objectsInInput === 0) answer = defaultTexts.specifyDirection;
                else answer = encounters.go(objectIds);
                GameState.save();
                break;
            case 11:
                // Глагол "ИНФО" (10)
                answer = defaultTexts.info;
                break;
            case 12:
                // Выход из игры
                gameFlag = GAME_STATES.gameover;
                break;
            case 13:
                // Инвентарь
                answer = Inventory.getItemsTextList();
                break;
            case 14:
                // Сохранить игру
                answer = saveGameState();
                break;
            case 15:
                // Загрузить игру
                answer = loadGameState();
                break;
            case 16:
            case 17:
            case 18:
                // Отдельно обрабатываем глаголы "ВЗЯТЬ", "ПОЛОЖИТЬ", "ОСМОТРЕТЬ"
                if (objectsInInput === 0) answer = defaultTexts.playerCommandsVerbWithoutObject;
                else answer = playerStandardActions[verbs[verbId].method](objectIds, objectsInInput);
                GameState.save();
                break;
            case 39:
                // Отменить действие
                if (GameState._state.length <= 1) {
                    answer = 'Нечего отменять, вы в самом начале игры.';
                } else {
                    answer = 'Вы вернулись на один ход назад';
                    GameState.restore();
                    return {
                        answer,
                        gameFlag
                    }
                }

                break;
            default:
                answer = encounters[verbs[verbId].method](objectIds, objectsInInput);
                GameState.save();
                break
        }

        // Проверяем, победил или проиграл ли игрок?
        if (Flags.get("isVictory")) {
            gameFlag = GAME_STATES.victory;
        }
        if (Flags.get("isGameOver")) {
            gameFlag = GAME_STATES.gameover;
        }

        // Возвращаем реакцию программы на действие игрока
        return {
            answer,
            gameFlag
        }
    }
};

export default processInput