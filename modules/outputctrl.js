import {
    USER_HAVE_ITEM
} from './constants.js';
import {
    vocabulary as v
} from './gamedata.js';
import {
    locations
} from './gamedata.js';

// Возвращает объект из словаря целиком по его id
const findObjectById = (id) => {
    return v.objects.find(e => e.id === id);
}

// Возвращает true, если у игрока есть объект obj. Используется в действиях, применимых ко всем предметам, например, при обработке команды "осмотри" или "положи"
const haveThisObject = (g, obj) => {
    if (g.itemPlaces[obj.id] === USER_HAVE_ITEM) return true;
    return false;
}

// Возвращает true, если у игрока есть объект с определённым id. Используется, когда нужно проверить, есть ли у игрока конкретный предмет
const haveThisObjectId = (g, id) => {
    if (g.itemPlaces[id] === USER_HAVE_ITEM) return true;
    return false;
}

// Возвращает номер локации, в которой находится предмет
const itemPlace = (g, id) => {
    return g.itemPlaces[id];
}

// Помещает предмет, который назвал игрок, в локацию. Используется, когда нужно положить или взять предмет, указанный игроком
const changeUnknownItemPlace = (g, obj, plc) => {
    const key = v.objects.find(e => e === obj);
    g.itemPlaces[key.id] = plc;
    return g
}

// Помещает предмет с известным id в локацию
const changeKnownItemPlace = (g, id, plc) => {
    g.itemPlaces[id] = plc;
    return g
}

// Функция проверяет, не мешает ли игроку какое-либо препятствие пройти в заданном направлении
// True - не мешает, игрок может пройти
// False - мешает
// Возвращает flag - можно или нельзя пройти, и ответ, который игрок получает в том случае, когда пройти нельзя
const canPlayerMoveToLoc = (g, dir) => {
    let ans = "Что мне делать?";
    let canMove = true;
    switch (g.currentLocation) {
        case 8:
            // Если у дерева не стоит лестница
            if (!g.flags.isLadderLeanToTree && dir === "вверх") {
                ans = "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
                canMove = false;
            }
            break;
        case 7:
            // Если тролль жив
            if (!g.flags.isTrollKilled && dir === "в") {
                ans = "Тролль рычит и не даёт мне пройти.";
                canMove = false;
            }
            break;
        case 11:
            // Если дверь закрыта
            if (!g.flags.isDoorOpened && dir === "в") {
                ans = "Дверь закрыта, я не могу туда пройти.";
                canMove = false;
            }
        case 17:
            // Если решётка опущена
            if (!g.flags.isPortcullisOpened && dir === "с") {
                ans = "Решётка опущена до пола, я не могу туда пройти.";
                canMove = false;
            }
        case 18:
            if (!g.flags.isTrapdoorOpened && dir === "вниз") {
                ans = "Путь вниз мне преграждает закрытый люк.";
                canMove = false;
            }
        case 20:
            if (!g.flags.isMonsterKilled && dir === "с") {
                ans = "Ледяной монстр мешает мне пройти.";
                canMove = false;
            }
        case 23:
            if (!g.flags.isWormKilled && dir === "ю") {
                ans = "Скальный червь мешает мне пройти.";
                canMove = false;
            }
    }
    return {
        flag: canMove,
        answer: ans
    }
}

// Перемещаем игрока в указанном им направлении
// Изменяем номер текущей локации и возвращаем ответ, который будет выведен игроку
const playerMove = (g, inputDir) => {
    const gameDirections = locations[g.currentLocation].dir;
    const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
    const index = directionTypes.indexOf(inputDir);
    // здесь вызываем функцию, которая проверяет, можно ли туда пройти
    const canMove = canPlayerMoveToLoc(g, inputDir);

    // Если нельзя
    if (!canMove.flag) {
        return {
            g: g,
            answer: canMove.answer
        }
    }

    // Если можно
    let answer = "Что будете делать?";

    if (gameDirections[index] !== -1) {
        g.currentLocation = gameDirections[ ];
    } else {
        answer = "Я не могу туда пройти";
    }

    return {
        g: g,
        answer: answer
    }
};

