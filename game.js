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
        if (g.currentLoc === 11 && g.flags.isDoorOpened) description += " Дверь открыта.";
        // Если тролля не убили
        if (g.currentLoc === 7 && !g.flags.isTrollKilled) description += "<br>Путь на восток преграждает толстый тролль.";

        ////////////////////////////////////////////////////////
        // КОНЕЦ ПРОВЕРКИ УНИКАЛЬНЫХ ЛОКАЦИЙ
        ////////////////////////////////////////////////////////

        description += "<br>";
        if (g.items.some(e => {
                return e.place === g.currentLoc;
            })) {
            description += "<br>Здесь также есть:<br>";
            g.items.forEach(e => {
                if (e.place === g.currentLoc) {
                    description += `- ${e.name}<br>`;
                }
            })
        }
        return description;
    }

    const makeInventory = (g) => {
        let inventory = "Инвентарь:<br><br>";
        if (g.items.some(e => {
                return e.place === 999;
            })) {
            g.items.forEach(e => {
                if (e.place === 999) {
                    inventory += `${e.name}<br>`;
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
    const phraseAnalyze = (inputPhrase) => {
        const result = {};
        const words = inputPhrase.split(/[\s,]+/); // получили массив слов.
        result.verb = words[0];
        result.obj = words[1];
        result.noun = words[words.length - 1];
        return result;
    };

    // Передвижение игрока. На входе - фраза (направление) и g. На выходе - ответ и g
    const playerMove = (g, inputDir) => {
        const gameDirections = g.locations[g.currentLoc].dir;
        const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
        // ищем inputDir в массивах directionTypes, запоминаем индекс
        // находим число, соответствующее этому индексу, в массиве gameDirections
        // если -1, то нельзя пройти
        // иначе проходим
        const index = directionTypes.indexOf(inputDir);
        console.log(index);
        let answer = "Что будете делать?";

        if (gameDirections[index] !== -1) {
            g.currentLoc = gameDirections[index];
            console.log(g.currentLoc);
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
    // g.locations[8].isU = -1;
    const changeDir = (g, location, direction, value) => {
        const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
        const index = directionTypes.indexOf(direction);
        if (index !== -1) {
            g.locations[location].dir[index] = value;
        }
        return g;
    }

    // public
    return {
        inputProcessing: function (g, input) {
            input = input.toLowerCase();
            let answer = "Что будете делать?";
            // здесь мы проводим поверхностный анализ фразы
            // в свич идут все ситуации, для которых не надо анализировать фразу
            // в дефолт идёт новый свич, в котором уже анализируем фразу
            switch (input) {
                case "":
                    answer = "Скажите мне, что делать.";
                    break;
                case "помоги":
                    answer = "Я понимаю команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, ВОЗЬМИ ЛЕСТНИЦУ или НАБЕРИ ВОДЫ В КУВШИН.<br>Используйте команды С Ю З В ВВЕРХ ВНИЗ для передвижения.<br>Команда ОСМОТРИ позволяет получить больше информации о различных объектах.";
                    break;
                case "с":
                case "ю":
                case "в":
                case "з":
                case "вверх":
                case "вниз":
                    const moved = playerMove(g, input);
                    g = moved.g;
                    answer = moved.answer;
                    break;
                case "и":
                    answer = 'Что "И"? Если же вы хотите посмотреть в инвентарь по команде "И", то в этом нет необходимости: весь ваш инвентарь отображается на боковой панели.';
                    break;
                case "иди на хуй":
                case "иди нахуй":
                case "иди в жопу":
                case "иди в пизду":
                    answer = "Иди-ка ты туда же, мой дорогой игрок!";
                    break;
                default:
                    // обрабатываем ввод игрока и производим соответствующее действие
                    // если это не прокатывает, то выводим сообщение "Я не могу этого сделать"
                    const phrase = phraseAnalyze(input);
                    const thisItem = g.items.find(e => e.case === phrase.obj);

                    switch (phrase.verb) {
                        case "иди":
                        case "наверх":
                        case "поднимись":
                        case "спустись":
                            answer = "Для перемещения используйте команды С (идти на север), Ю (идти на юг), В (идти на восток), З (идти на запад), ВВЕРХ (подняться наверх), ВНИЗ (спуститься вниз)";
                            break;
                        case "возьми":
                        case "бери":
                        case "забери":
                            // берём предмет

                            // обработка уникальных для игры событий

                            // если ты в локации с деревом, и к дереву прислонена лестница, то её можешь забрать
                            if (thisItem.name === "лестница" && g.currentLoc === 8 && g.flags.isLadderLeanToTree) {
                                // добавляем лестницу в инвентарь
                                g.items[thisItem.index].place = 999;
                                // меняем флаг isLadderLeanToTree на false
                                g.flags.isLadderLeanToTree = false;
                                // закрываем проход вверх
                                // g.locations[8].isU = -1;
                                g = changeDir(g, 8, "вверх", -1);
                                answer = `Я забрал лестницу.`;
                                break;
                            }

                            // конец обработки уникальных для игры событий

                            if (thisItem === undefined) {
                                answer = `Что взять? Уточните.`;
                            } else if (thisItem.place === g.currentLoc) {
                                g.items[thisItem.index].place = 999;
                                answer = `Я взял ${thisItem.case}.`;
                            } else if (thisItem.place === 999) {
                                answer = `У меня это уже есть!`;
                            } else {
                                answer = `Здесь этого нет, не могу взять.`;
                            }
                            break;
                        case "положи":
                        case "оставь":
                        case "выбрось":
                            // кладём предмет
                            if (thisItem === undefined) {
                                answer = `Что положить? Уточните.`;
                            } else if (thisItem.place === 999) {
                                g.items[thisItem.index].place = g.currentLoc;
                                answer = `Я положил ${thisItem.case}.`;
                            } else if (thisItem.place === g.currentLoc) {
                                answer = `Это и так здесь уже лежит!`;
                            } else {
                                answer = `Не могу выбросить, потому что у меня этого нет.`;
                            }
                            break;
                        case "осмотри":
                        case "изучи":
                            // осматриваем

                            // уникальные ситуации
                            if (phrase.obj === "пропасть" && g.currentLoc === 6) {
                                answer = `Узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие.`;
                                break;
                            }
                            if (phrase.obj === "куст" && g.currentLoc === 14) {
                                answer = "Ветви этого куста похожи на щупальца осминога.";
                                if (!g.flags.isKeyRevealed) {
                                    g.flags.isKeyRevealed = true;
                                    g.items[6].place = 999;
                                    answer += " На одном из таких щупальцев я обнаружил ключ.";
                                }
                                break;
                            }
                            if (phrase.obj === "дрова" && g.items[4].place === 999) {
                                answer = thisItem.desc;
                                if (!g.flags.isAxeRevealed) {
                                    g.flags.isAxeRevealed = true;
                                    g.items[5].place = 999;
                                    answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
                                }
                                break;
                            }
                            if (phrase.obj === "дверь" && g.currentLoc === 11) {
                                g.flags.isDoorOpened ? answer = "Дверь открыта." : answer = "Дверь заперта.";
                                break;
                            }
                            if (phrase.obj === "тролля" && g.currentLoc === 7 && !g.flags.isTrollKilled) {
                                answer = "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
                                break;
                            }
                            if (phrase.obj === "дерево" && g.currentLoc === 8) {
                                answer = "Это невысокое, но очень широкое в обхвате дерево, превратившееся в камень под действием какого-то неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя нишу.";
                                break;
                            }
                            // общие ситуации
                            if (thisItem === undefined) {
                                answer = `Ничего необычного.`;
                            } else if (thisItem.place === 999) {
                                answer = thisItem.desc;
                            } else {
                                answer = `Чтобы внимательно осмотреть предмет, нужно взять его в руки.`;
                            }
                            break;

                            // Здесь прописываем ситуации, соответствующие конкретной игре
                        case "прислони":
                        case "приставь":
                        case "поставь":
                            // если ты в локации с деревом, и у тебя есть лестница, то ты её можешь прислонить к дереву
                            if (thisItem.name === "лестница" && thisItem.place === 999 && g.currentLoc === 8) {
                                // удаляем лестницу из инвентаря
                                g.items[thisItem.index].place = -1;
                                // меняем флаг isLadderLeanToTree на true
                                g.flags.isLadderLeanToTree = true;
                                // открываем проход наверх
                                // g.locations[8].isU = 9;
                                g = changeDir(g, 8, "вверх", 9);
                                answer = `Я прислонил лестницу к дереву.`;
                            } else if (thisItem.place === 999) {
                                answer = `Хм, это делу не поможет.`;
                            } else {
                                answer = `Я могу прислонить только то, что у меня есть.`;
                            }
                            break;
                        case "сломай":
                        case "разломай":
                        case "ломай":
                            // если у тебя есть лестница, то её можно разломать
                            if (thisItem.name === "лестница" && thisItem.place === 999) {
                                // удаляем лестницу из инвентаря
                                g.items[thisItem.index].place = -1;
                                // добавляем в инвентарь шест
                                g.items[3].place = 999;
                                answer = `Я разломал лестницу, так что теперь у меня есть шест.`;
                            } else if (thisItem.place === 999) {
                                answer = `Не буду ломать. Вдруг мне это ещё пригодится?`;
                            } else {
                                answer = `Я не могу это сломать.`;
                            }
                            break;
                        case "перейди":
                        case "пересеки":
                            // если у тебя есть шест, ты можешь пересечь пропасть
                            if (phrase.obj === "пропасть" && g.currentLoc === 6) {
                                if (g.items[3].place === 999) {
                                    answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                                    g.currentLoc = 12;
                                } else {
                                    answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                                }
                            } else if (phrase.obj === "пропасть" && g.currentLoc === 12) {
                                if (g.items[3].place === 999) {
                                    answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                                    g.currentLoc = 6;
                                } else {
                                    answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                                }
                            } else {
                                answer = "Я не могу это сделать."
                            }
                            break;
                        case "залезь":
                        case "заберись":
                            // на дерево можно залезть, если к нему приставлена лестница
                            if (g.currentLoc = 8) {
                                if (g.flags.isLadderLeanToTree) {
                                    g.currentLoc = 9;
                                    answer = "Я залез на дерево по лестнице."
                                } else {
                                    answer = "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться."
                                }
                            } else {
                                answer = "Я туда не полезу."
                            }
                            break;
                        case "руби":
                        case "сруби":
                        case "разруби":
                        case "поруби":
                            // можно попытаться убить тролля, но не получится
                            if (g.currentLoc === 7 && phrase.obj === "тролля" && g.items[5].place === 999) {
                                answer = "Этот топор хорош для колки дров, но в бою будет слабоват и неудобен.";
                                break;
                            }
                            // можно попытаться срубить дерево
                            if (g.currentLoc === 8 && phrase.obj === "дерево" && g.items[5].place === 999) {
                                g.items[5].place = -1;
                                answer = "Я с размаху бью топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и мой топор разлетается на куски.";
                                break;
                            }
                            // можно попытаться срубить куст
                            if (g.currentLoc === 14 && phrase.obj === "куст" && g.items[5].place === 999) {
                                answer = "Я попытался срубить куст, но его ветви чудесным образом отклоняются от лезвия, и я не могу причинить им вреда."
                                break;
                            }
                            if ((g.items[3].place === 999 || g.items[3].place === g.currentLoc) && phrase.obj === "шест" && g.items[5].place === 999) {
                                g.items[3].place = -1;
                                answer = "В ярости я накинулся на шест и порубил его в труху."
                                break;
                            }

                            if ((g.items[4].place === 999 || g.items[4].place === g.currentLoc) && phrase.obj === "дрова" && g.items[5].place === 999) {
                                g.items[4].place = -1;
                                answer = "В ярости я накинулся на вязанку дров и порубил их в щепки. Эх, теперь ведь дровосек расстроится..."
                                break;
                            }

                            if (g.items[5].place !== 999 && g.items[2].place !== 999) {
                                answer = "Чем прикажете рубить?";
                                break;
                            }
                            answer = "Я могу, конечно, порубить хоть всё вокруг, но к успеху не приближусь.";
                            break;
                        case "открой":
                        case "отопри":
                            // дверь в замок можно открыть с помощью ключа
                            if (g.currentLoc === 11 && phrase.obj === "дверь") {
                                if (g.items[6].place === 999 && !g.flags.isDoorOpened) {
                                    g.flags.isDoorOpened = true;
                                    g = changeDir(g, 11, "в", 15);
                                    answer = "Вы открыли дверь ключом.";
                                } else if (g.flags.isDoorOpened) {
                                    answer = "Дверь уже открыта.";
                                } else {
                                    answer = "Не могу открыть, тут нужен ключ.";
                                }
                                break;
                            }
                        case "убей":
                        case "ударь":
                            // тролля можно убить булавой
                            if (g.currentLoc === 7 && phrase.obj === "тролля" && !g.flags.isTrollKilled) {
                                if (g.items[2].place === 999) {
                                    g.flags.isTrollKilled = true;
                                    g = changeDir(g, 7, "в", 10);
                                    answer = "В прыжке я вломил троллю булавой прямо промеж глаз! Дико заревев, искалеченный тролль с торчащей в черепе булавой убежал в лес. Путь на восток свободен.";
                                    break;
                                } else if (g.items[5].place === 999) {
                                    answer = "Не стоит с этим маленьким топориком лезть на большого тролля. Нужно что-то посерьёзнее.";
                                    break;
                                } else if (g.items[3].place === 999) {
                                    answer = "Я похож на черепашку-ниндзя, чтобы нападать с деревянным шестом на толстого тролля?";
                                    break;
                                } else {
                                    answer = "Нападать на тролля с голыми руками? Нет уж!";
                                    break;
                                }
                            }
                            if (g.items[5].place === 999) {
                                answer = "Не совсем понятно, что мне нужно сделать. Если хотите что-то порубить топором, то лучше скажите мне РУБИ или РАЗРУБИ.";
                                break;
                            }
                            answer = "Ничего не произошло.";
                            break;

                        default:
                            answer = "Я не могу этого сделать";
                            break;
                    }
            }
            return {
                answer: answer,
                gameData: g
            }
        }
    }
})();

// GLOBAL APP CONTROLLER
const controller = (function (gameCtrl, wordCtrl) {

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

        // 2. Выполняем действие игрока
        const processed = wordCtrl.inputProcessing(gameDataVar, inputText);
        gameDataVar = processed.gameData;
        outputText = processed.answer;

        // 3. Обновляем экран
        gameCtrl.makeScreen(gameDataVar, outputText);
    };

    let gameDataVar = {
        // Текущая локация
        currentLoc: 0,

        // Список локаций
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
            desc: "Здесь дорога поворачивает с юга на восток. Небольшие холмы окружают дорогу.",
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
            dir: [-1, -1, -1, 11, -1, -1]
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
        }],

        // Предметы
        items: [{
            index: 0,
            name: "лестница",
            case: "лестницу",
            desc: "Это деревянная приставная лестница в полтора метра высотой. Достаточно лёгкая, чтобы носить её с собой, но при этом довольно хлипкая, легко сломать.",
            place: 0
        }, {
            index: 1,
            name: "рыба",
            case: "рыбу",
            desc: "Это красная рыба, уже подгнившая и довольно вонючая. Такую в руках держать неприятно, а с собой таскать - так вообще мерзко.",
            place: 3
        }, {
            index: 2,
            name: "булава",
            case: "булаву",
            desc: "Это короткая булава с шипами. На её рукояти выгравированы слова: СМЕРТЬ ТРОЛЛЯМ.",
            place: 9,
        }, {
            index: 3,
            name: "шест",
            case: "шест",
            desc: "Это шест, который остался от разломанной мною лестницы.",
            place: -1
        }, {
            index: 4,
            name: "дрова",
            case: "дрова",
            desc: "Это вязанка берёзовых дров, довольно тяжёлая.",
            place: 13
        }, {
            index: 5,
            name: "топор",
            case: "топор",
            desc: "Это добротный, хорошо заточенный топор.",
            place: -1
        }, {
            index: 6,
            name: "ключ",
            case: "ключ",
            desc: "Это толстый фигурный ключ из слоновой кости.",
            place: -1
        }],

        // Флаги и триггеры (true или false, как правило)
        flags: {
            isLadderLeanToTree: false,
            isAxeRevealed: false,
            isKeyRevealed: false,
            isDoorOpened: false,
            isTrollKilled: false
        }
    };

    return {
        init: function () {
            console.log('Application has started.');
            gameCtrl.makeScreen(gameDataVar, 'Что будете делать?');
            setupEventListeners();
        }
    };
})(gameController, wordController);

controller.init();