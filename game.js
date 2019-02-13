import {setStartParameters} from './gamedata.js';

// GAME CONTROLLER

const gameController = (function () {

    const makeLocation = (g) => {
        let description = "";
        g.locations.forEach(e => {
            if (e.index === g.currentLoc) {
                description += e.desc;
            }
        })

        ////////////////////////////////////////////////////////
        // СЮДА НАДО ВСТАВИТЬ ПРОВЕРКИ ДЛЯ УНИКАЛЬНЫХ ЛОКАЦИЙ
        ////////////////////////////////////////////////////////

        // Если лестница прислонена к дереву
        if (g.flags.isLadderLeanToTree && g.currentLoc === 8) description += "<br>К дереву приставлена лестница.";
        // Закрыта или открыта замковая дверь
        if (g.currentLoc === 11 && g.flags.isDoorOpened) description += "<br>Дверь открыта.";
        // Если тролля не убили
        if (g.currentLoc === 7 && !g.flags.isTrollKilled) description += "<br>Путь на восток преграждает толстый тролль.";
        // Если решётка опущена
        if (g.currentLoc === 17 && !g.flags.isPortcullisOpened) description += "<br>Решётка опущена - не пройти.";
        // Если решётка поднята
        if (g.currentLoc === 17 && g.flags.isPortcullisOpened) description += "<br>Решётка поднята к потолку.";
        // Если люк открыт
        if (g.currentLoc === 18 && g.flags.isTrapdoorOpened) description += "<br>В полу комнаты дыра, через которую можно спуститься вниз.";
        // Если люк закрыт
        if (g.currentLoc === 18 && !g.flags.isTrapdoorOpened) description += "<br>В полу есть закрытый люк.";
        // Если червь жив
        if (g.currentLoc === 23 && !g.flags.isWormKilled) description += "<br>Вход в южный тоннель преграждает огромный скальный червь.";
        // Если ледяной монстр жив
        if (g.currentLoc === 20 && !g.flags.isMonsterKilled) description += "<br>Северный проход охраняет страшный ледяной монстр.";
        // Если ведьма жива
        if (g.currentLoc === 27 && !g.flags.isWitchKilled) description += "<br>В противоположном конце комнаты вы видите ведьму. Её заклятье летит прямо в вашу сторону, нужно быстро что-то делать!";

        ////////////////////////////////////////////////////////
        // КОНЕЦ ПРОВЕРКИ УНИКАЛЬНЫХ ЛОКАЦИЙ
        ////////////////////////////////////////////////////////

        description += "<br>";
        if (g.objects.some(e => {
                return e.place === g.currentLoc;
            })) {
            description += "<br>Здесь также есть:<br>";
            g.objects.forEach(e => {
                if (e.place === g.currentLoc) {
                    description += `- ${e.id}<br>`;
                }
            })
        }
        return description;
    }

    const makeInventory = (g) => {
        let inventory = "Инвентарь:<br><br>";
        if (g.objects.some(e => {
                return e.place === 999;
            })) {
            g.objects.forEach(e => {
                if (e.place === 999) {
                    inventory += `${e.id}<br>`;
                }
            })
        } else {
            inventory += `пусто<br>`;
        }
        return inventory;
    }

    return {
        makeScreen: function (g, actionText) {
            document.getElementById("screen").innerHTML = makeLocation(g);
            document.getElementById("sidebar").innerHTML = makeInventory(g);
            document.getElementById("action").innerHTML = actionText;
            document.getElementById("input_area").style.display = "block";
        },

        makeStaticScreen: function (text, sidebar, action) {
            document.getElementById("screen").innerHTML = text;
            document.getElementById("sidebar").innerHTML = sidebar;
            document.getElementById("action").innerHTML = action;
            document.getElementById("input_area").style.display = "none";
        }
    };
})();


// WORD ANALYSE CONTROLLER

