import { USER_HAVE_ITEM } from './constants.js';

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

const changeDir = (g, location, direction, value) => {
    const directionTypes = ["с", "в", "ю", "з", "вверх", "вниз"];
    const index = directionTypes.indexOf(direction);
    if (index !== -1) {
        g.locations[location].dir[index] = value;
    }
    return g;
}

const getObjectById = (g, id) => {
    const cur = g.objects.find(e => e.id === id);
    return cur;
}

const haveThisItem = (obj) => {
    return obj.place === USER_HAVE_ITEM ? true : false;
}

const haveItem = (g, id) => {
    const obj = getObjectById(g, id);
    if (obj === undefined) console.log("Вы неправильно указали ID объекта, проверьте");
    return obj.place === USER_HAVE_ITEM ? true : false;
}

const itemPlace = (g, id) => {
    const obj = getObjectById(g, id);
    return obj.place;
}

const changeUnknownItemPlace = (g, obj, plc) => {
    const ind = g.objects.findIndex(e => e === obj);
    g.objects[ind].place = plc;
    return g
}

const changeKnownItemPlace = (g, id, plc) => {
    const ind = g.objects.findIndex(e => e.id === id);
    g.objects[ind].place = plc;
    return g
}

const outputCtrl = (g, input) => {
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
            if (thisItem.id === "лестница" && g.currentLoc === 8 && g.flags.isLadderLeanToTree) {
                g = changeUnknownItemPlace(g, thisItem, USER_HAVE_ITEM);
                g.flags.isLadderLeanToTree = false;
                g = changeDir(g, 8, "вверх", -1);
                answer = `Я забрал лестницу.`;
                break;
            }

            if (thisItem === {}) {
                answer = `Что взять? Уточните.`;
            } else if (thisItem.place === g.currentLoc) {
                g = changeUnknownItemPlace(g, thisItem, USER_HAVE_ITEM);
                answer = `Ок, взял.`;
            } else if (thisItem.place === USER_HAVE_ITEM) {
                answer = `У меня это уже есть!`;
            } else {
                answer = `Здесь этого нет, не могу взять.`;
            }
            break;
        case "осмотри":
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
            if (thisItem.id === "лестница" && haveThisItem(thisItem)) {
                g = changeKnownItemPlace(g, "лестница", -1);
                g = changeKnownItemPlace(g, "шест", g.currentLoc);
                answer = `Я разломал лестницу на куски и получил неплохой длинный шест.`;
                break;
            }

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

            if (haveThisItem(thisItem)) {
                answer = `Не буду ломать. Вдруг мне это ещё пригодится?`;
            } else {
                answer = `Я не могу это сломать.`;
            }
            break;
        case "перейди":
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

            if (((g.currentLoc === 7 && thisObject.id === "тролль") || (g.currentLoc === 20 && thisObject.id === "монстр")) && haveItem(g, "топор")) {
                answer = "Этот топор хорош для колки дров, но в бою будет слабоват и неудобен.";
                break;
            }

            if (g.currentLoc === 23 && !g.flags.isWormKilled && haveItem(g, "топор")) {
                answer = "Шкура скального червя настолько твёрдая, что её невозможно повредить топором.";
                break;
            }

            if (g.currentLoc === 8 && thisObject.id === "дерево" && haveItem(g, "топор")) {
                g = changeKnownItemPlace(g, "топор", -1);
                answer = "Я с размаху бью топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и мой топор разлетается на куски.";
                break;
            }

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

            if (g.currentLoc === 18 && thisObject.id === "люк" && !g.flags.isTrapdoorOpened) {
                answer = "Я не представляю, как его открыть. Здесь нет никакой ручки, не за что зацепиться.";
                break;
            }
            answer = "Я не могу это открыть";
            break;
        case "ударь":
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

            if (g.currentLoc === 5 && thisObject.id === "старушка") {
                if (haveItem(g, "топор")) {
                    answer = "Вам не кажется, что эта ситуация со старушкой и топором - из другого произведения?";
                    break;
                } else {
                    answer = "Не в моих принципах поднимать руку на женщину.";
                    break;
                }
            }

            if (g.currentLoc === 23 && !g.flags.isWormKilled) {
                answer = "Шкура скального червя настолько твёрдая, что я не смогу повредить её никаким оружием.";
                break;
            }

            if (thisObject.id === "принцесса" && g.currentLoc === 28) {
                answer = "Я не подниму руку на эту прекрасную девушку!";
                break;
            }

            if (g.currentLoc === 20 && !g.flags.isMonsterKilled) {
                answer = "На такого монстра идти разве что с боевым ледорубом. Но такого у меня точно нет, придётся искать какую-нибудь хитрость.";
                break;
            }

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
                        g.flags.isPortcullisOpened = true;
                        g = changeDir(g, 17, "с", 27);
                    } else {
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

export default outputCtrl