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
        // makeScreen
        makeScreen: function (g, actionText) {
            document.getElementById("screen").innerHTML = makeLocation(g);
            document.getElementById("sidebar").innerHTML = makeInventory(g);
            document.getElementById("action").innerHTML = actionText;
        }
    };
})();


// WORD ANALYSE CONTROLLER

const wordController = (function () {
    // private

    // Передвижение игрока. На входе - фраза (направление) и g. На выходе - ответ и g
    const playerMove = (g, inputDir) => {
        const gameDirections = g.locations[g.currentLoc].dir;
        const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
        // ищем inputDir в массивах directionTypes, запоминаем индекс
        // находим число, соответствующее этому индексу, в массиве gameDirections
        // если -1, то нельзя пройти
        // иначе проходим
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

    // public
    return {
        inputProcessing: function (g, input) {
            // Main game logic
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
                    answer = "Я понимаю команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, ВОЗЬМИ ЛЕСТНИЦУ или НАБЕРИ ВОДЫ В КУВШИН.<br>Используйте команды С Ю З В ВВЕРХ ВНИЗ для передвижения.<br>Команда ОСМОТРИ позволяет получить больше информации о различных объектах.";
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

                    // конец обработки уникальных для игры событий

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
                    if (thisObject.id === "пропасть" && g.currentLoc === 6) {
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
                        // удаляем лестницу из инвентаря
                        g = changeKnownItemPlace(g, "лестница", -1);
                        // меняем флаг isLadderLeanToTree на true
                        g.flags.isLadderLeanToTree = true;
                        // открываем проход наверх
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
                        // удаляем лестницу из инвентаря
                        g = changeKnownItemPlace(g, "лестница", -1);
                        // показываем в локации шест
                        g = changeKnownItemPlace(g, "шест", g.currentLoc);
                        answer = `Я разломал лестницу, так что теперь у меня есть шест.`;
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
                    // поговорить со старушкой
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
                    answer = "Не совсем понимаю, с кем вы хотите поговорить.";
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
                    answer = "Я не могу это съесть";
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
                    answer = "Здесь нечего включать.";
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
                            answer = "Я попытался нажат на рычаг, но безуспешно. Слишком тут всё проржавело.";
                            break;
                        }
                    }
                    answer = "Здесь нечего нажимать.";
                    break;
                case "поцелуй":
                    if (thisObject.id === "принцесса" && g.currentLoc === 28) {
                        answer = "Вы целуете принцессу в бледные губы, и её глаза открываются. Вы разбудили принцессу и выиграли игру!";
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
    // private

    // public
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
                for (let j = 0; j < type.length; j += 1) {
                    const currentForms = type[j].forms;
                    for (let k = 0; k < currentForms.length; k += 1) {
                        if (currentForms[k] === word) {
                            return type[j].id;
                        }
                    }
                }
            }

            const seekAdjId = (type, id) => {
                for (let n = 0; n < type.length; n += 1) {
                    const adjId = type[n].adjective;
                    if (id === adjId) {
                        return type[n].id;
                    }
                }
            }

            const isAdjective = (word) => {
                const result = seekWord(adjectives, word);
                return result !== undefined ? true : false;
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
const controller = (function (gameCtrl, wordCtrl, inputAnalyzeCtrl) {

    const setupEventListeners = () => {

        // document.querySelector('.input_button').addEventListener('click', userInput);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                userInput();
            }
        });
    };

    const userInput = () => {

        // 1. Получаем фразу, которую ввёл игрок
        const inputText = document.getElementById("input_field").value;
        document.getElementById("input_field").value = "";

        // 2. Обрабатываем фразу через анализатор
        const words = inputAnalyzeCtrl.result(gameDataVar, inputText);

        // 3. Выполняем действие игрока
        const processed = wordCtrl.inputProcessing(gameDataVar, words);
        gameDataVar = processed.gameData;
        outputText = processed.answer;

        // 4. Обновляем экран
        gameCtrl.makeScreen(gameDataVar, outputText);
    };

    let gameDataVar = {
        // Текущая локация
        currentLoc: 0,

        // Локации
        locations: [{
            index: 0,
            desc: '<img src="img/location00.png"><br>Вы находитесь в ветхой хижине. Сквозь открытую дверь на севере струится солнечный свет.',
            dir: [1, -1, -1, -1, -1, -1] // [north, east, south, west, up, down]
        }, {
            index: 1,
            desc: '<img src="img/location01.png"><br>Вы стоите на просёлочной дороге с поросшими травой обочинами. Дорога ведёт на север, а на юге виднеется хижина.',
            dir: [2, -1, 0, -1, -1, -1]
        }, {
            index: 2,
            desc: '<img src="img/location02.png"><br>Здесь дорога поворачивает с юга на восток. Небольшие холмы окружают дорогу.',
            dir: [-1, 3, 1, -1, -1, -1]
        }, {
            index: 3,
            desc: "Вы на заезженной песчаной просёлочной дороге, которая граничит с зелёным пастбищем. Дорога ведёт с запада на восток.",
            dir: [-1, 4, -1, 2, -1, -1]
        }, {
            index: 4,
            desc: "Вы на пыльной тропе, огибающей край Бирвудского леса. Издалека доносится слабый шелест листвы. Отсюда можно пойти на север, на запад и на юг.",
            dir: [8, -1, 5, 3, -1, -1]
        }, {
            index: 5,
            desc: "В этом месте дорога поворачивает с севера на восток. Небольшая, еле заметная тропинка ответвляется от дороги на юг.<br>У дороги стоит старушка, продающая лампы.",
            dir: [4, 7, 6, -1, -1, -1]
        }, {
            index: 6,
            desc: "Вы стоите на краю страшной, бездонной пропасти. Туго натянутая верёвка пересекает расщелину. По ней можно перейти пропасть, но она выглядит слишком тонкой и опасной. На север от пропасти ведёт тропинка.",
            dir: [5, -1, -1, -1, -1, -1]
        }, {
            index: 7,
            desc: "Вы на дороге, ведущей с запада на восток через тёмный Бирвудский лес. Сверху доносятся вороньи крики.",
            dir: [-1, -1, -1, 5, -1, -1]
        }, {
            index: 8,
            desc: "Вы стоите около огромного каменного дерева, совершенно лишённого веток. Дорога здесь кончается, выход только на юг.",
            dir: [-1, -1, 4, -1, -1, -1]
        }, {
            index: 9,
            desc: "Вы в каменной комнате, вырубленной в гигантском окаменевшем дереве. Толстый слой пыли покрывает пол. Путь отсюда только вниз.",
            dir: [-1, -1, -1, -1, -1, 8]
        }, {
            index: 10,
            desc: "Вы на восточной опушке Бирвудского леса. Жители окрестных деревень не смеют даже приближаться сюда. Далеко на востоке вы можете разглядеть замок.<br>Вы можете пройти на запад или на восток по заросшей травой дороге.",
            dir: [-1, 11, -1, 7, -1, -1]
        }, {
            index: 11,
            desc: "Вы снаружи зловеще выглядящего замка Камелот. Величественное ранее знамя теперь изорвано в клочья и истрёпано ветрами. Большая дверь из слоновой кости на востоке - единственный вход.",
            dir: [-1, -1, -1, 10, -1, -1]
        }, {
            index: 12,
            desc: "Вы на краю Бирвудского леса. На севере верёвка пересекает ужасное ущелье. На юг от пропасти ведёт дорога.",
            dir: [-1, -1, 13, -1, -1, -1]
        }, {
            index: 13,
            desc: "Вы в глубине Бирвудского леса. На деревьях полно крошечных жужжащих насекомых. На севере - выход из леса, а на запад уходит узкая тропинка.",
            dir: [12, -1, -1, 14, -1, -1]
        }, {
            index: 14,
            desc: "Вы стоите на заросшей мхом земле под навесом из листьев, пропускающим слабый солнечный свет. Возможный выход только на восток. Рядом растёт странного вида куст.",
            dir: [-1, 13, -1, -1, -1, -1]
        }, {
            index: 15,
            desc: "Вы в крытой галерее замка Камелот. Возможные выходы - на запад и на восток.",
            dir: [-1, 16, -1, 11, -1, -1]
        }, {
            index: 16,
            desc: "Вы в заброшенном банкетном зале. На полу валяется разбитая мебель. Можно идти на запад, на юг и на север.",
            dir: [17, -1, 18, 15, -1, -1]
        }, {
            index: 17,
            desc: "Вы в небольшой тёмной комнате, которая имеет опускную железную решётку, врезанную в северную стену. Если не считать решётки, то возможный выход - только на юг.",
            dir: [-1, -1, 16, -1, -1, -1]
        }, {
            index: 18,
            desc: "Вы в комнате, заваленной мусором. Через мелкие дыры в стене слышны завывания ветра. Можно идти на север и восток.",
            dir: [16, 19, -1, -1, -1, -1]
        }, {
            index: 19,
            desc: "Вы стоите в богато украшенном вестибюле, который покрыт тонким слоем льда. Выходы на востоке и на западе.",
            dir: [-1, 20, -1, 18, -1, -1]
        }, {
            index: 20,
            desc: "Вы в жутко холодной комнате. Всё здесь покрыто толстым слоем льда. Выходы на западе и на севере.",
            dir: [-1, -1, -1, 19, -1, -1]
        }, {
            index: 21,
            desc: "Вы в старой соляной шахте. Мрачный туннель ведёт на юг и на запад. Через отверстие в потолке можно пролезть наверх.",
            dir: [-1, -1, 23, 22, 18, -1]
        }, {
            index: 22,
            desc: "Вы находитесь в западной части шахты. Она выглядит выработанной и заброшенной. Выход ведёт на восток",
            dir: [-1, 21, -1, -1, -1, -1]
        }, {
            index: 23,
            desc: "Вы в южной части шахты. Здесь очень душно. Тоннели ведут на север и на юг.",
            dir: [21, -1, -1, -1, -1, -1]
        }, {
            index: 24,
            desc: "Вы в конце шахты, в тупике. Слышно, как капает вода. Выход отсюда - на север.",
            dir: [23, -1, -1, -1, -1, -1]
        }, {
            index: 25,
            desc: "Вы в комнате, которая когда-то была помещением для охраны. На одной из стен вы можете видеть чудом сохранившийся посреди всей этой разрухи рычаг. Выходы отсюда - на восток и на юг.",
            dir: [-1, 26, 20, -1, -1, -1]
        }, {
            index: 26,
            desc: "Вы в оружейной комнате. Её стены покрыты толстым слоем паутины, а вдоль стен стоят пустые оружейные полки.",
            dir: [-1, -1, -1, 25, -1, -1]
        }, {
            index: 27,
            desc: "Вы в роскошно обставленном зале, обстановка которого резко контрастирует с разрухой в других комнатах. Отсюда можно пройти на юг и на запад.",
            dir: [-1, -1, 17, 28, -1, -1]
        }, {
            index: 28,
            desc: "Вы в маленькой комнате. Сквозь разбитое окно в потолке дует холодный ветер. На кровати в углу спит принцесса, а воздух вокруг наэлектризован от чар. Выход - на востоке.",
            dir: [-1, 27, -1, -1, -1, -1]
        }],

        // Словарь глаголов !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111111111
        verbs: [{
            id: "с",
            forms: ["с"]
        }, {
            id: "в",
            forms: ["в"]
        }, {
            id: "з",
            forms: ["з"]
        }, {
            id: "ю",
            forms: ["ю"]
        }, {
            id: "вверх",
            forms: ["вверх", "наверх", "поднимись"]
        }, {
            id: "вниз",
            forms: ["вниз", "спустись"]
        }, {
            id: "помоги",
            forms: ["помоги", "помощь", "хелп", "команды", "help", "инфо", "и"]
        }, {
            id: "возьми",
            forms: ["возьми", "подними", "бери", "забери"]
        }, {
            id: "положи",
            forms: ["положи", "выбрось", "оставь"]
        }, {
            id: "иди",
            forms: ["иди", "пойди", "топай", "отправляйся"]
        }, {
            id: "брось",
            forms: ["брось", "кидай", "метни"]
        }, {
            id: "говори",
            forms: ["говори", "поговори", "скажи"]
        }, {
            id: "купи",
            forms: ["купи", "приобрети", "покупай"]
        }, {
            id: "заплати",
            forms: ["заплати"]
        }, {
            id: "ударь",
            forms: ["ударь", "убей", "атакуй", "бей"]
        }, {
            id: "руби",
            forms: ["руби", "поруби", "разруби", "заруби", "переруби", "сруби"]
        }, {
            id: "открой",
            forms: ["открой", "отопри"]
        }, {
            id: "залезь",
            forms: ["залезь", "заберись", "лезь", "карабкайся", "вскарабкайся"]
        }, {
            id: "перейди",
            forms: ["перейди", "пересеки"]
        }, {
            id: "сломай",
            forms: ["ломай", "сломай", "разломай", "поломай"]
        }, {
            id: "прислони",
            forms: ["прислони", "приставь", "поставь"]
        }, {
            id: "осмотри",
            forms: ["осмотри", "изучи", "исследуй"]
        }, {
            id: "съешь",
            forms: ["съешь", "ешь", "попробуй", "откуси"]
        }, {
            id: "включи",
            forms: ["включи", "зажги"]
        }, {
            id: "высыпь",
            forms: ["высыпь", "рассыпь", "высыпи", "посыпь"]
        }, {
            id: "заправь",
            forms: ["заправь", "заряди", "залей"]
        }, {
            id: "смажь",
            forms: ["смажь"]
        }, {
            id: "нажми",
            forms: ["нажми", "потяни", "надави", "жми", "тяни", "дёрни"]
        }, {
            id: "отрази",
            forms: ["отрази", "отбей"]
        }, {
            id: "поцелуй",
            forms: ["поцелуй", "целуй"]
        }, {
            id: "разбуди",
            forms: ["разбуди", "буди"]
        }],

        // Словарь объектов !!!!!!!!!!!!!!!!!!!!!!!!!!!!111111111!!!!!!!!!!!!!!!!!!!!!!!!!!
        objects: [{
            id: "лестница",
            forms: ["лестница", "лестницу", "лестницой", "лестнице"],
            item: true,
            desc: "Это деревянная приставная лестница в полтора метра высотой. Достаточно лёгкая, чтобы носить её с собой, но при этом довольно хлипкая, легко сломать.",
            place: 0
        }, {
            id: "рыба",
            forms: ["рыба", "рыбу", "рыбе", "рыбой"],
            item: true,
            desc: "Это красная рыба, уже подгнившая и довольно вонючая. Такую в руках держать неприятно, а с собой таскать - так вообще мерзко.",
            place: 3
        }, {
            id: "булава",
            forms: ["булава", "булавой", "булаве", "булаву"],
            item: true,
            desc: "Это короткая булава с шипами. На её рукояти выгравированы слова: СМЕРТЬ ТРОЛЛЯМ.",
            place: 9,
        }, {
            id: "шест",
            forms: ["шест", "шеста", "шестом", "шесту"],
            item: true,
            desc: "Это шест, который остался от разломанной мною лестницы.",
            place: -1
        }, {
            id: "дрова",
            forms: ["дрова", "дровам", "дров"],
            item: true,
            desc: "Это вязанка берёзовых дров, довольно тяжёлая.",
            place: 13
        }, {
            id: "топор",
            forms: ["топор", "топору", "топора", "топором"],
            item: true,
            desc: "Это добротный, хорошо заточенный топор.",
            place: -1
        }, {
            id: "ключ",
            forms: ["ключ", "ключом", "ключа", "ключу"],
            item: true,
            desc: "Это тяжёлый фигурный ключ из слоновой кости.",
            place: -1
        }, {
            id: "лампа",
            forms: ["лампа", "лампу", "лампы", "лампе", "лампой"],
            item: true,
            desc: "Это одноразовая лампа. При необходимости её можно включить, но, по словам старушки, она горит недолго, хоть и очень ярко.",
            place: -1
        }, {
            id: "соль",
            forms: ["соль", "соли", "солью", "мешочек", "мешочком", "мешочку", "мешочка"],
            item: true,
            desc: "Это соль, упакованная в мешочек, на вид и на вкус вполне обычная.",
            place: 24
        }, {
            id: "масло",
            forms: ["масло", "маслом", "маслу", "масленка", "маслёнка", "масленкой", "маслёнкой", "маслёнку", "масленку", "масленке", "маслёнке"],
            item: true,
            desc: "Это маслёнка с маслом. Пригодится, если в этом разрушенном замке нужно будет что-нибудь смазать.",
            place: 22
        }, {
            id: "меч",
            forms: ["меч", "мечу", "мечом", "меча"],
            item: true,
            desc: "Это длинный обоюдоострый меч. Его эфес украшают две химеры, а поверхность лезвия за долгие годы не утратила своего блеска: в него можно смотреться словно в зеркало.",
            place: 26
        }, {
            id: "монета",
            forms: ["монета", "монету", "монете", "монетой"],
            item: true,
            desc: "Это старая серебряная монета.",
            place: 19
        }, {
            id: "пропасть",
            forms: ["пропасть", "пропасти", "пропастью", "расщелина", "расщелиной", "расщелину", "расщелины", "верёвка", "веревка", "верёвке", "веревке", "верёвку", "веревку", "верёвки", "веревки", "ущелье", "ущелья"],
            item: false
        }, {
            id: "куст",
            forms: ["куст", "куста", "кусту", "кустом"],
            item: false,
        }, {
            id: "ветви",
            forms: ["ветви", "ветвей", "ветвям", "щупальца", "щупалец", "щупальцам"],
            item: false
        }, {
            id: "дверь",
            forms: ["дверь", "двери", "дверью"],
            item: false
        }, {
            id: "тролль",
            forms: ["тролль", "тролля", "троллю", "троллем"],
            item: false
        }, {
            id: "дерево",
            forms: ["дерево", "дереву", "деревом", "дерева"],
            item: false
        }, {
            id: "решётка",
            forms: ["решётка", "решетка", "решётку", "решетку", "решёткой", "решеткой", "решётки", "решетки"],
            item: false
        }, {
            id: "люк",
            forms: ["люк", "люку", "люка", "люком"],
            item: false
        }, {
            id: "старушка",
            forms: ["старушка", "старушку", "старушки", "старушке", "старушкой"],
            item: false
        }, {
            id: "червь",
            forms: ["червь", "червя", "червю", "червяк", "червяка", "червяку"],
            item: false
        }, {
            id: "монстр",
            forms: ["монстр", "монстра", "монстру", "монстре", "монстром"],
            item: false
        }, {
            id: "рычаг",
            forms: ["рычаг", "рычага", "рычагом"],
            item: false
        }, {
            id: "заклятье",
            forms: ["заклятье", "заклинание", "заклятью", "заклятьем", "заклятья"],
            item: false
        }, {
            id: "принцесса",
            forms: ["принцесса", "принцессу", "принцессе", "принцессой", "принцессы"],
            item: false
        }, {
            id: "dummyItem",
            forms: ["dummyItem"],
            item: true,
            desc: "Ничего особенного",
            place: -1
        }, {
            id: "dummyAltItem",
            forms: ["dummyAltItem"],
            item: true,
            desc: "Ничего особенного",
            place: -1
        }, {
            id: "dummyObject",
            forms: ["dummyObject"],
            item: false
        }],

        // Словарь прилагательных
        // В демо-игре отсутствует
        adjectives: [{
            id: "dummy",
            forms: ["kWJMOgEdmy"]
        }],

        // Флаги и триггеры (true или false, как правило)
        flags: {
            isLadderLeanToTree: false,
            isAxeRevealed: false,
            isKeyRevealed: false,
            isDoorOpened: false,
            isTrollKilled: false,
            isPortcullisOpened: false,
            isTrapdoorOpened: false,
            isWormKilled: false,
            isLampEmpty: false,
            isMonsterKilled: false,
            isLeverOiled: false,
            isWitchKilled: false
        }
    };

    const testState = (g) => {

        // тестовое состояние: зашёл в замок
        g.objects[5].place = 999; // топор у игрока
        g.objects[7].place = 999; // лампа у игрока
        g.objects[8].place = 999; // соль у игрока
        g.objects[9].place = 999; // масло у игрока
        g.objects[10].place = 999; // меч у игрока
        g.flags.isAxeRevealed = true; // топор нашёл
        g.flags.isDoorOpened = true; // дверь в замок открыта
        g.flags.isTrollKilled = true; // тролль убит
        g.flags.isTrapdoorOpened = true; // люк открыт
        g.flags.isPortcullisOpened = true; // решетка открыта
        g.currentLoc = 15;
        g.locations[7].dir[1] = 10; // разблокировки недоступных локаций
        g.locations[11].dir[1] = 15;
        g.locations[18].dir[5] = 21;
        g.locations[17].dir[0] = 27;

        return g;

    }

    return {
        init: function () {
            console.log('Application has started.');
            gameDataVar = testState(gameDataVar); // функция позволяет задать начальное значение переменных для тестирования, чтобы не тестировать каждый раз игру сначала 
            gameCtrl.makeScreen(gameDataVar, 'Что будете делать?');
            setupEventListeners();
        }
    };
})(gameController, wordController, inputAnalyzeController);

controller.init();