const wordController = (function () {
    // Передвижение игрока. На входе - фраза (направление) и g. На выходе - ответ и g
    const playerMove = (g, inputDir) => {
        const gameDirections = g.locations[g.currentLoc].dir;
        const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
        const index = directionTypes.indexOf(inputDir);
        let answer = "Что будете делать?";

        if (gameDirections[index] !== -1) {
            g.currentLoc = gameDirections[index];
        } else {
            answer = "Я не могу туда пройти";
        }

        return {
            g: g,
            answer: answer
        }
    };

    // Функция позволяет изменить в Game Data доступность одного из направлений перемещения
    // На входе - (g, номер локации, название направления, на что изменить)
    // На выходе - g
    const changeDir = (g, location, direction, value) => {
        const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
        const index = directionTypes.indexOf(direction);
        if (index !== -1) {
            g.locations[location].dir[index] = value;
        }
        return g;
    }

    // Получаем объект по его id
    const getObjectById = (g, id) => {
        const cur = g.objects.find(e => e.id === id);
        return cur;
    }

    // Проверка: есть ли у героя предмет, который он назвал
    const haveThisItem = (obj) => {
        return obj.place === 999 ? true : false;
    }

    // Проверка: есть ли у героя нужный по условию предмет
    const haveItem = (g, id) => {
        const obj = getObjectById(g, id);
        if (obj === undefined) console.log("Вы неправильно указали ID объекта, проверьте");
        return obj.place === 999 ? true : false;
    }

    // Возвращает местоположение предмета по его id
    const itemPlace = (g, id) => {
        const obj = getObjectById(g, id);
        return obj.place;
    }

    // Меняем место предмета, который указан игроком. Возвращает g. На входе g, предмет, место.
    const changeUnknownItemPlace = (g, obj, plc) => {
        const ind = g.objects.findIndex(e => e === obj);
        g.objects[ind].place = plc;
        return g
    }

    // Меняем место предмета, id которого известен. Возвращает g
    const changeKnownItemPlace = (g, id, plc) => {
        const ind = g.objects.findIndex(e => e.id === id);
        g.objects[ind].place = plc;
        return g
    }

    return {
        inputProcessing: function (g, input) {
            // Main game logic
            let thisItem, anotherItem, thisObject;
            if (input.message !== "Ок") {
                return {
                    answer: input.message,
                    gameData: g
                }
            }
            let answer = "Что будете делать?";

            if (input.item1 === undefined) {
                thisItem = getObjectById(g, "dummyItem");
            } else {
                thisItem = getObjectById(g, input.item1);
            }
            if (input.item2 === undefined) {
                anotherItem = getObjectById(g, "dummyAltItem");
            } else {
                anotherItem = getObjectById(g, input.item2);
            }
            if (input.obj === undefined) {
                thisObject = getObjectById(g, "dummyObject");
            } else {
                thisObject = getObjectById(g, input.obj);
            }

            // Уникальная ситуация с заклятьем, которое выбрасывает из комнаты
            if (g.currentLoc === 27 && !g.flags.isWitchKilled) {
                if (input.verb === "отрази" && thisObject.id === "заклятье" && haveItem(g, "меч")) {
                    g.flags.isWitchKilled = true;
                    g = changeKnownItemPlace(g, "меч", -1);
                    answer = "Я отразил заклятье мечом, и оно ударило прямо в ведьму! Издав истошный крик, ведьма рассыпалась в пыль. К сожалению, меч тоже не уцелел.";
                } else {
                    if (input.verb === "отрази" && thisObject.id === "заклятье" && !haveItem(g, "меч")) {
                        answer = "Мне нечем отразить заклятье.";
                    } else {
                        answer = "Я не успеваю ничего сделать.";
                    }
                    g.currentLoc = 17;
                    answer += " Заклятье ударяет мне в грудь и выкидывает из этой комнаты в комнату с решёткой.";
                }
                return {
                    answer: answer,
                    gameData: g
                }
            }
            // Конец ситуации с ведьмой

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
                    // обработка уникальных событий

                    // конец обработки уникальных событий

                    if (thisItem === {}) {
                        answer = `Что положить? Уточните.`;
                    } else if (haveThisItem(thisItem)) {
                        g = changeUnknownItemPlace(g, thisItem, g.currentLoc);
                        answer = `Ок, положил.`;
                    } else if (thisItem.place === g.currentLoc) {
                        answer = `Это и так здесь уже лежит!`;
                    } else {
                        answer = `Не могу выбросить, потому что у меня этого нет.`;
                    }
                    break;
                case "возьми":
                    // обработка уникальных событий

                    // если ты в локации с деревом, и к дереву прислонена лестница, то её можешь забрать
                    if (thisItem.id === "лестница" && g.currentLoc === 8 && g.flags.isLadderLeanToTree) {
                        // добавляем лестницу в инвентарь
                        g = changeUnknownItemPlace(g, thisItem, 999);
                        // меняем флаг isLadderLeanToTree на false
                        g.flags.isLadderLeanToTree = false;
                        // закрываем проход вверх
                        g = changeDir(g, 8, "вверх", -1);
                        answer = `Я забрал лестницу.`;
                        break;
                    }

                    // конец обработки уникальных событий

                    if (thisItem === {}) {
                        answer = `Что взять? Уточните.`;
                    } else if (thisItem.place === g.currentLoc) {
                        g = changeUnknownItemPlace(g, thisItem, 999);
                        answer = `Ок, взял.`;
                    } else if (thisItem.place === 999) {
                        answer = `У меня это уже есть!`;
                    } else {
                        answer = `Здесь этого нет, не могу взять.`;
                    }
                    break;
                case "осмотри":
                    // обработка уникальных событий
                    if (thisObject.id === "пропасть" && (g.currentLoc === 6 || g.currentLoc === 12)) {
                        answer = `Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.`;
                        break;
                    }
                    if (thisObject.id === "куст" && g.currentLoc === 14) {
                        answer = "Ветви этого куста похожи на щупальца осминога.";
                        if (!g.flags.isKeyRevealed) {
                            g.flags.isKeyRevealed = true;
                            g = changeKnownItemPlace(g, "ключ", 14);
                            answer += " На одном из таких щупальцев я обнаружил ключ.";
                        }
                        break;
                    }
                    if (thisItem.id === "дрова" && haveItem(g, "дрова")) {
                        answer = thisItem.desc;
                        if (!g.flags.isAxeRevealed) {
                            g.flags.isAxeRevealed = true;
                            g = changeKnownItemPlace(g, "топор", g.currentLoc);
                            answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
                        }
                        break;
                    }
                    if (thisObject.id === "дверь" && g.currentLoc === 11) {
                        g.flags.isDoorOpened ? answer = "Дверь открыта." : answer = "Дверь заперта.";
                        break;
                    }
                    if (thisObject.id === "тролль" && g.currentLoc === 7 && !g.flags.isTrollKilled) {
                        answer = "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
                        break;
                    }
                    if (thisObject.id === "дерево" && g.currentLoc === 8) {
                        answer = "Это невысокое, но очень широкое в обхвате дерево, превратившееся в камень под действием какого-то неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя нишу.";
                        break;
                    }
                    if (thisObject.id === "решётка" && g.currentLoc === 17) {
                        g.flags.isPortcullisOpened ? answer = "Решётка поднята к потолку - проход свободен." : answer = "Мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
                        break;
                    }
                    if (thisObject.id === "люк" && g.currentLoc === 18) {
                        g.flags.isTrapdoorOpened ? answer = "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : answer = "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
                        break;
                    }
                    if (thisObject.id === "старушка" && g.currentLoc === 5) {
                        answer = "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";
                        break;
                    }

                    if (thisItem.id === "лестница" && g.flags.isLadderLeanToTree && g.currentLoc === 8) {
                        answer = "Лестница приставлена к дереву. Я могу залезть наверх.";
                        break;
                    }

                    if (thisObject.id === "червь" && g.currentLoc === 23 && !g.flags.isWormKilled) {
                        answer = "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";
                        break;
                    }

                    if (thisObject.id === "монстр" && g.currentLoc === 20 && !g.flags.isMonsterKilled) {
                        answer = "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";
                        break;
                    }

                    if (thisObject.id === "рычаг" && g.currentLoc === 25) {
                        if (g.flags.isLeverOiled) {
                            answer = "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать";
                        } else {
                            answer = "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать.";
                        }
                        break;
                    }

                    if (thisObject.id === "принцесса" && g.currentLoc === 28) {
                        answer = "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";
                        break;
                    }
                    // конец обработки уникальных для игры событий

                    if (itemPlace(g, thisItem.id) === g.currentLoc) {
                        answer = `Чтобы внимательно осмотреть предмет, нужно взять его в руки.`;
                        break;
                    }
                    if (haveThisItem(thisItem)) {
                        answer = thisItem.desc;
                        break;
                    }
                    answer = `Ничего необычного.`;
                    break;
                case "прислони":
                    // если ты в локации с деревом, и у тебя есть лестница, то ты её можешь прислонить к дереву
                    if (thisItem.id === "лестница" && haveThisItem(thisItem) && g.currentLoc === 8) {
                        g = changeKnownItemPlace(g, "лестница", -1);
                        g.flags.isLadderLeanToTree = true;
                        g = changeDir(g, 8, "вверх", 9);
                        answer = `Я прислонил лестницу к дереву.`;
                    } else if (haveThisItem(thisItem)) {
                        answer = `Хм, это делу не поможет.`;
                    } else {
                        answer = `Я могу прислонить только то, что у меня есть.`;
                    }
                    break;
                case "сломай":
                    // если у тебя есть лестница, то её можно разломать
                    if (thisItem.id === "лестница" && haveThisItem(thisItem)) {
                        g = changeKnownItemPlace(g, "лестница", -1);
                        g = changeKnownItemPlace(g, "шест", g.currentLoc);
                        answer = `Я разломал лестницу на куски и получил неплохой длинный шест.`;
                        break;
                    }

                    // Люк можно разломать
                    if (thisObject.id = "люк" && g.currentLoc === 18 && !g.flags.isTrapdoorOpened) {
                        if (haveItem(g, "топор")) {
                            g.flags.isTrapdoorOpened = true;
                            g = changeDir(g, 18, "вниз", 21);
                            answer = "Я разломал топором деревянный люк. Теперь путь вниз открыт.";
                        } else {
                            answer = "У меня нет ничего, чем я могу сломать люк.";
                        }
                        break;
                    }

                    // стандартные ситуации
                    if (haveThisItem(thisItem)) {
                        answer = `Не буду ломать. Вдруг мне это ещё пригодится?`;
                    } else {
                        answer = `Я не могу это сломать.`;
                    }
                    break;
                case "перейди":
                    // если у тебя есть шест, ты можешь пересечь пропасть
                    if (thisObject.id === "пропасть" && g.currentLoc === 6) {
                        if (haveItem(g, "шест")) {
                            answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                            g.currentLoc = 12;
                        } else {
                            answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                        }
                    } else if (thisObject.id === "пропасть" && g.currentLoc === 12) {
                        if (haveItem(g, "шест")) {
                            answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                            g.currentLoc = 6;
                        } else {
                            answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                        }
                    } else {
                        answer = "Я не могу это сделать.";
                    }
                    break;
                case "залезь":
                    // на дерево можно залезть, если к нему приставлена лестница
                    if (g.currentLoc === 8) {
                        if (g.flags.isLadderLeanToTree) {
                            g.currentLoc = 9;
                            answer = "Я залез на дерево по лестнице.";
                        } else {
                            answer = "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться.";
                        }
                    } else {
                        answer = "Я туда не полезу.";
                    }
                    break;
                case "руби":
                    // люк можно разрубить
                    if (g.currentLoc === 18 && thisObject.id === "люк" && haveItem(g, "топор")) {
                        if (!g.flags.isTrapdoorOpened) {
                            g.flags.isTrapdoorOpened = true;
                            g = changeDir(g, 18, "вниз", 21);
                            answer = "Я порубил топором деревянный люк. Теперь путь вниз открыт.";
                        } else {
                            answer = "Здесь уже нет люка.";
                        }
                        break;
                    }
                    // можно попытаться убить тролля или монстра, но не получится
                    if (((g.currentLoc === 7 && thisObject.id === "тролль") || (g.currentLoc === 20 && thisObject.id === "монстр")) && haveItem(g, "топор")) {
                        answer = "Этот топор хорош для колки дров, но в бою будет слабоват и неудобен.";
                        break;
                    }

                    // можно попытаться рубануть скального червя
                    if (g.currentLoc === 23 && !g.flags.isWormKilled && haveItem(g, "топор")) {
                        answer = "Шкура скального червя настолько твёрдая, что её невозможно повредить топором.";
                        break;
                    }
                    // можно попытаться срубить дерево
                    if (g.currentLoc === 8 && thisObject.id === "дерево" && haveItem(g, "топор")) {
                        g = changeKnownItemPlace(g, "топор", -1);
                        answer = "Я с размаху бью топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и мой топор разлетается на куски.";
                        break;
                    }
                    // можно попытаться срубить куст
                    if (g.currentLoc === 14 && thisObject.id === "куст" && haveItem(g, "топор")) {
                        answer = "Я попытался срубить куст, но его ветви чудесным образом отклоняются от лезвия, и я не могу причинить им вреда.";
                        break;
                    }

                    if ((haveItem(g, "шест") || itemPlace(g, "шест") === g.currentLoc) && (thisItem.id === "шест" || anotherItem.id === "шест") && haveItem(g, "топор")) {
                        g = changeKnownItemPlace(g, "шест", -1);
                        answer = "В ярости я накинулся на шест и порубил его в труху.";
                        break;
                    }

                    if ((haveItem(g, "дрова") || itemPlace(g, "дрова") === g.currentLoc) && (thisItem.id === "дрова" || anotherItem.id === "дрова") && haveItem(g, "топор")) {
                        g = changeKnownItemPlace(g, "дрова", -1);
                        answer = "В ярости я накинулся на вязанку дров и порубил их в щепки. Эх, теперь ведь дровосек расстроится...";
                        break;
                    }

                    if (g.currentLoc === 5 && thisObject.id === "старушка" && haveItem(g, "топор")) {
                        answer = "Вам не кажется, что эта ситуация со старушкой и топором - немного из другого произведения?";
                        break;
                    }

                    if (!haveItem(g, "топор") && !haveItem(g, "меч")) {
                        answer = "Чем прикажете рубить?";
                        break;
                    }
                    answer = "Я могу, конечно, порубить хоть всё вокруг, но к успеху не приближусь.";
                    break;
                case "открой":
                    // дверь в замок можно открыть с помощью ключа
                    if (g.currentLoc === 11 && thisObject.id === "дверь") {
                        if (haveItem(g, "ключ") && !g.flags.isDoorOpened) {
                            g.flags.isDoorOpened = true;
                            g = changeDir(g, 11, "в", 15);
                            answer = "Вы открыли дверь ключом.";
                        } else if (g.flags.isDoorOpened) {
                            answer = "Дверь уже открыта.";
                        } else {
                            answer = "Не могу открыть, мне нужен ключ.";
                        }
                        break;
                    }
                    // а вот люк открыть никак нельзя
                    if (g.currentLoc === 18 && thisObject.id === "люк" && !g.flags.isTrapdoorOpened) {
                        answer = "Я не представляю, как его открыть. Здесь нет никакой ручки, не за что зацепиться.";
                        break;
                    }
                    answer = "Я не могу это открыть";
                    break;
                case "ударь":
                    // тролля можно убить булавой
                    if (g.currentLoc === 7 && thisObject.id === "тролль" && !g.flags.isTrollKilled) {
                        if (haveItem(g, "булава")) {
                            g.flags.isTrollKilled = true;
                            g = changeDir(g, 7, "в", 10);
                            g = changeKnownItemPlace(g, "булава", -1);
                            answer = "В прыжке я вломил троллю булавой прямо промеж глаз! Дико заревев, искалеченный тролль с торчащей в черепе булавой убежал в лес. Путь на восток свободен.";
                            break;
                        } else if (haveItem(g, "топор")) {
                            answer = "Не стоит с маленьким топориком лезть на большого тролля. Нужно что-то посерьёзнее.";
                            break;
                        } else if (haveItem(g, "шест")) {
                            answer = "Я похож на черепашку-ниндзя, чтобы нападать с деревянным шестом на толстого тролля?";
                            break;
                        } else {
                            answer = "Нападать на тролля с голыми руками? Нет уж!";
                            break;
                        }
                    }

                    // можно попробовать напасть на старушку
                    if (g.currentLoc === 5 && thisObject.id === "старушка") {
                        if (haveItem(g, "топор")) {
                            answer = "Вам не кажется, что эта ситуация со старушкой и топором - из другого произведения?";
                            break;
                        } else {
                            answer = "Не в моих принципах поднимать руку на женщину.";
                            break;
                        }
                    }

                    // можно попробовать убить червя
                    if (g.currentLoc === 23 && !g.flags.isWormKilled) {
                        answer = "Шкура скального червя настолько твёрдая, что я не смогу повредить её никаким оружием.";
                        break;
                    }

                    // можно попробовать ударить принцессу
                    if (thisObject.id === "принцесса" && g.currentLoc === 28) {
                        answer = "Я не подниму руку на эту прекрасную девушку!";
                        break;
                    }

                    // можно попробовать убить монстра
                    if (g.currentLoc === 20 && !g.flags.isMonsterKilled) {
                        answer = "На такого монстра идти разве что с боевым ледорубом. Но такого у меня точно нет, придётся искать какую-нибудь хитрость.";
                        break;
                    }

                    // общий случай для топора
                    if (haveItem(g, "топор")) {
                        answer = "Не совсем понятно, что мне нужно сделать. Если хотите что-то порубить топором, то лучше скажите мне РУБИ или РАЗРУБИ.";
                        break;
                    }
                    answer = "Ничего не произошло.";
                    break;
                case "говори":
                    if (thisObject.id === "старушка" && g.currentLoc === 5) {
                        answer = "Старушка рассказывает, что её муж делает лампы, а она их продаёт путникам - такая вещь в путешествии всегда пригодится. Если хотите купить лампу, вам придётся заплатить серебром. Ничего себе цены!";
                        break;
                    }
                    if (thisObject.id === "тролль" && g.currentLoc === 7 && !g.flags.isTrollKilled) {
                        answer = "Тролль злобно рычит в ответ.";
                        break;
                    }
                    if (thisObject.id === "монстр" && g.currentLoc === 20 && !g.flags.isMonsterKilled) {
                        answer = "У этого чудища нет рта, чтобы разговаривать.";
                        break;
                    }
                    if (thisObject.id === "принцесса" && g.currentLoc === 28) {
                        answer = "Она спит, как я с ней поговорю?";
                        break;
                    }
                    answer = "Здесь не с кем говорить.";
                    break;
                case "съешь":
                    // можно попробовать съесть рыбу
                    if (thisItem.id === "рыба") {
                        if (haveThisItem(thisItem)) {
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
                    if ((thisItem.id === "лампа" || thisItem.id === "монета" || thisObject.id === "старушка") && g.currentLoc === 5) {
                        if (haveItem(g, "монета")) {
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
                    if (thisItem.id === "лампа" && haveThisItem(thisItem)) {
                        if (g.currentLoc === 20) {
                            answer = "Здесь слишком холодно, лампа не загорится.";
                            break;
                        }
                        if (!g.flags.isLampEmpty) {
                            g.flags.isLampEmpty = true;
                            if (g.currentLoc === 23 && !g.flags.isWormKilled) {
                                g.flags.isWormKilled = true;
                                g = changeDir(g, 23, "ю", 24);
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
                    if (thisItem.id === "соль" && haveThisItem(thisItem)) {
                        if (g.currentLoc === 20 && !g.flags.isMonsterKilled) {
                            g.flags.isMonsterKilled = true;
                            g = changeKnownItemPlace(g, "соль", -1);
                            g = changeDir(g, 20, "с", 25);
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
                    if (thisItem.id === "соль" && haveThisItem(thisItem)) {
                        if (g.currentLoc === 20 && !g.flags.isMonsterKilled) {
                            g.flags.isMonsterKilled = true;
                            g = changeKnownItemPlace(g, "соль", -1);
                            g = changeDir(g, 20, "с", 25);
                            answer = "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
                            break;
                        } else {
                            g = changeKnownItemPlace(g, "соль", -1);
                            answer = "Я рассыпал всю соль. Непонятно, правда, зачем было так делать.";
                            break;
                        }
                    }
                    if (thisItem.id === "топор" && haveThisItem(thisItem)) {
                        answer = "Начнём с того, что я не умею метать топоры. И, к тому же, это явно не метательный топорик. Давайте попробуем что-то другое.";
                        break;
                    }
                    if (thisItem.id === "булава" && haveThisItem(thisItem)) {
                        answer = "Слишком тяжёлая, чтобы метать. Ей надо бить, желательно промеж глаз.";
                        break;
                    }
                    if (thisItem.id === "лампа" && haveThisItem(thisItem)) {
                        answer = "Я бросаю лампу, и она разбивается в осколки. И зачем нужно было это делать?";
                        g = changeKnownItemPlace(g, "лампа", -1);
                        break;
                    }
                    if (haveThisItem(thisItem)) {
                        g = changeUnknownItemPlace(g, thisItem, g.currentLoc);
                        answer = "Вы бросаете предмет, но ничего не происходит.";
                        break;
                    }
                    answer = "У меня нет того, что вы предлагаете мне бросить.";
                    break;
                case "заправь":
                    if ((thisItem.id === "лампа" || anotherItem.id === "лампа") && haveItem(g, "лампа")) {
                        if (haveItem(g, "масло")) {
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
                    if (thisObject.id === "рычаг" && g.currentLoc === 25) {
                        if (!g.flags.isLeverOiled && haveItem(g, "масло")) {
                            g.flags.isLeverOiled = true;
                            g = changeKnownItemPlace(g, "масло", -1);
                            answer = "Я аккуратно смазал рычаг и детали его механизма, потратив всё масло.";
                            break;
                        }
                        if (g.flags.isLeverOiled) {
                            answer = "Рычаг уже смазан.";
                            break;
                        }
                        if (!haveItem(g, "масло")) {
                            answer = "Мне нечем смазать рычаг.";
                            break;
                        }
                    }
                    if (haveItem(g, "масло")) {
                        answer = "Зачем это смазывать? Я просто потрачу масло";
                        break;
                    }
                    answer = "У меня нет масла, чтобы что-то смазывать.";
                    break;
                case "нажми":
                    if (thisObject.id === "рычаг" && g.currentLoc === 25) {
                        if (g.flags.isLeverOiled) {
                            if (!g.flags.isPortcullisOpened) {
                                // решётка открывается
                                g.flags.isPortcullisOpened = true;
                                g = changeDir(g, 17, "с", 27);
                            } else {
                                // решётка закрывается
                                g.flags.isPortcullisOpened = false;
                                g = changeDir(g, 17, "с", -1);
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
                    if (thisObject.id === "принцесса" && g.currentLoc === 28) {
                        answer = "Вы целуете принцессу в бледные губы, и её глаза открываются. Вы разбудили принцессу и выиграли игру!";
                        // TODO выход на стартовый экран
                        break;
                    }
                    answer = "Я не буду это целовать.";
                    break;
                case "разбуди":
                    if (thisObject.id === "принцесса" && g.currentLoc === 28) {
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
    }
})();

const inputAnalyzeController = (function () {
    return {
        result: function (data, input) {
            const verbs = data.verbs;
            const objects = data.objects;
            const adjectives = data.adjectives;
            let isSecondItem = false;
            let verb, item1, item2, nonitem, object;
            let message = "Ок";

            const isItem = (ob) => {
                if (ob !== undefined) {
                    const current = objects.find(e => e.id === ob);
                    return current.item;
                }
                return undefined;
            }

            const seekWord = (type, word) => {
                for (let j of type) {
                    const currentForms = j.forms;
                    for (let k of currentForms) {
                        if (k === word) {
                            return j.id;
                        }
                    }
                }
            }

            const seekAdjId = (type, id) => {
                for (let n of type) {
                    const adjId = n.adjective;
                    if (id === adjId) {
                        return n.id;
                    }
                }
            }


            const isAdjective = (word) => {
                const result = seekWord(adjectives, word);
                return result !== undefined ? true : false;
            }
            if (input.length === 0) {
                message = "Что мне делать?";
            }
            input = input.toLowerCase(); // словарь к игре - только строчными буквами
            const words = input.split(/[\s,]+/);

            for (let i = 0; i < words.length; i += 1) {
                // Первым идёт глагол
                if (i === 0) {
                    const pVerb = seekWord(verbs, words[i]);
                    if (pVerb !== undefined) verb = pVerb;
                } else {
                    const pObject = seekWord(objects, words[i]);
                    // проверяем, предыдущее слово - прилагательное?
                    if (isAdjective(words[i - 1])) {
                        const pAdjective = seekWord(adjectives, words[i - 1]);
                        if (pObject !== undefined) {
                            const verifObj = seekAdjId(objects, pAdjective);
                            object = verifObj !== undefined ? verifObj : pObject;
                        }
                    } else {
                        // если у слова есть свойство adjective, а игрок не указал это, нужно вернуть ему служебное сообщение
                        const thisObject = objects.find(e => e.id === pObject);
                        if (pObject !== undefined) {
                            if ("adjective" in thisObject) message = `Уточните прилагательное для слова "${words[i]}".`;
                            else object = pObject;
                        }
                    }
                    // здесь мы проверяем, объект - предмет или не предмет
                    if (object !== undefined) {
                        if (isItem(object)) {
                            if (!isSecondItem) {
                                isSecondItem = true;
                                item1 = object;
                                object = undefined;
                            } else {
                                item2 = object;
                            }
                        } else {
                            nonitem = object;
                        }
                    }
                }
            }

            return {
                verb: verb,
                obj: nonitem,
                item1: item1,
                item2: item2,
                message: message
            }
        }
    }
})();

// GLOBAL APP CONTROLLER
// TODO: start and end screens

const controller = (function (gameCtrl, wordCtrl, inputAnalyzeCtrl) {
    const userInput = () => {

        // 1. Получаем фразу, которую ввёл игрок
        const inputText = document.getElementById("input_field").value;
        document.getElementById("input_field").value = "";

        // 2. Обрабатываем фразу через анализатор
        const words = inputAnalyzeCtrl.result(g, inputText);

        // 3. Выполняем действие игрока
        const processed = wordCtrl.inputProcessing(g, words);
        g = processed.gameData;
        const outputText = processed.answer;

        // 4. Обновляем экран
        gameCtrl.makeScreen(g, outputText);
    };
/*
    const startScreen = (g) => {
        g = setStartParameters();
        gameCtrl.makeStaticScreen('Из уст в уста ходит легенда о том, что в далёком королевстве есть замок, окружённый мрачным лесом. Много лет назад тем королевством правил мудрый король, у которого была красавица-дочь и волшебный меч, способный разрушить любые злые чары. Никто не мог одолеть армию короля силой или колдовством.<br><br>И вот прознала о могуществе правителя злая ведьма. Обернулась она красавицей и очаровала короля, да так, что спустя пару недель сыграли они свадьбу. В брачную ночь подарила она королю неземные ласки, а после, когда монарх уснул, задушила его. После пробралась она к принцессе и усыпила её вечным сном, а во всех бедах обвинила одного из слуг. И стала править единовластно.<br><br>Да только не захотели люди служить ведьме и покинули замок. С тех пор ничего о тех местах и не слыхать.', '<img src="img/castleman.png">', 'Вы - искатель приключений, который решил вернуть добро в земли далёкого королевства. Ваше путешествие начинается на самом краю леса, в заброшенной хижине дровосека...<br><span style="color: yellow;">В игре вы в любой момент можете ввести команду "И" для получения инструкций.</span><br><span style="color: cyan;">Нажмите ENTER для начала игры.</span>');
        g.state = "game";
        return g;
    }
*/


    let g = setStartParameters();

    const setupEventListeners = () => {
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                {
                    userInput();
                }
            }
        });
    };

    return {
        init: function () {
            console.log('Application has started.');
            gameCtrl.makeScreen(g, 'Что будете делать?');
            setupEventListeners();
        }
    };
})(gameController, wordController, inputAnalyzeController);

controller.init();