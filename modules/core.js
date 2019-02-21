import {
    vocabulary
} from './gamedata.js';
import {
    locations
} from './gamedata.js';
import {
    state, inventory
} from './gamedata.js';

// Возвращаем описание предмета по его id
const getItemDescriptionById = (id) => {
    const item = vocabulary.objects.find((e) => e.id === id);
    return item.desc;
}

// Возвращаем текущую локацию
const getCurrentLocation = () => {
    return state.currentLocation;
}

const setCurrentLocation = (location) => {
    state.currentLocation = location;
}

const setItemPlace = (item, location) => {
    state.itemPlaces[item] = location;
}

const getItemPlace = (item) => {
    return state.itemPlaces[item];
}

const isItemInInventory = (item) => {
    return inventory.isItemInInventory(item);
}

const addItemToInventory = (item) => {
    inventory.addItem(item);
}

const removeItemFromInventory = (item) => {
    inventory.removeItem;
}

const setFlag = (flag, value) => {
    state.flags[flag] = value;
}

const getFlag = (flag) => {
    return state.flags[flag];
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
    switch (getCurrentLocation()) {
        case 8:
            // Если у дерева не стоит лестница
            if (!getFlag("isLadderLeanToTree") && direction === "вверх") {
                answer = "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
                access = false;
            }
            break;
        case 7:
            // Если тролль жив
            if (!getFlag("isTrollKilled") && direction === "в") {
                answer = "Тролль рычит и не даёт мне пройти.";
                access = false;
            };
            break;
        case 11:
            // Если дверь закрыта
            if (!getFlag("isDoorOpened") && direction === "в") {
                answer = "Дверь закрыта, я не могу туда пройти.";
                access = false;
            };
            break;
        case 17:
            // Если решётка опущена
            if (!getFlag("isPortcullisOpened") && direction === "с") {
                answer = "Решётка опущена до пола, я не могу туда пройти.";
                access = false;
            };
            break;
        case 18:
            if (!getFlag("isTrapdoorOpened") && direction === "вниз") {
                answer = "Путь вниз мне преграждает закрытый люк.";
                access = false;
            };
            break;
        case 20:
            if (!getFlag("isMonsterKilled") && direction === "с") {
                answer = "Ледяной монстр мешает мне пройти.";
                access = false;
            };
            break;
        case 23:
            if (!getFlag("isWormKilled") && direction === "ю") {
                answer = "Скальный червь мешает мне пройти.";
                access = false;
            }
            break;
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
    const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
    const index = directionTypes.indexOf(direction);
    const indexOfTransitionLocation = gameDirections[index];

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
    if (item === "лестница" && getCurrentLocation() === 8 && getFlag("isLadderLeanToTree")) {
        addItemToInventory(item);
        setItemPlace(item, -1);
        setFlag("isLadderLeanToTree", false);
        answer = "Я забрал лестницу.";
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

    // Общий случай

    if (isItemInInventory(item)) {
        removeItemFromInventory(item);
        setItemPlace(item, getCurrentLocation());
        answer = "Ок, положил.";
    } 

    return answer;
}

const examine = (item, object) => {
    let answer = "Ничего необычного.";

    // Особые случаи
    if (object === "пропасть" && (getCurrentLocation() === 6 || getCurrentLocation() === 12)) answer = "Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.";

    if (object === "куст" && getCurrentLocation() === 14) {
        answer = "Ветви этого куста похожи на щупальца осминога.";
        if (!getFlag("isKeyRevealed")) {
            setFlag("isKeyRevealed", true);
            addItemToInventory("ключ");
            answer += " На одном из таких щупальцев я обнаружил ключ.";
        }
    }

    if (object === "дверь" && getCurrentLocation() === 11) {
        answer = getFlag("isDoorOpened") ? "Дверь открыта." : "Дверь заперта.";
    }

    if (object === "тролль" && getCurrentLocation() === 7 && !getFlag("isTrollKilled")) {
        answer = "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
    }

    if (object === "дерево" && getCurrentLocation() === 8) answer = "Это невысокое, но очень широкое в обхвате дерево, превратившееся в камень под действием какого-то неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя нишу.";

    if (object === "решётка" && getCurrentLocation() === 17) {
        answer = getFlag("isPortcullisOpened") ? "Решётка поднята к потолку - проход свободен." : "Мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
    }

    if (object === "люк" && getCurrentLocation() === 18) {
        answer = getFlag("isTrapdoorOpened") ? "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
    }

    if (object === "старушка" && getCurrentLocation() === 5) answer = "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";

    if (object === "червь" && getCurrentLocation() === 23 && !getFlag("isWormKilled")) answer = "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";

    if (object === "монстр" && getCurrentLocation() === 20 && !getFlag("isMonsterKilled")) answer = "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";

    if (object === "рычаг" && getCurrentLocation() === 25) {
        answer = getFlag("isLeverOiled") ? "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать." : "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать."
    }

    if (object === "принцесса" && getCurrentLocation() === 28) answer = "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";

    if (item === "дрова" && isItemInInventory(item)) {
        answer = getItemDescriptionById(item);
        if (!getFlag("isAxeRevealed")) {
            setFlag("isAxeRevealed", true);
            setItemPlace("топор", getCurrentLocation());
            answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
        }
    }

    if (item === "лестница" && getFlag("isLadderLeanToTree") && getCurrentLocation() === 8) answer = "Лестница приставлена к дереву. Я могу залезть наверх.";


    // Общий случай осмотра предмета
    if (getItemPlace(item) === getCurrentLocation()) answer = "Чтобы внимательно осмотреть предмет, нужно взять его в руки.";
    if (isItemInInventory(item)) answer = getItemDescriptionById(item);

    return answer;
}

const leanItem = (item) => {
    let answer = "Хм, это делу не поможет.";

    // Особый случай
    if (item === "лестница" && isItemInInventory(item) && getCurrentLocation() === 8) {
        removeItemFromInventory(item);
        setFlag("isLadderLeanToTree", true);
        answer = "Я прислонил лестницу к дереву.";
    }

    return answer
}

const game = (userInput) => {
    // Разбираем полученный из парсера объект на item1, item2, object, verb; записываем в них соотв. id
    const mainItem = userInput.item1;
    const secondItem = userInput.item2;
    const gameObject = userInput.obj;
    const verb = userInput.verb;
    let answer = userInput.answer;

    // TODO: Выдаём игроку сообщение об ошибке, если парсер выдал сообщение об ошибке

    // TODO: Здесь предусмотреть функцию для отработки особых игровых ситуаций

    // Обрабатываем команду игрока (по глаголу)
    answer = processVerb(verb, mainItem, secondItem, gameObject);

    // Возвращаем реакцию программы на действие игрока
    return answer;
}

const processVerb = (verb, mainItem, secondItem, gameObject) => {
    let answer;
    // TODO: сделать обработку неигровых глаголов "ПОМОГИ", "ВЫХОД", "ИДИ"
    if (verb === "с" || verb === "ю" || verb === "з" || verb === "в" || verb === "вверх" || verb === "вниз") {
        const resultOfMove = movePlayer(verb);
        if (resultOfMove.canChangeLocation) {
            setCurrentLocation(resultOfMove.newLocation);
        }
        answer = resultOfMove.answer;
    } else {
        switch (verb) {
            case "возьми":
                answer = takeItem(mainItem);
                break;
            case "положи":
                answer = dropItem(mainItem);
                break;
            case "осмотри":
                answer = examine(mainItem, gameObject);
                break;
            case "прислони":
                answer = leanItem(mainItem);
                break;
            default:
                answer = "Я не понимаю.";
                break;

        }
    }
    return answer
};

export default game