//////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТЧИКИ СОБЫТИЙ
//////////////////////////////////////////////////////////////////////////////////////////

// функция btnClick забирает введённую пользователем строку и производит нужное действие

const btnClick = () => {
    // берём значение пользователя в inputText и очищаем поле ввода
    var inputText = document.getElementById("input_field").value;
    document.getElementById("input_field").value = "";

    // реагируем на ввод: функция inputProcessing анализирует фразу. На вход она получает inputText, на выходе выдаёт описание локации и экшен в виде объекта, а промежуточно производит всю нужную игровую логику
    outputText = inputProcessing(inputText);

    // генерируем экран
    makeScreen(outputText.location, outputText.action);
}

//////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТЧИК ВВОДА ПОЛЬЗОВАТЕЛЯ
//////////////////////////////////////////////////////////////////////////////////////////

// inputProcessing анализирует фразу
const inputProcessing = (input) => {
    const output = {};
    input = input.toLowerCase();
    output.location = locationNumToText(currentLoc);
    output.action = "Что будете делать?";
    // здесь мы должны проанализировать фразу
    // если направление с, ю, з, в, то отправить в соответствующую функцию смены локации
    // если действие - то в подпрограмму локации, в которой прописаны все эти действия
    // если служебная команда - например "и" (инвентарь) - то в соотв программу
    switch (input) {
        case "":
            output.action = "Скажите мне, что делать";
            break;
        case "с":
        case "иди на север":
            if (locations[currentLoc].isN !== -1) {
                currentLoc = locations[currentLoc].isN;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "ю":
        case "иди на юг":
            if (locations[currentLoc].isS !== -1) {
                currentLoc = locations[currentLoc].isS;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "в":
        case "иди на восток":
            if (locations[currentLoc].isE !== -1) {
                currentLoc = locations[currentLoc].isE;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "з":
        case "иди на запад":
            if (locations[currentLoc].isW !== -1) {
                currentLoc = locations[currentLoc].isW;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "вверх":
            if (locations[currentLoc].isU !== -1) {
                currentLoc = locations[currentLoc].isU;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "вниз":
            if (locations[currentLoc].isD !== -1) {
                currentLoc = locations[currentLoc].isD;
                output.location = locationNumToText(currentLoc);
            } else {
                output.action = "Я не могу туда пройти";
            }
            break;
        case "и":
            output.action = "У меня в инвентаре: <br>";
            if (items.some(e => {
                    return e.place === 999;
                })) {
                items.forEach(e => {
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
            // далее - две функции
            // первая обрабатывает исключительные для каждой локации ситуации ("брось лампу об дерево")
            // если первая не прокатывает, то включаем анализатор фразы, который разбивает её на глагол и существительное
            // и происходит обработка не зависящих от конкретной локации действи ("возьми лампу", "открой коробку").
            // если и это не прокатывает, то выводим сообщение "Я не могу этого сделать"

            // здесь пишем обработчик стандартных ситуаций, в зависимости от глагола
            const phrase = phraseAnalyze(input);
            // запускаем обработчик уникальных для локаций действий (УЛД). На выходе этот обработчик выдаёт объект, содержащий фразу экшена .txt и флаг экшена .flag (true - если фраза сыграла, false - если это стандартная фраза)
            const uld = uldProcessing(phrase);
            output.location = locationNumToText(currentLoc);
            if (uld.flag) {
                // если сработала уникальная ситуация
                output.action = uld.txt;
                return output;
            }
            // если не сработала, то переходим к обработчику неуникальных действий
            // if по глаголу
            if (phrase.verb === "возьми" || phrase.verb === "бери") {
                // берём предмет
                const thisItem = items.find(e => e.case === phrase.obj);
                if (thisItem === undefined) {
                    output.action = `Что взять? Уточните.`;
                } else if (thisItem.place === currentLoc) {
                    items[thisItem.index].place = 999;
                    output.action = `Я взял ${thisItem.case}.`;
                    output.location = locationNumToText(currentLoc);
                } else if (thisItem.place === 999) {
                    output.action = `У меня это уже есть!`;
                } else {
                    output.action = `Здесь этого нет, не могу взять.`;
                }
            } else if (phrase.verb === "положи" || phrase.verb === "брось" || phrase.verb === "оставь" || phrase.verb === "выброси" || phrase.verb === "выбрось" || phrase.verb === "выкинь") {
                // кладём предмет
                const dropItem = items.find(e => e.case === phrase.obj);
                if (dropItem === undefined) {
                    output.action = `Что положить? Уточните.`;
                } else if (dropItem.place === 999) {
                    items[dropItem.index].place = currentLoc;
                    output.action = `Я положил ${dropItem.case}.`;
                    output.location = locationNumToText(currentLoc);
                } else if (dropItem.place === currentLoc) {
                    output.action = `Это и так здесь уже лежит!`;
                } else {
                    output.action = `Не могу выбросить, потому что у меня этого нет.`;
                }
            } else if (phrase.verb === "осмотри" || phrase.verb === "изучи") {
                // осматриваем предмет
                const examItem = items.find(e => e.case === phrase.obj);
                if (examItem === undefined) {
                    output.action = `Ничего необычного.`;
                } else if (examItem.place === 999) {
                    output.action = examItem.desc;
                } else {
                    output.action = `У меня нет этого, так что и осматривать нечего.`;
                }
            } else {
                // если вообще ничего не сработало
                output.action = "Я не могу этого сделать";
            }
    }
    return output;
}


//////////////////////////////////////////////////////////////////////////////////////////
// АНАЛИЗАТОР ФРАЗ
//////////////////////////////////////////////////////////////////////////////////////////

// на вход принимаем фразу, введённую пользователем в формате ГЛАГОЛ + СУЩЕСТВИТЕЛЬНОЕ (+ ПРЕДЛОГ) + СУЩЕСТВИТЕЛЬНОЕ
// на выход выдаём объект, состоящий из .verb, .obj и .noun. предлог не учитывается.

const phraseAnalyze = (inputPhrase) => {
    const result = {};
    const words = inputPhrase.split(/[\s,]+/); // получили массив слов.
    result.verb = words[0];
    result.obj = words[1];
    result.noun = words[words.length - 1];
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////
// ОБРАБОТКА ФРАЗ УНИКАЛЬНЫХ ДЛЯ ЛОКАЦИЙ
//////////////////////////////////////////////////////////////////////////////////////////

// На вход принимает объект из phraseAnalyze. На выходе этот обработчик выдаёт объект, содержащий фразу экшена .txt и флаг экшена .flag (true - если фраза сыграла, false - если это стандартная фраза)

const uldProcessing = (inputPhrase) => {
    // пока логика не придумана, возвращаем так, будто нет уникальных ситуаций !!!!!!!!!!
    const result = {};
    result.flag = false;
    result.txt = "It's a Dummy Text";
    return result;
}

//////////////////////////////////////////////////////////////////////////////////////////
// ГЕНЕРИРУЕМ ЭКРАН ПОЛЬЗОВАТЕЛЯ
//////////////////////////////////////////////////////////////////////////////////////////

// функция locationNumToText получает номер локации и выдаёт текст этой локации
const locationNumToText = num => {
    let description = "";
    locations.forEach(e => {
        if (e.index === currentLoc) {
            description += e.desc;
        }
    })
    
    ////////////////////////////////////////////////////////
    // СЮДА НАДО ВСТАВИТЬ ПРОВЕРКИ ДЛЯ УНИКАЛЬНЫХ ЛОКАЦИЙ
    ////////////////////////////////////////////////////////

    description += "<br>";
    if (items.some(e => {
            return e.place === currentLoc;
        })) {
        description += "<br>Здесь также есть:<br>";
        items.forEach(e => {
            if (e.place === currentLoc) {
                description += `- ${e.name}<br>`;
            }
        })
    }
    return description;
}

// функция actionNumToText получает номер фразы и выдаёт текст экшена

const actionNumToText = num => {
    switch (num) {
        case 0:
            return "Что будете делать?";
        default:
            return "Ошибка: этот экшен не должен выводиться";
    }
}


// функция makeScreen выводит на экран текст
// 1. Описание локации
// 2. Описание действия (если в локации впервые, то фразу "Что будете делать?")
const makeScreen = (locationText, actionText) => {
    document.getElementById("screen").innerHTML = locationText + "<br>" + actionText;
}

//////////////////////////////////////////////////////////////////////////////////////////
// ИНИЦИАЛИЗАЦИЯ
//////////////////////////////////////////////////////////////////////////////////////////

// Локации
// Мы имеем массив локаций. Каждая локация - это объект. Номер локации в массиве - это номер локации.
const locations = [{
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
}];

// Предметы
// Мы имеем массив предметов. Каждый предмет - это объект, он содержит своё название в инвентаре, своё описание и своё местоположение - либо номер локации, либо 999, если у игрока, либо -1 если не существует.
const items = [{
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
}]

// 

// Инициализация

let currentLoc = 0; // Стартуем в локации 0

// Запускаем функцию, которая конвертит номер локации в текст локации
makeScreen(locationNumToText(currentLoc), actionNumToText(0));