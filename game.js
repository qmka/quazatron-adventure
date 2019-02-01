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

    return {
        // makeScreen
        makeScreen: function (gamedata, actionText) {
            document.getElementById("screen").innerHTML = makeLocation(gamedata) + "<br>" + actionText;
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
            const output = {};
            input = input.toLowerCase();
            output.action = "Что будете делать?";
            // здесь мы проводим поверхностный анализ фразы
            // в свич идут все ситуации, для которых не надо анализировать фразу
            // в дефолт идёт новый свич, в котором уже анализируем фразу
            switch (input) {
                case "":
                    output.action = "Скажите мне, что делать";
                    break;
                case "с":
                case "иди на север":
                    if (gamedata.locations[gamedata.currentLoc].isN !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isN;
                    } else {
                        output.action = "Я не могу туда пройти";
                    }
                    break;
                case "ю":
                case "иди на юг":
                    if (gamedata.locations[gamedata.currentLoc].isS !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isS;
                    } else {
                        output.action = "Я не могу туда пройти";
                    }
                    break;
                case "в":
                case "иди на восток":
                    if (gamedata.locations[gamedata.currentLoc].isE !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isE;
                    } else {
                        output.action = "Я не могу туда пройти";
                    }
                    break;
                case "з":
                case "иди на запад":
                    if (gamedata.locations[gamedata.currentLoc].isW !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isW;
                    } else {
                        output.action = "Я не могу туда пройти";
                    }
                    break;
                case "вверх":
                    if (gamedata.locations[gamedata.currentLoc].isU !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isU;
                    } else {
                        output.action = "Я не могу туда пройти";
                    }
                    break;
                case "вниз":
                    if (gamedata.locations[gamedata.currentLoc].isD !== -1) {
                        gamedata.currentLoc = gamedata.locations[gamedata.currentLoc].isD;
                    } else {
                        output.action = "Я не могу туда пройти";
                    }
                    break;
                case "и":
                    output.action = "У меня в инвентаре: <br>";
                    if (gamedata.items.some(e => {
                            return e.place === 999;
                        })) {
                        gamedata.items.forEach(e => {
                            if (e.place === 999) {
                                output.action += `- ${e.name}<br>`;
                            }
                        })
                    } else {
                        output.action += `- пусто<br>`;
                    }
                    output.action += "<br>Что дальше?";
                    break;
                case "иди на хуй":
                case "иди нахуй":
                case "иди в жопу":
                case "иди в пизду":
                    output.action = "Конечно, персонажа текстовой игры легко куда-нибудь послать. Правда, и он может вас послать, что сейчас и сделает, а вы ему ничего за это не сделаете. Иди-ка ты туда же, мой дорогой игрок!";
                    break;
                default:
                    // обрабатываем ввод игрока и производим соответствующее действие
                    // если это не прокатывает, то выводим сообщение "Я не могу этого сделать"
                    const phrase = phraseAnalyze(input);

                    switch (phrase.verb) {
                        case "возьми":
                        case "бери":
                            // берём предмет
                            const thisItem = gamedata.items.find(e => e.case === phrase.obj);
                            if (thisItem === undefined) {
                                output.action = `Что взять? Уточните.`;
                            } else if (thisItem.place === gamedata.currentLoc) {
                                gamedata.items[thisItem.index].place = 999;
                                output.action = `Я взял ${thisItem.case}.`;
                            } else if (thisItem.place === 999) {
                                output.action = `У меня это уже есть!`;
                            } else {
                                output.action = `Здесь этого нет, не могу взять.`;
                            }
                            break;
                        case "положи":
                        case "оставь":
                        case "выбрось":
                            // кладём предмет
                            const dropItem = gamedata.items.find(e => e.case === phrase.obj);
                            if (dropItem === undefined) {
                                output.action = `Что положить? Уточните.`;
                            } else if (dropItem.place === 999) {
                                gamedata.items[dropItem.index].place = gamedata.currentLoc;
                                output.action = `Я положил ${dropItem.case}.`;
                            } else if (dropItem.place === gamedata.currentLoc) {
                                output.action = `Это и так здесь уже лежит!`;
                            } else {
                                output.action = `Не могу выбросить, потому что у меня этого нет.`;
                            }
                            break;
                        case "осмотри":
                        case "изучи":
                            // осматриваем предмет
                            const examItem = gamedata.items.find(e => e.case === phrase.obj);
                            if (examItem === undefined) {
                                output.action = `Ничего необычного.`;
                            } else if (examItem.place === 999) {
                                output.action = examItem.desc;
                            } else {
                                output.action = `У меня нет этого, так что и осматривать нечего.`;
                            }
                            break;
                        default:
                            output.action = "Я не могу этого сделать";
                            break;
                    }
            }
            return {
                output: output,
                gameData: gamedata
            }
        }
    }
})();

// GLOBAL APP CONTROLLER
const controller = (function (gameCtrl, wordCtrl) {

    const setupEventListeners = () => {

        document.querySelector('.input_button').addEventListener('click', userInput);
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
        outputText = processed.output;

        // 3. Обновляем экран
        gameCtrl.makeScreen(gameDataVar, outputText.action);
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
            desc: "Вы стоите на краю страшной, бездонной пропасти. Туго натянутая верёвка пересекает расщелину, но она выглядит опасной. На север от пропасти ведёт тропинка.",
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
            desc: "Вы в каменной комнате, вырубленной в гигантском окаменевшем дереве. Толстый слой пыли покрывает пол.",
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
        }],

        // Флаги и триггеры (true или false, как правило)
        flags: {

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