// Основная функция
// На входе - объекты с текущим состоянием и с вводом игрока
// На выходе - объект с текущим состоянием и текст, который нужно вывести игроку как результат его действий
const outputCtrl = (g, input) => {

    // Если словоанализатор выдал сообщение об ошибке, то выводим его игроку и выходим из функции
    if (input.message !== "Ок") {
        return {
            answer: input.message,
            gameData: g
        }
    }

    let answer = "Что будете делать?";

    // Вынимаем из ввода игрока основной предмет, второй предмет (если есть) и игровой объект
    let thisItem, anotherItem, thisObject;

    // Если предметы или игровой объект отсутствуют, то присваиваем переменным id специального dummy-предмета, который нигде не используется и служит только для того, чтобы впоследствии браузер не ругался на ошибку, что у объекта нет какого-то свойства, которое мы хотим проверить (потому что объект undefined).
    // Мне это не нравится, но я не знаю, как этого избежать
    if (input.item1 === undefined) {
        thisItem = findObjectById("dummyItem");
    } else {
        thisItem = findObjectById(input.item1);
    }
    if (input.item2 === undefined) {
        anotherItem = findObjectById("dummyAltItem");
    } else {
        anotherItem = findObjectById(input.item2);
    }
    if (input.obj === undefined) {
        thisObject = findObjectById("dummyObject");
    } else {
        thisObject = findObjectById(input.obj);
    }

    // Здесь отрабатываем особую ситуацию. В комнате с ведьмой нужно отразить заклятье мечом. Если ввести любую другую команду, то игра выкидывает игрока в предыдущую комнату
    if (g.currentLocation === 27 && !g.flags.isWitchKilled) {
        if (input.verb === "отрази" && thisObject.id === "заклятье" && haveThisObjectId(g, "меч")) {
            g.flags.isWitchKilled = true;
            g = changeKnownItemPlace(g, "меч", -1);
            answer = "Я отразил заклятье мечом, и оно ударило прямо в ведьму! Издав истошный крик, ведьма рассыпалась в пыль. К сожалению, меч тоже не уцелел.";
        } else {
            if (input.verb === "отрази" && thisObject.id === "заклятье" && !haveThisObjectId(g, "меч")) {
                answer = "Мне нечем отразить заклятье.";
            } else {
                answer = "Я не успеваю ничего сделать.";
            }
            g.currentLocation = 17;
            answer += " Заклятье ударяет мне в грудь и выкидывает из этой комнаты в комнату с решёткой.";
        }
        return {
            answer: answer,
            gameData: g
        }
    }
    // Конец особой ситуации

    // Основная логика игры. Отталкиваемся от введённого игроком глагола
    switch (input.verb) {
        case "помоги":
            answer = 'Я понимаю команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, <span style="color: yellow;">ВОЗЬМИ ЛЕСТНИЦУ</span> или <span style="color: yellow;">НАБЕРИ ВОДЫ В КУВШИН.</span><br>Используйте команды <span style="color: yellow;">С Ю З В ВВЕРХ ВНИЗ</span> для передвижения.<br>Команда <span style="color: yellow;">ОСМОТРИ</span> позволяет получить больше информации о различных объектах.<br>Команда <span style="color: yellow;">ВЫХОД</span> позволяет вернуться на стартовый экран.';
            break;
        case "выход":
            answer = "Жаль, что приключение заканчивается. Но, может быть, вы захотите начать сначала? <br><br>Нажмите ENTER, чтобы перейти на стартовый экран.";
            // TODO выход на стартовый экран
            break;
        case "с":
        case "ю":
        case "в":
        case "з":
        case "вверх":
        case "вниз":
            const moved = playerMove(g, input.verb);
            g = moved.g;
            answer = moved.answer;
            break;
        case "иди":
            answer = "Для перемещения используйте команды С (идти на север), Ю (идти на юг), В (идти на восток), З (идти на запад), ВВЕРХ (подняться наверх), ВНИЗ (спуститься вниз)";
            break;
        case "положи":
            if (thisItem === {}) {
                answer = `Что положить? Уточните.`;
            } else if (haveThisObject(g, thisItem)) {
                g = changeUnknownItemPlace(g, thisItem, g.currentLocation);
                answer = `Ок, положил.`;
            } else if (itemPlace(g, thisItem.id) === g.currentLocation) {
                answer = `Это и так здесь уже лежит!`;
            } else {
                answer = `Не могу выбросить, потому что у меня этого нет.`;
            }
            break;
        case "возьми":
            if (thisItem.id === "лестница" && g.currentLocation === 8 && g.flags.isLadderLeanToTree) {
                g = changeUnknownItemPlace(g, thisItem, USER_HAVE_ITEM);
                g.flags.isLadderLeanToTree = false;
                answer = `Я забрал лестницу.`;
                break;
            }
            if (thisItem === {}) {
                answer = `Что взять? Уточните.`;
            } else if (itemPlace(g, thisItem.id) === g.currentLocation) {
                g = changeUnknownItemPlace(g, thisItem, USER_HAVE_ITEM);
                answer = `Ок, взял.`;
            } else if (itemPlace(g, thisItem.id) === USER_HAVE_ITEM) {
                answer = `У меня это уже есть!`;
            } else {
                answer = `Здесь этого нет, не могу взять.`;
            }
            break;
        case "осмотри":
            if (thisObject.id === "пропасть" && (g.currentLocation === 6 || g.currentLocation === 12)) {
                answer = `Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.`;
                break;
            }
            if (thisObject.id === "куст" && g.currentLocation === 14) {
                answer = "Ветви этого куста похожи на щупальца осминога.";
                if (!g.flags.isKeyRevealed) {
                    g.flags.isKeyRevealed = true;
                    g = changeKnownItemPlace(g, "ключ", 14);
                    answer += " На одном из таких щупальцев я обнаружил ключ.";
                }
                break;
            }
            if (thisItem.id === "дрова" && haveThisObjectId(g, "дрова")) {
                answer = thisItem.desc;
                if (!g.flags.isAxeRevealed) {
                    g.flags.isAxeRevealed = true;
                    g = changeKnownItemPlace(g, "топор", g.currentLocation);
                    answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
                }
                break;
            }
            if (thisObject.id === "дверь" && g.currentLocation === 11) {
                g.flags.isDoorOpened ? answer = "Дверь открыта." : answer = "Дверь заперта.";
                break;
            }
            if (thisObject.id === "тролль" && g.currentLocation === 7 && !g.flags.isTrollKilled) {
                answer = "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
                break;
            }
            if (thisObject.id === "дерево" && g.currentLocation === 8) {
                answer = "Это невысокое, но очень широкое в обхвате дерево, превратившееся в камень под действием какого-то неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя нишу.";
                break;
            }
            if (thisObject.id === "решётка" && g.currentLocation === 17) {
                g.flags.isPortcullisOpened ? answer = "Решётка поднята к потолку - проход свободен." : answer = "Мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
                break;
            }
            if (thisObject.id === "люк" && g.currentLocation === 18) {
                g.flags.isTrapdoorOpened ? answer = "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : answer = "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
                break;
            }
            if (thisObject.id === "старушка" && g.currentLocation === 5) {
                answer = "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";
                break;
            }

            if (thisItem.id === "лестница" && g.flags.isLadderLeanToTree && g.currentLocation === 8) {
                answer = "Лестница приставлена к дереву. Я могу залезть наверх.";
                break;
            }

            if (thisObject.id === "червь" && g.currentLocation === 23 && !g.flags.isWormKilled) {
                answer = "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";
                break;
            }

            if (thisObject.id === "монстр" && g.currentLocation === 20 && !g.flags.isMonsterKilled) {
                answer = "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";
                break;
            }

            if (thisObject.id === "рычаг" && g.currentLocation === 25) {
                if (g.flags.isLeverOiled) {
                    answer = "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать";
                } else {
                    answer = "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать.";
                }
                break;
            }

            if (thisObject.id === "принцесса" && g.currentLocation === 28) {
                answer = "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";
                break;
            }

            if (itemPlace(g, thisItem.id) === g.currentLocation) {
                answer = `Чтобы внимательно осмотреть предмет, нужно взять его в руки.`;
                break;
            }
            if (haveThisObject(g, thisItem)) {
                answer = thisItem.desc;
                break;
            }
            answer = `Ничего необычного.`;
            break;
        case "прислони":
            if (thisItem.id === "лестница" && haveThisObject(g, thisItem) && g.currentLocation === 8) {
                g = changeKnownItemPlace(g, "лестница", -1);
                g.flags.isLadderLeanToTree = true;
                answer = `Я прислонил лестницу к дереву.`;
            } else if (haveThisObject(g, thisItem)) {
                answer = `Хм, это делу не поможет.`;
            } else {
                answer = `Я могу прислонить только то, что у меня есть.`;
            }
            break;
        case "сломай":
            if (thisItem.id === "лестница" && haveThisObject(g, thisItem)) {
                g = changeKnownItemPlace(g, "лестница", -1);
                g = changeKnownItemPlace(g, "шест", g.currentLocation);
                answer = `Я разломал лестницу на куски и получил неплохой длинный шест.`;
                break;
            }

            if (thisObject.id = "люк" && g.currentLocation === 18 && !g.flags.isTrapdoorOpened) {
                if (haveThisObjectId(g, "топор")) {
                    g.flags.isTrapdoorOpened = true;
                    answer = "Я разломал топором деревянный люк. Теперь путь вниз открыт.";
                } else {
                    answer = "У меня нет ничего, чем я могу сломать люк.";
                }
                break;
            }

            if (haveThisObject(g, thisItem)) {
                answer = `Не буду ломать. Вдруг мне это ещё пригодится?`;
            } else {
                answer = `Я не могу это сломать.`;
            }
            break;
        case "перейди":
            if (thisObject.id === "пропасть" && g.currentLocation === 6) {
                if (haveThisObjectId(g, "шест")) {
                    answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                    g.currentLocation = 12;
                } else {
                    answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                }
            } else if (thisObject.id === "пропасть" && g.currentLocation === 12) {
                if (haveThisObjectId(g, "шест")) {
                    answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                    g.currentLocation = 6;
                } else {
                    answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                }
            } else {
                answer = "Я не могу это сделать.";
            }
            break;
        case "залезь":
            if (g.currentLocation === 8) {
                if (g.flags.isLadderLeanToTree) {
                    g.currentLocation = 9;
                    answer = "Я залез на дерево по лестнице.";
                } else {
                    answer = "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться.";
                }
            } else {
                answer = "Я туда не полезу.";
            }
            break;
        case "руби":
            if (g.currentLocation === 18 && thisObject.id === "люк" && haveThisObjectId(g, "топор")) {
                if (!g.flags.isTrapdoorOpened) {
                    g.flags.isTrapdoorOpened = true;
                    answer = "Я порубил топором деревянный люк. Теперь путь вниз открыт.";
                } else {
                    answer = "Здесь уже нет люка.";
                }
                break;
            }

            if (((g.currentLocation === 7 && thisObject.id === "тролль") || (g.currentLocation === 20 && thisObject.id === "монстр")) && haveThisObjectId(g, "топор")) {
                answer = "Этот топор хорош для колки дров, но в бою будет слабоват и неудобен.";
                break;
            }

            if (g.currentLocation === 23 && !g.flags.isWormKilled && haveThisObjectId(g, "топор")) {
                answer = "Шкура скального червя настолько твёрдая, что её невозможно повредить топором.";
                break;
            }

            if (g.currentLocation === 8 && thisObject.id === "дерево" && haveThisObjectId(g, "топор")) {
                g = changeKnownItemPlace(g, "топор", -1);
                answer = "Я с размаху бью топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и мой топор разлетается на куски.";
                break;
            }

            if (g.currentLocation === 14 && thisObject.id === "куст" && haveThisObjectId(g, "топор")) {
                answer = "Я попытался срубить куст, но его ветви чудесным образом отклоняются от лезвия, и я не могу причинить им вреда.";
                break;
            }

            if ((haveThisObjectId(g, "шест") || itemPlace(g, "шест") === g.currentLocation) && (thisItem.id === "шест" || anotherItem.id === "шест") && haveThisObjectId(g, "топор")) {
                g = changeKnownItemPlace(g, "шест", -1);
                answer = "В ярости я накинулся на шест и порубил его в труху.";
                break;
            }

            if ((haveThisObjectId(g, "дрова") || itemPlace(g, "дрова") === g.currentLocation) && (thisItem.id === "дрова" || anotherItem.id === "дрова") && haveThisObjectId(g, "топор")) {
                g = changeKnownItemPlace(g, "дрова", -1);
                answer = "В ярости я накинулся на вязанку дров и порубил их в щепки. Эх, теперь ведь дровосек расстроится...";
                break;
            }

            if (g.currentLocation === 5 && thisObject.id === "старушка" && haveThisObjectId(g, "топор")) {
                answer = "Вам не кажется, что эта ситуация со старушкой и топором - немного из другого произведения?";
                break;
            }

            if (!haveThisObjectId(g, "топор") && !haveThisObjectId(g, "меч")) {
                answer = "Чем прикажете рубить?";
                break;
            }
            answer = "Я могу, конечно, порубить хоть всё вокруг, но к успеху не приближусь.";
            break;
        case "открой":
            if (g.currentLocation === 11 && thisObject.id === "дверь") {
                if (haveThisObjectId(g, "ключ") && !g.flags.isDoorOpened) {
                    g.flags.isDoorOpened = true;
                    answer = "Вы открыли дверь ключом.";
                } else if (g.flags.isDoorOpened) {
                    answer = "Дверь уже открыта.";
                } else {
                    answer = "Не могу открыть, мне нужен ключ.";
                }
                break;
            }

            if (g.currentLocation === 18 && thisObject.id === "люк" && !g.flags.isTrapdoorOpened) {
                answer = "Я не представляю, как его открыть. Здесь нет никакой ручки, не за что зацепиться.";
                break;
            }
            answer = "Я не могу это открыть";
            break;
        case "ударь":
            if (g.currentLocation === 7 && thisObject.id === "тролль" && !g.flags.isTrollKilled) {
                if (haveThisObjectId(g, "булава")) {
                    g.flags.isTrollKilled = true;
                    g = changeKnownItemPlace(g, "булава", -1);
                    answer = "В прыжке я вломил троллю булавой прямо промеж глаз! Дико заревев, искалеченный тролль с торчащей в черепе булавой убежал в лес. Путь на восток свободен.";
                    break;
                } else if (haveThisObjectId(g, "топор")) {
                    answer = "Не стоит с маленьким топориком лезть на большого тролля. Нужно что-то посерьёзнее.";
                    break;
                } else if (haveThisObjectId(g, "шест")) {
                    answer = "Я похож на черепашку-ниндзя, чтобы нападать с деревянным шестом на толстого тролля?";
                    break;
                } else {
                    answer = "Нападать на тролля с голыми руками? Нет уж!";
                    break;
                }
            }

            if (g.currentLocation === 5 && thisObject.id === "старушка") {
                if (haveThisObjectId(g, "топор")) {
                    answer = "Вам не кажется, что эта ситуация со старушкой и топором - из другого произведения?";
                    break;
                } else {
                    answer = "Не в моих принципах поднимать руку на женщину.";
                    break;
                }
            }

            if (g.currentLocation === 23 && !g.flags.isWormKilled) {
                answer = "Шкура скального червя настолько твёрдая, что я не смогу повредить её никаким оружием.";
                break;
            }

            if (thisObject.id === "принцесса" && g.currentLocation === 28) {
                answer = "Я не подниму руку на эту прекрасную девушку!";
                break;
            }

            if (g.currentLocation === 20 && !g.flags.isMonsterKilled) {
                answer = "На такого монстра идти разве что с боевым ледорубом. Но такого у меня точно нет, придётся искать какую-нибудь хитрость.";
                break;
            }

            if (haveThisObjectId(g, "топор")) {
                answer = "Не совсем понятно, что мне нужно сделать. Если хотите что-то порубить топором, то лучше скажите мне РУБИ или РАЗРУБИ.";
                break;
            }
            answer = "Ничего не произошло.";
            break;
        case "говори":
            if (thisObject.id === "старушка" && g.currentLocation === 5) {
                answer = "Старушка рассказывает, что её муж делает лампы, а она их продаёт путникам - такая вещь в путешествии всегда пригодится. Если хотите купить лампу, вам придётся заплатить серебром. Ничего себе цены!";
                break;
            }
            if (thisObject.id === "тролль" && g.currentLocation === 7 && !g.flags.isTrollKilled) {
                answer = "Тролль злобно рычит в ответ.";
                break;
            }
            if (thisObject.id === "монстр" && g.currentLocation === 20 && !g.flags.isMonsterKilled) {
                answer = "У этого чудища нет рта, чтобы разговаривать.";
                break;
            }
            if (thisObject.id === "принцесса" && g.currentLocation === 28) {
                answer = "Она спит, как я с ней поговорю?";
                break;
            }
            answer = "Здесь не с кем говорить.";
            break;
        case "съешь":
            if (thisItem.id === "рыба") {
                if (haveThisObject(g, thisItem)) {
                    answer = "Я эту тухлятину есть не буду.";
                } else {
                    answer = "У меня нет рыбы."
                }
                break;
            }
            answer = "Я не буду это есть.";
            break;
        case "купи":
        case "заплати":
            if ((thisItem.id === "лампа" || thisItem.id === "монета" || thisObject.id === "старушка") && g.currentLocation === 5) {
                if (haveThisObjectId(g, "монета")) {
                    g = changeKnownItemPlace(g, "монета", -1);
                    g = changeKnownItemPlace(g, "лампа", 5);
                    answer = "Я купил у старушки лампу за серебряную монету.";
                    break;
                } else {
                    answer = "У меня нет денег.";
                    break;
                }
            }
            answer = "Я не могу это купить.";
            break;
        case "включи":
            if (thisItem.id === "лампа" && haveThisObject(g, thisItem)) {
                if (g.currentLocation === 20) {
                    answer = "Здесь слишком холодно, лампа не загорится.";
                    break;
                }
                if (!g.flags.isLampEmpty) {
                    g.flags.isLampEmpty = true;
                    if (g.currentLocation === 23 && !g.flags.isWormKilled) {
                        g.flags.isWormKilled = true;
                        answer = "Я включаю лампу, и её яркий свет озаряет шахту. Червь, привыкший к темноте, издаёт кошмарный вопль и уползает в глубины подземелья. Через несколько мгновений лампа тухнет.";
                    } else {
                        answer = "Я включаю лампу, она ярко горит всего несколько мгновений, а потом тухнет.";
                    }
                    break;
                } else {
                    answer = "Я включаю лампу, но ничего не происходит. Кажется, её заряд закончился.";
                    break;
                }
            }
            answer = "У меня нет ничего такого, что включается.";
            break;
        case "высыпь":
            if (thisItem.id === "соль" && haveThisObject(g, thisItem)) {
                if (g.currentLocation === 20 && !g.flags.isMonsterKilled) {
                    g.flags.isMonsterKilled = true;
                    g = changeKnownItemPlace(g, "соль", -1);
                    answer = "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
                    break;
                } else {
                    g = changeKnownItemPlace(g, "соль", -1);
                    answer = "Я рассыпал всю соль. Непонятно, правда, зачем было так делать.";
                    break;
                }
            }
            answer = "Решительно не понимаю, что мне тут рассыпать?";
            break;
        case "брось":
            if (thisItem.id === "соль" && haveThisObject(g, thisItem)) {
                if (g.currentLocation === 20 && !g.flags.isMonsterKilled) {
                    g.flags.isMonsterKilled = true;
                    g = changeKnownItemPlace(g, "соль", -1);
                    answer = "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
                    break;
                } else {
                    g = changeKnownItemPlace(g, "соль", -1);
                    answer = "Я рассыпал всю соль. Непонятно, правда, зачем было так делать.";
                    break;
                }
            }
            if (thisItem.id === "топор" && haveThisObject(g, thisItem)) {
                answer = "Начнём с того, что я не умею метать топоры. И, к тому же, это явно не метательный топорик. Давайте попробуем что-то другое.";
                break;
            }
            if (thisItem.id === "булава" && haveThisObject(g, thisItem)) {
                answer = "Слишком тяжёлая, чтобы метать. Ей надо бить, желательно промеж глаз.";
                break;
            }
            if (thisItem.id === "лампа" && haveThisObject(g, thisItem)) {
                answer = "Я бросаю лампу, и она разбивается в осколки. И зачем нужно было это делать?";
                g = changeKnownItemPlace(g, "лампа", -1);
                break;
            }
            if (haveThisObject(g, thisItem)) {
                g = changeUnknownItemPlace(g, thisItem, g.currentLocation);
                answer = "Вы бросаете предмет, но ничего не происходит.";
                break;
            }
            answer = "У меня нет того, что вы предлагаете мне бросить.";
            break;
        case "заправь":
            if ((thisItem.id === "лампа" || anotherItem.id === "лампа") && haveThisObjectId(g, "лампа")) {
                if (haveThisObjectId(g, "масло")) {
                    g.flags.isLampEmpty = false;
                    answer = "Я залил чуть-чуть масла в лампу.";
                    break;
                } else {
                    answer = "У меня нет ничего, чем я могу заправить лампу";
                    break;
                }
            }
            answer = "Не совсем понимаю, что вы хотите тут зарядить или заправить.";
            break;
        case "смажь":
            if (thisObject.id === "рычаг" && g.currentLocation === 25) {
                if (!g.flags.isLeverOiled && haveThisObjectId(g, "масло")) {
                    g.flags.isLeverOiled = true;
                    g = changeKnownItemPlace(g, "масло", -1);
                    answer = "Я аккуратно смазал рычаг и детали его механизма, потратив всё масло.";
                    break;
                }
                if (g.flags.isLeverOiled) {
                    answer = "Рычаг уже смазан.";
                    break;
                }
                if (!haveThisObjectId(g, "масло")) {
                    answer = "Мне нечем смазать рычаг.";
                    break;
                }
            }
            if (haveThisObjectId(g, "масло")) {
                answer = "Зачем это смазывать? Я просто потрачу масло";
                break;
            }
            answer = "У меня нет масла, чтобы что-то смазывать.";
            break;
        case "нажми":
            if (thisObject.id === "рычаг" && g.currentLocation === 25) {
                if (g.flags.isLeverOiled) {
                    if (!g.flags.isPortcullisOpened) {
                        g.flags.isPortcullisOpened = true;
                    } else {
                        g.flags.isPortcullisOpened = false;
                    }
                    answer = "Я нажал на рычаг. Вдали послышался какой-то лязг";
                    break;
                } else {
                    answer = "Я давлю на рычаг, но он не двигается с места. Слишком тут всё проржавело.";
                    break;
                }
            }
            answer = "Здесь нечего нажимать.";
            break;
        case "поцелуй":
            if (thisObject.id === "принцесса" && g.currentLocation === 28) {
                answer = "Вы целуете принцессу в бледные губы, и её глаза открываются. Вы разбудили принцессу и выиграли игру!";
                // TODO выход на стартовый экран
                break;
            }
            answer = "Я не буду это целовать.";
            break;
        case "разбуди":
            if (thisObject.id === "принцесса" && g.currentLocation === 28) {
                answer = "Я бы рад разбудить её, но как? Есть конкретные предложения?";
                break;
            }
            answer = "Я не совсем понимаю, кого вы тут хотите разбудить.";
            break;
        default:
            answer = "Я не понимаю.";
            break;
    }

    return {
        answer: answer,
        gameData: g
    }
}

export default outputCtrl