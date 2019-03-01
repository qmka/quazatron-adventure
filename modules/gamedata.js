import {
    getCurrentLocation,
    setCurrentLocation,
    getItemPlace,
    setItemPlace,
    getFlag,
    setFlag,
    isItemInInventory,
    addItemToInventory,
    removeItemFromInventory
} from './functions.js'

const inventory = {
    _inventory: [],

    addItem(item) {
        this._inventory.push(item)
    },

    removeItem(item) {
        this._inventory = this._inventory.filter((e) => e !== item);
    },

    isItemInInventory(item) {
        return this._inventory.includes(item);
    },

    allItems() {
        return this._inventory;
    }
}

// Объект с начальным состоянием игры
const state = {
    // Текущая локация
    currentLocation: 0,

    // Флаги и триггеры
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
    },

    // Массив с расположением предметов
    itemPlaces: {
        0: 0,
        1: 3,
        2: 9,
        3: -1,
        4: 13,
        5: -1,
        6: -1,
        7: -1,
        8: 24,
        9: 22,
        10: 26,
        11: 19,
        12: 2
    },

    userDirections: {
        "с": null,
        "ю": null,
        "в": null,
        "з": null,
        "вверх": null,
        "вниз": null,
    },
};

// Словарь - существительные, глаголы и прилагательные, которые понимает игра
const vocabulary = {
    // Словарь глаголов
    verbs: [
    {
        id: 0,
        forms: ["с", "север"]
    }, {
        id: 1,
        forms: ["в", "восток"]
    }, {
        id: 2,
        forms: ["ю", "юг"]
    }, {
        id: 3,
        forms: ["з", "запад"]
    }, {
        id: 4,
        forms: ["вверх", "наверх", "поднимись"]
    }, {
        id: 5,
        forms: ["вниз", "спустись"]
    }, {
        id: 6,
        forms: ["инструкция", "информация", "инфо", "и"]
    }, {
        id: 7,
        forms: ["выход", "конец", "закончи", "хватит"]
    }, {
        id: 8,
        forms: ["возьми", "подними", "бери", "забери"],
        method: "takeItem"
    }, {
        id: 9,
        forms: ["положи", "выбрось", "оставь"],
        method: "dropItem"
    }, {
        id: 10,
        forms: ["осмотри", "изучи", "исследуй"],
        method: "examine"
    }, {
        id: 11,
        forms: ["брось", "кидай", "метни"],
        method: "throw"
    }, {
        id: 12,
        forms: ["говори", "поговори", "скажи", "поболтай", "болтай", "общайся", "пообщайся"],
        method: "talk"
    }, {
        id: 13,
        forms: ["купи", "приобрети", "покупай"],
        method: "buy"
    }, {
        id: 14,
        forms: ["заплати"],
        method: "pay"
    }, {
        id: 15,
        forms: ["ударь", "убей", "атакуй", "бей"],
        method: "hit"
    }, {
        id: 16,
        forms: ["руби", "поруби", "разруби", "заруби", "переруби", "сруби"],
        method: "chop"
    }, {
        id: 17,
        forms: ["открой", "отопри"],
        method: "open"
    }, {
        id: 18,
        forms: ["залезь", "заберись", "лезь", "карабкайся", "вскарабкайся"],
        method: "climb"
    }, {
        id: 19,
        forms: ["перейди", "пересеки"],
        method: "cross"
    }, {
        id: 20,
        forms: ["ломай", "сломай", "разломай", "поломай"],
        method: "destroy"
    }, {
        id: 21,
        forms: ["прислони", "приставь", "поставь"],
        method: "lean"
    }, {
        id: 22,
        forms: ["иди", "пойди", "топай", "отправляйся"],
        method: "go"
    }, {
        id: 23,
        forms: ["съешь", "ешь", "попробуй", "откуси"],
        method: "eat"
    }, {
        id: 24,
        forms: ["включи", "зажги"],
        method: "turnOn"
    }, {
        id: 25,
        forms: ["высыпь", "рассыпь", "высыпи", "посыпь"],
        method: "pour"
    }, {
        id: 26,
        forms: ["заправь", "заряди", "залей"],
        method: "fuel"
    }, {
        id: 27,
        forms: ["смажь"],
        method: "oil"
    }, {
        id: 28,
        forms: ["нажми", "потяни", "надави", "жми", "тяни", "дёрни"],
        method: "press"
    }, {
        id: 29,
        forms: ["отрази", "отбей"],
        method: "reflect"
    }, {
        id: 30,
        forms: ["поцелуй", "целуй"],
        method: "kiss"
    }, {
        id: 31,
        forms: ["разбуди", "буди"],
        method: "wake"
    }],

    // Словарь объектов
    objects: [
    {
        id: 0,
        name: "лестница",
        forms: ["лестница", "лестницу", "лестницой", "лестнице"],
        canHold: true,
        desc: "Это деревянная приставная лестница в полтора метра высотой. Достаточно лёгкая, чтобы носить её с собой, но при этом довольно хлипкая, легко сломать.",
        adjective: -1
    }, {
        id: 1,
        name: "рыба",
        forms: ["рыба", "рыбу", "рыбе", "рыбой"],
        canHold: true,
        desc: "Это красная рыба, уже подгнившая и довольно вонючая. Такую в руках держать неприятно, а с собой таскать - так вообще мерзко.",
        adjective: -1
    }, {
        id: 2,
        name: "булава",
        forms: ["булава", "булавой", "булаве", "булаву"],
        canHold: true,
        desc: "Это короткая булава с шипами. На её рукояти выгравированы слова: СМЕРТЬ ТРОЛЛЯМ.",
        adjective: -1
    }, {
        id: 3,
        name: "шест",
        forms: ["шест", "шеста", "шестом", "шесту"],
        canHold: true,
        desc: "Это шест, который остался от разломанной мною лестницы.",
        adjective: -1
    }, {
        id: 4,
        name: "дрова",
        forms: ["дрова", "дровам", "дров"],
        canHold: true,
        desc: "Это вязанка берёзовых дров, довольно тяжёлая.",
        adjective: -1
    }, {
        id: 5,
        name: "топор",
        forms: ["топор", "топору", "топора", "топором"],
        canHold: true,
        desc: "Это добротный, хорошо заточенный топор.",
        adjective: -1
    }, {
        id: 6,
        name: "ключ",
        forms: ["ключ", "ключом", "ключа", "ключу"],
        canHold: true,
        desc: "Это тяжёлый фигурный ключ из слоновой кости.",
        adjective: -1
    }, {
        id: 7,
        name: "лампа",
        forms: ["лампа", "лампу", "лампы", "лампе", "лампой"],
        canHold: true,
        desc: "Это одноразовая лампа. При необходимости её можно включить, но, по словам старушки, она горит недолго, хоть и очень ярко.",
        adjective: -1
    }, {
        id: 8,
        name: "соль",
        forms: ["соль", "соли", "солью", "мешочек", "мешочком", "мешочку", "мешочка"],
        canHold: true,
        desc: "Это соль, упакованная в мешочек, на вид и на вкус вполне обычная.",
        adjective: -1
    }, {
        id: 9,
        name: "масло",
        forms: ["масло", "маслом", "маслу", "масленка", "маслёнка", "масленкой", "маслёнкой", "маслёнку", "масленку", "масленке", "маслёнке"],
        canHold: true,
        desc: "Это маслёнка с маслом. Пригодится, если в этом разрушенном замке нужно будет что-нибудь смазать.",
        adjective: -1
    }, {
        id: 10,
        name: "меч",
        forms: ["меч", "мечу", "мечом", "меча"],
        canHold: true,
        desc: "Это длинный обоюдоострый меч. Его эфес украшают две химеры, а поверхность лезвия за долгие годы не утратила своего блеска: в него можно смотреться словно в зеркало.",
        adjective: -1
    }, {
        id: 11,
        name: "серебряная монета",
        forms: ["монета", "монету", "монете", "монетой"],
        canHold: true,
        desc: "Это старая серебряная монета.",
        adjective: 0,
    }, {
        id: 12,
        name: "медная монета",
        forms: ["монета", "монету", "монете", "монетой"],
        canHold: true,
        desc: "Это старая медная монета.",
        adjective: 1,
    }, {
        id: 13,
        forms: ["пропасть", "пропасти", "пропастью", "расщелина", "расщелиной", "расщелину", "расщелины", "верёвка", "веревка", "верёвке", "веревке", "верёвку", "веревку", "верёвки", "веревки", "ущелье", "ущелья"],
        canHold: false,
        adjective: -1
    }, {
        id: 14,
        forms: ["куст", "куста", "кусту", "кустом"],
        canHold: false,
        adjective: -1
    }, {
        id: 15,
        forms: ["ветви", "ветвей", "ветвям", "щупальца", "щупалец", "щупальцам"],
        canHold: false,
        adjective: -1
    }, {
        id: 16,
        forms: ["дверь", "двери", "дверью"],
        canHold: false,
        adjective: -1
    }, {
        id: 17,
        forms: ["тролль", "тролля", "троллю", "троллем"],
        canHold: false,
        adjective: -1
    }, {
        id: 18,
        forms: ["дерево", "дереву", "деревом", "дерева"],
        canHold: false,
        adjective: -1
    }, {
        id: 19,
        forms: ["решётка", "решетка", "решётку", "решетку", "решёткой", "решеткой", "решётки", "решетки"],
        canHold: false,
        adjective: -1
    }, {
        id: 20,
        forms: ["люк", "люку", "люка", "люком"],
        canHold: false,
        adjective: -1
    }, {
        id: 21,
        forms: ["старушка", "старушку", "старушки", "старушке", "старушкой"],
        canHold: false,
        adjective: -1
    }, {
        id: 22,
        forms: ["червь", "червя", "червю", "червяк", "червяка", "червяку"],
        canHold: false,
        adjective: -1
    }, {
        id: 23,
        forms: ["монстр", "монстра", "монстру", "монстре", "монстром"],
        canHold: false,
        adjective: -1
    }, {
        id: 24,
        forms: ["рычаг", "рычага", "рычагом"],
        canHold: false,
        adjective: -1
    }, {
        id: 25,
        forms: ["заклятье", "заклинание", "заклятью", "заклятьем", "заклятья"],
        canHold: false,
        adjective: -1
    }, {
        id: 26,
        forms: ["принцесса", "принцессу", "принцессе", "принцессой", "принцессы"],
        canHold: false,
        adjective: -1
    }],

    // Словарь прилагательных
    adjectives: [
    {
        id: 0,
        forms: ["серебряный", "серебряного", "серебряному", "серебряном", "серебряная", "серебряную", "серебряной", "серебрянный", "серебрянного", "серебрянному", "серебрянном", "серебрянная", "серебрянную", "серебрянной", "серебряное", "серебрянное"]
    }, {
        id: 1,
        forms: ["медный", "медного", "медному", "медном", "медная", "медную", "медной", "медное"]
    }]
}

