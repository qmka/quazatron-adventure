// GAME CONTROLLER

const gameController = (function () {

    const makeLocation = (gamedata) => {
        let description = "";
        gamedata.locations.forEach(e => {
            if (e.index === gamedata.currentLoc) {
                description += e.desc;
            }
        })

        ////////////////////////////////////////////////////////
        // СЮДА НАДО ВСТАВИТЬ ПРОВЕРКИ ДЛЯ УНИКАЛЬНЫХ ЛОКАЦИЙ
        ////////////////////////////////////////////////////////

        // Если лестница прислонена к дереву
        if (gamedata.flags.isLadderLeanToTree && gamedata.currentLoc === 8) description += "<br>К дереву приставлена лестница.";

        ////////////////////////////////////////////////////////
        // КОНЕЦ ПРОВЕРКИ УНИКАЛЬНЫХ ЛОКАЦИЙ
        ////////////////////////////////////////////////////////

        description += "<br>";
        if (gamedata.items.some(e => {
                return e.place === gamedata.currentLoc;
            })) {
            description += "<br>Здесь также есть:<br>";
            gamedata.items.forEach(e => {
                if (e.place === gamedata.currentLoc) {
                    description += `- ${e.name}<br>`;
                }
            })
        }
        return description;
    }

    const makeInventory = (gamedata) => {
        let inventory = "Инвентарь:<br><br>";
        if (gamedata.items.some(e => {
                return e.place === 999;
            })) {
            gamedata.items.forEach(e => {
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
        makeScreen: function (gamedata, actionText) {
            document.getElementById("screen").innerHTML = makeLocation(gamedata);
            document.getElementById("sidebar").innerHTML = makeInventory(gamedata);
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

    // public
    return {
        inputProcessing: function (gamedata, input) {
            input = input.toLowerCase();
            let answer = "Что будете делать?";
            // здесь мы проводим поверхностный анализ фразы
            // в свич идут все ситуации, для которых не надо анализировать фразу
            // в дефолт идёт новый свич, в котором уже анализируем фразу
            switch (input) {
                case "":
                    answer = "Скажите мне, что делать";
                    break;
                case "помоги":
                    answer = "Я понимаю команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, ВОЗЬМИ ЛЕСТНИЦУ или НАБЕРИ ВОДЫ В КУВШИН.<br>Используйте команды С Ю З В ВВЕРХ ВНИЗ для передвижения.";
                    break;
                case "с":
                case "иди на север":
                    if (gamedata.locations[gamedata.currentLoc].isN !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isN;
                    } else {
                        answer = "Я не могу туда пройти";
                    }
                    break;
                case "ю":
                case "иди на юг":
                    if (gamedata.locations[gamedata.currentLoc].isS !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isS;
                    } else {
                        answer = "Я не могу туда пройти";
                    }
                    break;
                case "в":
                case "иди на восток":
                    if (gamedata.locations[gamedata.currentLoc].isE !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isE;
                    } else {
                        answer = "Я не могу туда пройти";
                    }
                    break;
                case "з":
                case "иди на запад":
                    if (gamedata.locations[gamedata.currentLoc].isW !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isW;
                    } else {
                        answer = "Я не могу туда пройти";
                    }
                    break;
                case "вверх":
                case "наверх":
                    if (gamedata.locations[gamedata.currentLoc].isU !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isU;
                    } else {
                        answer = "Я не могу туда пройти";
                    }
                    break;
                case "вниз":
                    if (gamedata.locations[gamedata.currentLoc].isD !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isD;
                    } else {
                        answer = "Я не могу туда пройти";
                    }
                    break;
                case "и":
                    answer = "У меня в инвентаре: <br>";
                    if (gamedata.items.some(e => {
                            return e.place === 999;
                        })) {
                        gamedata.items.forEach(e => {
                            if (e.place === 999) {
                                answer += `- ${e.name}<br>`;
                            }
                        })
                    } else {
                        answer += `- пусто<br>`;
                    }
                    answer += "<br>Что дальше?";
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
                    const thisItem = gamedata.items.find(e => e.case === phrase.obj);

                    switch (phrase.verb) {
                        case "возьми":
                        case "бери":
                        case "забери":
                            // берём предмет

                            // обработка уникальных для игры событий

                            // если ты в локации с деревом, и к дереву прислонена лестница, то её можешь забрать
                            if (thisItem.name === "лестница" && gamedata.currentLoc === 8 && gamedata.flags.isLadderLeanToTree) {
                                // добавляем лестницу в инвентарь
                                gamedata.items[thisItem.index].place = 999;
                                // меняем флаг isLadderLeanToTree на false
                                gamedata.flags.isLadderLeanToTree = false;
                                // закрываем проход вверх
                                gamedata.locations[8].isU = -1;
                                answer = `Я забрал лестницу.`;
                                break;
                            }

                            // конец обработки уникальных для игры событий
                            if (thisItem === undefined) {
                                answer = `Что взять? Уточните.`;
                            } else if (thisItem.place === gamedata.currentLoc) {
                                gamedata.items[thisItem.index].place = 999;
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
                                gamedata.items[thisItem.index].place = gamedata.currentLoc;
                                answer = `Я положил ${thisItem.case}.`;
                            } else if (thisItem.place === gamedata.currentLoc) {
                                answer = `Это и так здесь уже лежит!`;
                            } else {
                                answer = `Не могу выбросить, потому что у меня этого нет.`;
                            }
                            break;
                        case "осмотри":
                        case "изучи":
                            // осматриваем

                            // уникальные ситуации
                            if (phrase.obj === "пропасть" && gamedata.currentLoc === 6) {
                                answer = `Узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие.`;
                                break;
                            }
                            // общие ситуации
                            if (thisItem === undefined) {
                                answer = `Ничего необычного.`;
                            } else if (thisItem.place === 999) {
                                answer = thisItem.desc;
                            } else {
                                answer = `У меня нет этого, так что и осматривать нечего.`;
                            }
                            break;

                            // Здесь прописываем ситуации, соответствующие конкретной игре
                        case "прислони":
                        case "приставь":
                            // если ты в локации с деревом, и у тебя есть лестница, то ты её можешь прислонить к дереву
                            if (thisItem.name === "лестница" && thisItem.place === 999 && gamedata.currentLoc === 8) {
                                // удаляем лестницу из инвентаря
                                gamedata.items[thisItem.index].place = -1;
                                // меняем флаг isLadderLeanToTree на true
                                gamedata.flags.isLadderLeanToTree = true;
                                // открываем проход наверх
                                gamedata.locations[8].isU = 9;
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
                                gamedata.items[thisItem.index].place = -1;
                                // добавляем в инвентарь шест
                                gamedata.items[3].place = 999;
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
                            if (phrase.obj === "пропасть" && gamedata.currentLoc === 6) {
                                if (gamedata.items[3].place === 999) {
                                    answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                                    gamedata.currentLoc = 12;
                                } else {
                                    answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
                                }
                            } else if (phrase.obj === "пропасть" && gamedata.currentLoc === 12) {
                                if (gamedata.items[3].place === 999) {
                                    answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                                    gamedata.currentLoc = 6;
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
                            if (gamedata.currentLoc = 8) {
                                if (gamedata.flags.isLadderLeanToTree) {
                                    gamedata.currentLoc = 9;
                                    answer = "Я залез на дерево по лестнице."
                                } else {
                                    answer = "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться."
                                }
                            } else {
                                answer = "Я туда не полезу."
                            }
                            break;
                        default:
                            answer = "Я не могу этого сделать";
                            break;
                    }
            }
            return {
                answer: answer,
                gameData: gamedata
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
            desc: "Вы находитесь в ветхой хижине. Сквозь открытую дверь на севере струится солнечный свет.",
            isN: 1,
            isE: -1,
            isS: -1,
            isW: -1,
            isU: -1,
            isD: -1
        }, {
            index: 1,
            desc: "Вы стоите на просёлочной дороге с поросшими травой обочинами. Дорога ведёт на север, а на юге виднеется хижина.",
            isN: 2,
            isE: -1,
            isS: 0,
            isW: -1,
            isU: -1,
            isD: -1
        }, {
            index: 2,
            desc: "Здесь дорога поворачивает с юга на восток. Небольшие холмы окружают дорогу.",
            isN: -1,
            isE: 3,
            isS: 1,
            isW: -1,
            isU: -1,
            isD: -1
        }, {
            index: 3,
            desc: "Вы на заезженной песчаной просёлочной дороге, которая граничит с зелёным пастбищем. Дорога ведёт с запада на восток.",
            isN: -1,
            isE: 4,
            isS: -1,
            isW: 2,
            isU: -1,
            isD: -1
        }, {
            index: 4,
            desc: "Вы на пыльной тропе, огибающей край Бирвудского леса. Издалека доносится слабый шелест листвы. Отсюда можно пойти на север, на запад и на юг.",
            isN: 8,
            isE: -1,
            isS: 5,
            isW: 3,
            isU: -1,
            isD: -1
        }, {
            index: 5,
            desc: "В этом месте дорога поворачивает с севера на восток. Небольшая, еле заметная тропинка ответвляется от дороги на юг.<br>У дороги стоит старушка, продающая лампы.",
            isN: 4,
            isE: 7,
            isS: 6,
            isW: -1,
            isU: -1,
            isD: -1
        }, {
            index: 6,
            desc: "Вы стоите на краю страшной, бездонной пропасти. Туго натянутая верёвка пересекает расщелину. По ней можно перейти пропасть, но она выглядит слишком тонкой и опасной. На север от пропасти ведёт тропинка.",
            isN: 5,
            isE: -1,
            isS: -1,
            isW: -1,
            isU: -1,
            isD: -1
        }, {
            index: 7,
            desc: "Вы на дороге, ведущей с запада на восток через тёмный Бирвудский лес. Сверху доносятся вороньи крики.",
            isN: -1,
            isE: 10,
            isS: -1,
            isW: 5,
            isU: -1,
            isD: -1
        }, {
            index: 8,
            desc: "Вы стоите около огромного каменного дерева, совершенно лишённого веток. Дорога здесь кончается, выход только на юг.",
            isN: -1,
            isE: -1,
            isS: 4,
            isW: -1,
            isU: -1,
            isD: -1
        }, {
            index: 9,
            desc: "Вы в каменной комнате, вырубленной в гигантском окаменевшем дереве. Толстый слой пыли покрывает пол. Путь отсюда только вниз.",
            isN: -1,
            isE: -1,
            isS: -1,
            isW: -1,
            isU: -1,
            isD: 8
        }, {
            index: 10,
            desc: "Вы на восточной опушке Бирвудского леса. Жители окрестных деревень не смеют даже приближаться сюда. Далеко на востоке вы можете разглядеть замок. Вы можете пройти на запад или на восток по заросшей травой дороге.",
            isN: -1,
            isE: -1,
            isS: -1,
            isW: 7,
            isU: -1,
            isD: -1
        }, {
            index: 11,
            desc: "Вы снаружи зловеще выглядящего замка Камелот. Величественное ранее знамя теперь изорвано в клочья и истрёпано ветрами. Большая дверь из слоновой кости на востоке - единственный вход.",
            isN: -1,
            isE: -1,
            isS: -1,
            isW: 11,
            isU: -1,
            isD: -1
        }, {
            index: 12,
            desc: "Вы на краю Бирвудского леса. На севере верёвка пересекает ужасное ущелье. На юг от пропасти ведёт дорога.",
            isN: -1,
            isE: -1,
            isS: 13,
            isW: -1,
            isU: -1,
            isD: -1
        }],

        // Предметы
        items: [{
            index: 0,
            name: "лестница",
            case: "лестницу",
            desc: "Это деревянная приставная лестница в полтора метра высотой. Достаточно лёгкая, чтобы носить её с собой.",
            place: 0
        }, {
            index: 1,
            name: "рыба",
            case: "рыбу",
            desc: "Это красная рыба, уже подгнившая и довольно вонючая. Такую в руках держать неприятно, а с собой таскать - так вообще мерзко.",
            place: 3
        }, {
            index: 2,
            name: "меч",
            case: "меч",
            desc: "Это короткий меч. На его эфесе выгравированы слова: УДАЧИ! МЕРЛИН.",
            place: 9,
        }, {
            index: 3,
            name: "шест",
            case: "шест",
            desc: "Это шест, который остался от разломанной мною лестницы.",
            place: -1
        }],

        // Флаги и триггеры (true или false, как правило)
        flags: {
            isLadderLeanToTree: false
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