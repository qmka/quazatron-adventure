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
    inventory.removeItem(item);
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
    // Если у локации есть метод playerCanNotMove, то в нём указаны условия, по которым куда-то нельзя пройти
    if ("playerCanNotMove" in locations[state.currentLocation]) {
        const result = locations[state.currentLocation].playerCanNotMove(direction);
        if (result !== undefined) {
            answer = result;
            access = false;
        }
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
    if ("take" in locations[state.currentLocation]) {
        const result = locations[state.currentLocation].take(item);
        if (result !== undefined) {
            answer = result;
        }
    }
    console.log(!isItemInInventory(item) + " " + getItemPlace(item) + " " + getCurrentLocation())
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
    // Особые случаи
    if ("drop" in locations[state.currentLocation]) {
        const result = locations[state.currentLocation].drop(item);
        if (result !== undefined) {
            answer = result;
        }
    }

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
    if ("examine" in locations[state.currentLocation]) {
        const locationAnswer = locations[state.currentLocation].examine(object);
        if (locationAnswer !== undefined) answer = locationAnswer;
    }
    // Конец особых случаев
/*
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

*/
    // Общий случай осмотра предмета
    /*
    if (getItemPlace(item) === getCurrentLocation()) answer = "Чтобы внимательно осмотреть предмет, нужно взять его в руки.";
    if (isItemInInventory(item)) answer = getItemDescriptionById(item);
*/
    return answer;
}

const leanItem = (item) => {
    let answer = "Хм, это делу не поможет.";

    // Особый случай
    if ("lean" in locations[state.currentLocation]) {
        const result = locations[state.currentLocation].lean(item);
        if (result !== undefined) {
            answer = result;
        }
    }

    return answer
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
            case 22:
                answer = examine(object1);
                break;
            case 21:
                answer = leanItem(object1);
                break;
            default:
                answer = "Я не понимаю.";
                break;

        }
    }

    
    return answer
};

export default game