// Игровые локации
const locations = [
{
    id: 0,
    desc: 'Вы находитесь на развалинах крестьянского домика. На север ведёт заросшая травой дорога.',
    dir: [1, -1, -1, -1, -1, -1], // [north, east, south, west, up, down]
    type: 'game',
    img: 'location000.png' // 760х300
}, {
    id: 1,
    desc: 'Вы стоите на просёлочной дороге с поросшими травой обочинами. Дорога ведёт на север, а на юге виднеется охотничий домик.',
    dir: [2, -1, 0, -1, -1, -1],
    type: 'game',
    img: 'location001.png'
}, {
    id: 2,
    desc: 'Здесь дорога поворачивает с юга на восток. Вдалеке виднеется стена высоких гор.',
    dir: [-1, 3, 1, -1, -1, -1],
    type: 'game',
    img: 'location002.png'
}, {
    id: 3,
    desc: "Вы на мощённой камнем дороге, проходящей через заброшенные поля мимо разбросанных то тут, то там огромных валунов. Дорога ведёт с запада на восток.",
    dir: [-1, 4, -1, 2, -1, -1],
    type: 'game',
    img: 'location003.png'
}, {
    id: 4,
    desc: "Вы на пыльной тропе, огибающей край леса. Издалека доносится слабый шелест листвы. Дорога поворачивает на юг, а на север в гору уходит еле-заметная тропинка.",
    dir: [8, -1, 5, 3, -1, -1],
    type: 'game',
    img: 'location004.png'
}, {
    id: 5,
    desc: "В этом месте от дороги ответвляется небольшая тропинка на восток. Дорога ведёт с севера на юг.<br>У дороги стоит старушка, продающая лампы.",
    dir: [4, 7, 6, -1, -1, -1],
    type: 'game',
    img: 'location005.png'
}, {
    id: 6,
    desc: "Дорога приходит с севера и обрывается на краю страшной, бездонной пропасти. Туго натянутая верёвка пересекает расщелину. По ней можно перейти пропасть, но она выглядит слишком тонкой и опасной.",
    dir: [5, -1, -1, -1, -1, -1],
    type: 'game',
    img: 'location006.png'
}, {
    id: 7,
    desc: "Вы на дороге, ведущей с запада на восток через тёмный лес. Сверху доносятся вороньи крики.",
    dir: [-1, 10, -1, 5, -1, -1],
    type: 'game',
    img: 'location007.png'
}, {
    id: 8,
    desc: "Вы стоите около огромного каменного дерева, совершенно лишённого веток. Дорога здесь кончается, выход только на юг.",
    dir: [-1, -1, 4, -1, 9, -1],
    type: 'game',
    img: 'location008.png'
}, {
    id: 9,
    desc: "Вы в переплетении ветвей на каменном дереве. Путь отсюда только вниз.",
    dir: [-1, -1, -1, -1, -1, 8],
    type: 'game',
    img: 'location009.png'
}, {
    id: 10,
    desc: "Вы на восточной опушке Бирвудского леса. Жители окрестных деревень не смеют даже приближаться сюда. Далеко на востоке вы можете разглядеть замок.<br>Вы можете пройти на запад или на восток по заросшей травой дороге.",
    dir: [-1, 11, -1, 7, -1, -1],
    type: 'game',
    img: 'location010.png'
}, {
    id: 11,
    desc: "Вы снаружи зловеще выглядящего замка Камелот. Величественное ранее знамя теперь изорвано в клочья и истрёпано ветрами. Большая дверь из слоновой кости на востоке - единственный вход.",
    dir: [-1, 15, -1, 10, -1, -1],
    type: 'game',
    img: 'location011.png'
}, {
    id: 12,
    desc: "Вы на краю Бирвудского леса. На севере верёвка пересекает ужасное ущелье. На юг от пропасти ведёт дорога.",
    dir: [-1, -1, 13, -1, -1, -1],
    type: 'game',
    img: 'location012.png'
}, {
    id: 13,
    desc: "Вы в глубине Бирвудского леса. На деревьях полно крошечных жужжащих насекомых. На севере - выход из леса, а на запад уходит узкая тропинка.",
    dir: [12, -1, -1, 14, -1, -1],
    type: 'game',
    img: 'location013.png'
}, {
    id: 14,
    desc: "Вы стоите на заросшей мхом земле под навесом из листьев, пропускающим слабый солнечный свет. Возможный выход только на восток. Рядом растёт странного вида куст.",
    dir: [-1, 13, -1, -1, -1, -1],
    type: 'game',
    img: 'location014.png'
}, {
    id: 15,
    desc: "Вы в крытой галерее замка Камелот. Возможные выходы - на запад и на восток.",
    dir: [-1, 16, -1, 11, -1, -1],
    type: 'game',
    img: 'location015.png'
}, {
    id: 16,
    desc: "Вы в заброшенном банкетном зале. На полу валяется разбитая мебель. Можно идти на запад, на юг и на север.",
    dir: [17, -1, 18, 15, -1, -1],
    type: 'game',
    img: 'location016.png'
}, {
    id: 17,
    desc: "Вы в небольшой тёмной комнате, которая имеет опускную железную решётку, врезанную в северную стену. Если не считать решётки, то возможный выход - только на юг.",
    dir: [27, -1, 16, -1, -1, -1],
    type: 'game',
    img: 'location017.png'
}, {
    id: 18,
    desc: "Вы в комнате, заваленной мусором. Через мелкие дыры в стене слышны завывания ветра. Можно идти на север и восток.",
    dir: [16, 19, -1, -1, -1, 21],
    type: 'game',
    img: 'location018.png'
}, {
    id: 19,
    desc: "Вы стоите в богато украшенном вестибюле, который покрыт тонким слоем льда. Выходы на востоке и на западе.",
    dir: [-1, 20, -1, 18, -1, -1],
    type: 'game',
    img: 'location019.png'
}, {
    id: 20,
    desc: "Вы в жутко холодной комнате. Всё здесь покрыто толстым слоем льда. Выходы на западе и на севере.",
    dir: [25, -1, -1, 19, -1, -1],
    type: 'game',
    img: 'location020.png'
}, {
    id: 21,
    desc: "Вы в старой соляной шахте. Мрачный туннель ведёт на юг и на запад. Через отверстие в потолке можно пролезть наверх.",
    dir: [-1, -1, 23, 22, 18, -1],
    type: 'game',
    img: 'location021.png'
}, {
    id: 22,
    desc: "Вы находитесь в западной части шахты. Она выглядит выработанной и заброшенной. Выход ведёт на восток",
    dir: [-1, 21, -1, -1, -1, -1],
    type: 'game',
    img: 'location022.png'
}, {
    id: 23,
    desc: "Вы в южной части шахты. Здесь очень душно. Тоннели ведут на север и на юг.",
    dir: [21, -1, 24, -1, -1, -1],
    type: 'game',
    img: 'location023.png'
}, {
    id: 24,
    desc: "Вы в конце шахты, в тупике. Слышно, как капает вода. Выход отсюда - на север.",
    dir: [23, -1, -1, -1, -1, -1],
    type: 'game',
    img: 'location024.png'
}, {
    id: 25,
    desc: "Вы в комнате, которая когда-то была помещением для охраны. На одной из стен вы можете видеть чудом сохранившийся посреди всей этой разрухи рычаг. Выходы отсюда - на восток и на юг.",
    dir: [-1, 26, 20, -1, -1, -1],
    type: 'game',
    img: 'location025.png'
}, {
    id: 26,
    desc: "Вы в оружейной комнате. Её стены покрыты толстым слоем паутины, а вдоль стен стоят пустые оружейные полки. Выход отсюда - через дверь на западе.",
    dir: [-1, -1, -1, 25, -1, -1],
    type: 'game',
    img: 'location026.png'
}, {
    id: 27,
    desc: "Вы в роскошно обставленном зале, обстановка которого резко контрастирует с разрухой в других комнатах. Отсюда можно пройти на юг и на запад.",
    dir: [-1, -1, 17, 28, -1, -1],
    type: 'game',
    img: 'location027.png'
}, {
    id: 28,
    desc: "Вы в маленькой комнате. Сквозь разбитое окно в потолке дует холодный ветер. На кровати в углу спит принцесса, а воздух вокруг наэлектризован от чар. Выход - на востоке.",
    dir: [-1, 27, -1, -1, -1, -1],
    type: 'game',
    img: 'location028.png'
}];

const encounters = {
    // Добавляем дополнительную информацию к описанию локации в зависимости от различных условий
    addDescription() {
        let description = "";
        if (getFlag("isLadderLeanToTree") && getCurrentLocation() === 8) description += "<br>К дереву приставлена лестница.";
        if (getCurrentLocation() === 11 && getFlag("isDoorOpened")) description += "<br>Дверь открыта.";
        if (getCurrentLocation() === 7 && !getFlag("isTrollKilled")) description += "<br>Путь на восток преграждает толстый тролль.";
        if (getCurrentLocation() === 17 && !getFlag("isPortcullisOpened")) description += "<br>Решётка опущена - не пройти.";
        if (getCurrentLocation() === 17 && getFlag("isPortcullisOpened")) description += "<br>Решётка поднята к потолку.";
        if (getCurrentLocation() === 18 && getFlag("isTrapdoorOpened")) description += "<br>В полу комнаты дыра, через которую можно спуститься вниз.";
        if (getCurrentLocation() === 18 && !getFlag("isTrapdoorOpened")) description += "<br>В полу есть закрытый люк.";
        if (getCurrentLocation() === 23 && !getFlag("isWormKilled")) description += "<br>Вход в южный тоннель преграждает огромный скальный червь.";
        if (getCurrentLocation() === 20 && !getFlag("isMonsterKilled")) description += "<br>Северный проход охраняет страшный ледяной монстр.";
        if (getCurrentLocation() === 27 && !getFlag("isWitchKilled")) description += "<br>В противоположном конце комнаты вы видите ведьму. Её заклятье летит прямо в вашу сторону, нужно быстро что-то делать!";
        return description;
    },

    // Проверяем, мешает ли игроку что-либо двигаться в выбранном им направлении
    playerCanNotMove(direction) {
        if (getCurrentLocation() === 7 && !getFlag("isTrollKilled") && direction === 1) {
            return "Тролль рычит и не даёт мне пройти.";
        }
        if (getCurrentLocation() === 8 && !getFlag("isLadderLeanToTree") && direction === 4) {
            return "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
        }
        if (getCurrentLocation() === 11 && !getFlag("isDoorOpened") && direction === 1) {
            return "Дверь закрыта, я не могу туда пройти.";
        }
        if (getCurrentLocation() === 18 && !getFlag("isPortcullisOpened") && direction === 0) {
            return "Решётка опущена до пола, она мешает мне пройти.";
        }
        if (getCurrentLocation() === 18 && !getFlag("isTrapdoorOpened") && direction === 5) {
            return "Путь вниз мне преграждает закрытый люк.";
        }
        if (getCurrentLocation() === 20 && !getFlag("isMonsterKilled") && direction === 0) {
            return "Ледяной монстр мешает мне пройти.";
        }
        if (getCurrentLocation() === 23 && !getFlag("isWormKilled") && direction === 2) {
            return "Скальный червь мешает мне пройти.";
        }
    },

    take(item) {
        if (item === 0 && getFlag("isLadderLeanToTree")) {
            setFlag("isLadderLeanToTree");
            addItemToInventory(0);
            return "Я забрал лестницу.";
        }
    },

    drop(item) {
        // В демоигре нет никаких особых событий, связанных с необходимостью положить предмет

    },

    examine(object) {
        if (getCurrentLocation() === 8 && object === 18) {
            return "Это невысокое, но широкое в обхвате дерево, превратившееся в камень под действием неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя что-то вроде гнезда.";
        }
        if (getCurrentLocation() === 8 && object === 0 && getFlag("isLadderLeanToTree") === true) {
            return "Лестница приставлена к дереву. Я могу залезть наверх.";
        }
        if ((getCurrentLocation() === 6 || getCurrentLocation() === 12) && object === 13) {
            return "Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.";
        }
        if (getCurrentLocation() === 14 && object === 14) {
            let answer = "Ветви этого куста похожи на щупальца.";
            if (!getFlag("isKeyRevealed")) {
                setFlag("isKeyRevealed");
                setItemPlace(6, 14);
                answer += " На одном из таких щупальцев я обнаружил ключ.";
            }
            return answer;
        }
        if (getCurrentLocation() === 11 && object === 16) {
            return getFlag("isDoorOpened") ? "Дверь открыта." : "Дверь заперта.";
        }
        if (getCurrentLocation() === 7 && !getFlag("isTrollKilled") && object === 17) {
            return "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
        }
        if (getCurrentLocation() === 17 && object === 19) {
            return getFlag("isPortcullisOpened") ? "Решётка поднята к потолку - проход свободен." : "Это мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
        }
        if (getCurrentLocation() === 18 && object === 20) {
            return getFlag("isTrapdoorOpened") ? "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
        }
        if (getCurrentLocation() === 5 && object === 21) {
            return "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";
        }
        if (getCurrentLocation() === 23 && !getFlag("isWormKilled") && object === 22) {
            return "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";
        }
        if (getCurrentLocation() === 20 && !getFlag("isMonsterKilled") && object === 23) {
            return "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";
        }
        if (getCurrentLocation() === 25 && object === 24) {
            return getFlag("isLeverOiled") ? "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать." : "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать.";
        }
        if (getCurrentLocation() === 28 && object === 26) {
            return "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";
        }
        if (object === 4 && isItemInInventory(4)) {
            let answer = vocabulary.objects[4].desc;
            if (!getFlag("isAxeRevealed")) {
                setFlag("isAxeRevealed");
                setItemPlace(5, getCurrentLocation());
                answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
            }
            return answer;
        }
    },

    throw(objects) {
        if (objects.includes(8) && isItemInInventory(8)) {
            removeItemFromInventory(8);
            if (getCurrentLocation() === 20 && !getFlag("isMonsterKilled")) {
                setFlag("isMonsterKilled");
                return "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
            } else {
                return "Я рассыпал всю соль. Непонятно, правда, зачем было так делать - вдруг она бы мне пригодилась?";
            }
        }
        if (objects.includes(5) && isItemInInventory(5)) {
            return "Это явно не метательный топорик. Давайте попробуем что-то другое.";
        }
        if (objects.includes(2) && isItemInInventory(2)) {
            return "Слишком тяжёлая, чтобы метать. Ей надо бить, желательно промеж глаз.";
        }
        if (objects.includes(7) && isItemInInventory(7)) {
            removeItemFromInventory(7);
            return "Я бросаю лампу, и она разбивается на осколки. И зачем нужно было это делать?";
        }
        return "Не сработает. А если вы хотите положить предмет на землю, то лучше введите команду ПОЛОЖИ.";

    },

    talk(objects) {
        if (objects.includes(21) && getCurrentLocation() === 5) {
            return "Старушка рассказывает, что её муж делает лампы, а она их продаёт путникам - такая вещь в путешествии всегда пригодится. Если хотите купить лампу, вам придётся заплатить серебром. Ничего себе цены!";
        }
        if (objects.includes(17) && getCurrentLocation() === 7 && !getFlag("isTrollKilled")) {
            return "Тролль злобно рычит в ответ.";
        }
        if (objects.includes(23) && getCurrentLocation() === 20 && !getFlag("isMonsterKilled")) {
            return "У этого чудища нет рта, чтобы разговаривать.";
        }
        if (objects.includes(26) && getCurrentLocation() === 28) {
            return "Чтобы с ней пообщаться, нужно её разбудить.";
        }
        return "Здесь не с кем говорить.";
    },

    lean(objects) {
        if (objects.includes(0) && !getFlag("isLadderLeanToTree") && isItemInInventory(0)) {
            setFlag("isLadderLeanToTree");
            removeItemFromInventory(0);
            return "Я прислонил лестницу к дереву.";
        }
        return "Хм, это делу не поможет.";
    },

    destroy(objects) {
        if (objects.includes(0) && isItemInInventory(0)) {
            removeItemFromInventory(0);
            setItemPlace(3, getCurrentLocation());
            return "Я разломал лестницу на куски и получил неплохой длинный шест.";
        }
        if (objects.includes(20) && getCurrentLocation() === 18 && !getFlag("isTrapdoorOpened")) {
            if (isItemInInventory(5)) {
                setFlag("isTrapdoorOpened");
                return "Я разломал топором деревянный люк. Теперь путь вниз открыт.";
            } else {
                return "У меня нет ничего, чем я могу сломать люк.";
            }
        }
        return "Я не могу это сломать";
    },

    cross(objects) {
        if (objects.includes(13) && (getCurrentLocation() === 6 || getCurrentLocation() === 12)) {
            let answer;
            if (isItemInInventory(3)) {
                answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                if (getCurrentLocation() === 6) {
                    setCurrentLocation(12);
                } else {
                    setCurrentLocation(6);
                }
            } else {
                answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
            }
            return answer;
        }
        return "Решительно не понимаю, что вы хотите сделать.";
    },

    climb(objects) {
        if (objects.includes(18) && getCurrentLocation() === 8) {
            if (getFlag("isLadderLeanToTree")) {
                setCurrentLocation(9);
                return "Я залез на дерево по лестнице.";
            } else {
                return "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться.";
            }
        }
        return "Я не могу туда залезть";
    },
}

const gameDefaultTexts = {
    info: 'Я понимаю команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, <span style="color: yellow;">ВОЗЬМИ ЛЕСТНИЦУ</span> или <span style="color: yellow;">НАБЕРИ ВОДЫ В КУВШИН.</span><br>Используйте команды <span style="color: yellow;">С  Ю  З  В  ВВЕРХ  ВНИЗ</span> для передвижения. Команда <span style="color: yellow;">ОСМОТРИ</span> позволяет получить больше информации о различных объектах. Команда <span style="color: yellow;">ВЫХОД</span> позволяет вернуться на стартовый экран. Остальные команды вам предстоит открыть самостоятельно. Удачной игры!'
}

export {
    state,
    vocabulary,
    locations,
    inventory,
    encounters,
    gameDefaultTexts
};