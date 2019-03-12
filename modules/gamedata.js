import {
    Inventory as inventory
} from './inventory.js'

import {
    Location as location
} from './location.js'

import {
    Flags as flags
} from './flags.js'

import {
    ItemPlaces as itemPlaces
} from './itemplaces.js'

const initialItemPlaces = {
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
}

const initialFlags = {
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
    isWitchKilled: false,
    isDiedFromFish: false,
    isVictory: false,
    isGameOver: false
}

// Объект с начальным состоянием игры

const resetGameState = () => {
    location.set(0);
    flags.init(initialFlags);
    itemPlaces.init(initialItemPlaces);
    inventory.clear();
}

// Словарь - существительные, глаголы и прилагательные, которые понимает игра
const vocabulary = {
    // Словарь глаголов
    verbs: [{
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
        forms: ["х", "вверх", "наверх", "поднимись"]
    }, {
        id: 5,
        forms: ["н", "вниз", "спустись"]
    }, {
        id: 6,
        forms: ["инструкция", "информация", "инфо"]
    }, {
        id: 7,
        forms: ["выход", "конец", "закончи", "хватит"]
    }, {
        id: 8,
        forms: ["и", "инвентарь"],
    }, {
        id: 9,
        forms: ["возьми", "подними", "бери", "забери", "взять", "поднять", "забрать", "брать"],
        method: "takeItem"
    }, {
        id: 10,
        forms: ["положи", "выбрось", "оставь", "выброси", "положить", "выбросить", "оставить"],
        method: "dropItem"
    }, {
        id: 11,
        forms: ["осмотри", "изучи", "исследуй", "осмотреть", "изучить", "исследовать"],
        method: "examine"
    }, {
        id: 12,
        forms: ["брось", "кидай", "метни", "бросить", "кинуть", "метнуть"],
        method: "throw"
    }, {
        id: 13,
        forms: ["говори", "поговори", "скажи", "поболтай", "болтай", "общайся", "пообщайся", "говорить", "сказать", "поговорить", "поболтать", "болтать", "общаться", "пообщаться"],
        method: "talk"
    }, {
        id: 14,
        forms: ["купи", "приобрети", "покупай", "купить", "приобрести"],
        method: "buy"
    }, {
        id: 15,
        forms: ["заплати", "заплатить", "плати", "платить"],
        method: "pay"
    }, {
        id: 16,
        forms: ["ударь", "убей", "атакуй", "бей", "ударить", "убить", "атаковать", "бить"],
        method: "hit"
    }, {
        id: 17,
        forms: ["руби", "поруби", "разруби", "заруби", "переруби", "сруби", "рубить", "разрубить", "порубить", "перерубить", "срубить"],
        method: "chop"
    }, {
        id: 18,
        forms: ["открой", "отопри", "открыть", "отпереть"],
        method: "open"
    }, {
        id: 19,
        forms: ["залезь", "заберись", "лезь", "карабкайся", "вскарабкайся", "залезть", "забраться", "лезть", "карабкаться", "вскарабкаться"],
        method: "climb"
    }, {
        id: 20,
        forms: ["перейди", "пересеки", "перейти", "пересечь", "пройди", "пройти"],
        method: "cross"
    }, {
        id: 21,
        forms: ["ломай", "сломай", "разломай", "поломай", "ломать", "сломать", "разломать", "поломать"],
        method: "destroy"
    }, {
        id: 22,
        forms: ["прислони", "приставь", "поставь", "прислонить", "приставить", "поставить"],
        method: "lean"
    }, {
        id: 23,
        forms: ["иди", "пойди", "отправляйся", "идти", "пойти", "отправиться"],
        method: "go"
    }, {
        id: 24,
        forms: ["съешь", "ешь", "попробуй", "откуси", "есть", "съесть", "попробовать", "откусить"],
        method: "eat"
    }, {
        id: 25,
        forms: ["включи", "зажги", "включить", "зажечь"],
        method: "turnOn"
    }, {
        id: 26,
        forms: ["высыпь", "рассыпь", "высыпи", "посыпь", "сыпь", "высыпать", "рассыпать", "посыпать", "сыпать"],
        method: "pour"
    }, {
        id: 27,
        forms: ["заправь", "заряди", "залей", "заправить", "зарядить", "залить"],
        method: "fuel"
    }, {
        id: 28,
        forms: ["смажь", "смазать"],
        method: "oil"
    }, {
        id: 29,
        forms: ["нажми", "потяни", "надави", "жми", "тяни", "дёрни", "нажать", "потянуть", "надавить", "жать", "тянуть", "дёрнуть", "дернуть", "дерни"],
        method: "press"
    }, {
        id: 30,
        forms: ["отрази", "отбей", "отразить", "отбить"],
        method: "reflect"
    }, {
        id: 31,
        forms: ["поцелуй", "целуй", "поцеловать", "целовать"],
        method: "kiss"
    }, {
        id: 32,
        forms: ["разбуди", "буди", "разбудить", "будить"],
        method: "wake"
    }],

    // Словарь объектов
    objects: [{
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
        forms: ["старушка", "старушку", "старушки", "старушке", "старушкой", "старуха", "старуху", "старухи", "старухе", "старухой", "бабка", "бабку", "бабки", "бабке", "бабкой", "бабушка", "бабушку", "бабушки", "бабушке", "бабушкой"],
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
        forms: ["рычаг", "рычага", "рычагом", "рычагу", "механизм", "механизма", "механизмом", "механизму"],
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
    adjectives: [{
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
    img: 'location000.png' // 760х300
}, {
    id: 1,
    desc: 'Вы стоите на заброшенной дороге с поросшими травой обочинами, посреди окружённой горами долины. Дорога ведёт на север, а на юге виднеется охотничий домик.',
    dir: [2, -1, 0, -1, -1, -1],
    img: 'location001.png'
}, {
    id: 2,
    desc: 'Здесь дорога поворачивает с юга на восток. Земля вокруг покрыта рыжей пожухлой травой и булыжником.',
    dir: [-1, 3, 1, -1, -1, -1],
    img: 'location002.png'
}, {
    id: 3,
    desc: "Дорога ведёт с запада на восток, где вдалеке виднеется тёмный лес.",
    dir: [-1, 4, -1, 2, -1, -1],
    img: 'location003.png'
}, {
    id: 4,
    desc: "Вы на развилке. Издалека доносится слабый шелест листвы. Дорога поворачивает на юг, а на север, прямо на горный склон ведёт еле-заметная тропинка.",
    dir: [8, -1, 5, 3, -1, -1],
    img: 'location004.png'
}, {
    id: 5,
    desc: "Вы на опушке леса. На север отсюда ведёт дорога, но можно пройти по тропинке на восток, углубившись в лес, или же на юг, по краю леса.<br>У дороги стоит старушка, продающая лампы.",
    dir: [4, 7, 6, -1, -1, -1],
    img: 'location005.png'
}, {
    id: 6,
    desc: "Вы стоите на краю глубокой пропасти. Расщелину пересекает туго натянутая верёвка. По ней можно перейти пропасть, но она выглядит слишком тонкой и опасной. На север в сторону леса уходит еле заметная тропинка.",
    dir: [5, -1, -1, -1, -1, -1],
    img: 'location006.png'
}, {
    id: 7,
    desc: "Вы на тропе, ведущей с запада на восток через лес. Сверху доносятся вороньи крики.",
    dir: [-1, 10, -1, 5, -1, -1],
    img: 'location007.png'
}, {
    id: 8,
    desc: 'Вы стоите около окаменевшего дерева непонятным образом "растущего" прямо из скалы. Тропинка здесь кончается, выход - пойти на юг, чтобы вернуться на дорогу.',
    dir: [-1, -1, 4, -1, 9, -1],
    img: 'location008.png'
}, {
    id: 9,
    desc: "Вы на верхушке дерева, в переплетении ветвей. Путь отсюда только вниз, на землю.",
    dir: [-1, -1, -1, -1, -1, 8],
    img: 'location009.png'
}, {
    id: 10,
    desc: "Вы на опушке леса. Тропа превращается в мощёную камнем дорогу и ведёт с запада на восток в сторону окружённых скалами развалин замка.",
    dir: [-1, 11, -1, 7, -1, -1],
    img: 'location010.png'
}, {
    id: 11,
    desc: "Вы снаружи зловеще выглядящего замка, некогда величественного, а сейчас превратившегося в развалины. Дорога идёт на восток и упирается в большую чёрную дверь из незнакомого материала.",
    dir: [-1, 15, -1, 10, -1, -1],
    img: 'location011.png'
}, {
    id: 12,
    desc: "Вы стоите на краю глубокой пропасти. На севере - глубокое ущелье, которое пересекает туго натянутая верёвка. На юг от пропасти ведёт тропинка.",
    dir: [-1, -1, 13, -1, -1, -1],
    img: 'location012.png'
}, {
    id: 13,
    desc: "Вы на небольшом горном плато посреди отвесных скал. Отсюда можно пойти на север и на запад.",
    dir: [12, -1, -1, 14, -1, -1],
    img: 'location013.png'
}, {
    id: 14,
    desc: "Вы на противоположной стороне плато. Единственная дорога отсюда - на восток. На самом краю растёт странного вида куст.",
    dir: [-1, 13, -1, -1, -1, -1],
    img: 'location014.png'
}, {
    id: 15,
    desc: "Вы в крытой галерее замка Камелот. Возможные выходы - на запад и на восток.",
    dir: [-1, 16, -1, 11, -1, -1],
    img: 'location015.png'
}, {
    id: 16,
    desc: "Вы в заброшенном банкетном зале. На полу валяется разбитая мебель. Можно идти на запад, на юг и на север.",
    dir: [17, -1, 18, 15, -1, -1],
    img: 'location016.png'
}, {
    id: 17,
    desc: "Вы в небольшой тёмной комнате, которая имеет опускную железную решётку, врезанную в северную стену. Если не считать решётки, то возможный выход - только на юг.",
    dir: [27, -1, 16, -1, -1, -1],
    img: 'location017.png'
}, {
    id: 18,
    desc: "Вы в комнате, заваленной мусором. Через мелкие дыры в стене слышны завывания ветра. Можно идти на север и восток.",
    dir: [16, 19, -1, -1, -1, 21],
    img: 'location018.png'
}, {
    id: 19,
    desc: "Вы стоите в богато украшенном вестибюле, который покрыт тонким слоем льда. Выходы на востоке и на западе.",
    dir: [-1, 20, -1, 18, -1, -1],
    img: 'location019.png'
}, {
    id: 20,
    desc: "Вы в жутко холодной комнате. Всё здесь покрыто толстым слоем льда. Выходы на западе и на севере.",
    dir: [25, -1, -1, 19, -1, -1],
    img: 'location020.png'
}, {
    id: 21,
    desc: "Вы в старой соляной шахте. Мрачный туннель ведёт на юг и на запад. Через отверстие в потолке можно пролезть наверх.",
    dir: [-1, -1, 23, 22, 18, -1],
    img: 'location021.png'
}, {
    id: 22,
    desc: "Вы находитесь в западной части шахты. Она выглядит выработанной и заброшенной. Выход ведёт на восток",
    dir: [-1, 21, -1, -1, -1, -1],
    img: 'location022.png'
}, {
    id: 23,
    desc: "Вы в южной части шахты. Здесь очень душно. Тоннели ведут на север и на юг.",
    dir: [21, -1, 24, -1, -1, -1],
    img: 'location023.png'
}, {
    id: 24,
    desc: "Вы в конце шахты, в тупике. Слышно, как капает вода. Выход отсюда - на север.",
    dir: [23, -1, -1, -1, -1, -1],
    img: 'location024.png'
}, {
    id: 25,
    desc: "Вы в комнате, которая когда-то была помещением для охраны. На одной из стен вы можете видеть чудом сохранившийся посреди всей этой разрухи рычаг. Выходы отсюда - на восток и на юг.",
    dir: [-1, 26, 20, -1, -1, -1],
    img: 'location025.png'
}, {
    id: 26,
    desc: "Вы в оружейной комнате. Её стены покрыты толстым слоем паутины, а вдоль стен стоят пустые оружейные полки. Выход отсюда - через дверь на западе.",
    dir: [-1, -1, -1, 25, -1, -1],
    img: 'location026.png'
}, {
    id: 27,
    desc: "Вы в роскошно обставленном зале, обстановка которого резко контрастирует с разрухой в других комнатах. Отсюда можно пройти на юг и на запад.",
    dir: [-1, -1, 17, 28, -1, -1],
    img: 'location027.png'
}, {
    id: 28,
    desc: "Вы в маленькой комнате. Сквозь разбитое окно в потолке дует холодный ветер. На кровати в углу спит принцесса, а воздух вокруг наэлектризован от чар. Выход - на востоке.",
    dir: [-1, 27, -1, -1, -1, -1],
    img: 'location028.png'
}];

const encounters = {
    // Добавляем дополнительную информацию к описанию локации в зависимости от различных условий
    addDescription() {
        const currentLocation = location.get();
        let description = "";

        if (currentLocation === 8 && flags.get("isLadderLeanToTree")) description += "<br>К дереву приставлена лестница.";
        if (currentLocation === 11 && flags.get("isDoorOpened")) description += "<br>Дверь открыта.";
        if (currentLocation === 7 && !flags.get("isTrollKilled")) description += "<br>Путь на восток преграждает толстый тролль.";
        if (currentLocation === 17 && !flags.get("isPortcullisOpened")) description += "<br>Решётка опущена - не пройти.";
        if (currentLocation === 17 && flags.get("isPortcullisOpened")) description += "<br>Решётка поднята к потолку.";
        if (currentLocation === 18 && flags.get("isTrapdoorOpened")) description += "<br>В полу комнаты дыра, через которую можно спуститься вниз.";
        if (currentLocation === 18 && !flags.get("isTrapdoorOpened")) description += "<br>В полу есть закрытый люк.";
        if (currentLocation === 23 && !flags.get("isWormKilled")) description += "<br>Вход в южный тоннель преграждает огромный скальный червь.";
        if (currentLocation === 20 && !flags.get("isMonsterKilled")) description += "<br>Северный проход охраняет страшный ледяной монстр.";
        if (currentLocation === 27 && !flags.get("isWitchKilled")) description += "<br>В противоположном конце комнаты вы видите ведьму. Её заклятье летит прямо в вашу сторону, нужно быстро что-то делать!";

        return description;
    },

    // Проверяем, мешает ли игроку что-либо двигаться в выбранном им направлении
    checkPlayerObstacles(direction) {
        const currentLocation = location.get();

        if (currentLocation === 7 && !flags.get("isTrollKilled") && direction === 1) {
            return "Тролль рычит и не даёт мне пройти.";
        }
        if (currentLocation === 8 && !flags.get("isLadderLeanToTree") && direction === 4) {
            return "Я не могу залезть на дерево. Ствол очень гладкий, не за что зацепиться";
        }
        if (currentLocation === 11 && !flags.get("isDoorOpened") && direction === 1) {
            return "Дверь закрыта, я не могу туда пройти.";
        }
        if (currentLocation === 17 && !flags.get("isPortcullisOpened") && direction === 0) {
            return "Решётка опущена до пола, она мешает мне пройти.";
        }
        if (currentLocation === 18 && !flags.get("isTrapdoorOpened") && direction === 5) {
            return "Путь вниз мне преграждает закрытый люк.";
        }
        if (currentLocation === 20 && !flags.get("isMonsterKilled") && direction === 0) {
            return "Ледяной монстр мешает мне пройти.";
        }
        if (currentLocation === 23 && !flags.get("isWormKilled") && direction === 2) {
            return "Скальный червь мешает мне пройти.";
        }

        return "";
    },

    // Функция возвращает текст для вывода на экран окончания игры
    getGameOverText() {
        if (flags.get("isDiedFromFish")) {
            return 'Я почувствовал острую боль в животе и умер. Глупо, конечно, заканчивать это приключение, отравившись протухшей рыбой.';
        }
        
        return gameDefaultTexts.defaultGameOverText;
    },

    // Функция проверяет, действует ли в локации какое-либо условие, не укладывающееся в общую логику игры.
    getUniqueEncounter(verbId, objectIds) {
        let answer, flag = false;

        // В локации с ведьмой у игрока только один ход, чтобы отразить заклятье, иначе его выбрасывает в предыдущую комнату
        if (location.get() === 27 && !flags.get("isWitchKilled")) {
            flag = true;
            if (verbId === 29 && objectIds.includes(25)) {
                if (inventory.isItemInInventory(10)) {
                    flags.set("isWitchKilled");
                    inventory.removeItem(10);
                    answer = "Я отразил заклятье мечом, и оно ударило прямо в ведьму! Издав истошный крик, ведьма рассыпалась в пыль. К сожалению, меч тоже не уцелел.";
                } else {
                    location.set(17);
                    answer = "Мне нечем отразить заклятье. Заклятье ударяет мне в грудь и выкидывает из этой комнаты в комнату с решёткой."
                }
            } else {
                location.set(17);
                answer = "Я не успеваю ничего сделать. Заклятье ударяет мне в грудь и выкидывает из этой комнаты в комнату с решёткой.";
            }
        }

        return {
            answer,
            flag
        }
    },

    take(itemId) {
        // Если предмет - лестница, и она прислонена к дереву, то можно её забрать в инвентарь
        if (itemId === 0 && flags.get("isLadderLeanToTree")) {
            flags.set("isLadderLeanToTree");
            inventory.addItem(0);
            return "Я забрал лестницу.";
        }

        return "Я не могу это взять.";
    },

    drop(itemId) {
        if ((itemId === 11 || itemId === 12) && inventory.isItemInInventory(itemId) && (location.get() === 6 || location.get() === 12)) {
            inventory.removeItem(itemId);
            return "Я бросил монетку на землю, и она укатилась в пропасть.";
        }

        return "У меня нет этого.";
    },

    examine(objectId) {
        const currentLocation = location.get();

        if (currentLocation === 8 && objectId === 18) {
            return "Это невысокое, но широкое в обхвате дерево, превратившееся в камень под действием неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя что-то вроде гнезда.";
        }
        if (currentLocation === 8 && objectId === 0 && flags.get("isLadderLeanToTree")) {
            return "Лестница приставлена к дереву. Я могу залезть наверх.";
        }
        if ((currentLocation === 6 || currentLocation === 12) && objectId === 13) {
            return "Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.";
        }
        if (currentLocation === 14 && objectId === 14) {
            let answer = "Ветви этого куста похожи на щупальца.";
            if (!flags.get("isKeyRevealed")) {
                flags.set("isKeyRevealed");
                itemPlaces.set(6, 14);
                answer += " На одном из таких щупальцев я обнаружил ключ.";
            }
            return answer;
        }
        if (currentLocation === 11 && objectId === 16) {
            return flags.get("isDoorOpened") ? "Дверь открыта." : "Дверь заперта.";
        }
        if (currentLocation === 7 && !flags.get("isTrollKilled") && objectId === 17) {
            return "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
        }
        if (currentLocation === 17 && objectId === 19) {
            return flags.get("isPortcullisOpened") ? "Решётка поднята к потолку - проход свободен." : "Это мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
        }
        if (currentLocation === 18 && objectId === 20) {
            return flags.get("isTrapdoorOpened") ? "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
        }
        if (currentLocation === 5 && objectId === 21) {
            return "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";
        }
        if (currentLocation === 23 && !flags.get("isWormKilled") && objectId === 22) {
            return "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";
        }
        if (currentLocation === 20 && !flags.get("isMonsterKilled") && objectId === 23) {
            return "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";
        }
        if (currentLocation === 25 && objectId === 24) {
            return flags.get("isLeverOiled") ? "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать." : "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать.";
        }
        if (currentLocation === 28 && objectId === 26) {
            return "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";
        }
        if (objectId === 4 && inventory.isItemInInventory(4)) {
            let answer = vocabulary.objects[4].desc;
            if (!flags.get("isAxeRevealed")) {
                flags.set("isAxeRevealed");
                itemPlaces.set(5, currentLocation);
                answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
            }
            return answer;
        }

        return "Ничего необычного.";
    },

    throw (objectIds) {
        if (objectIds.includes(8) && inventory.isItemInInventory(8)) {
            inventory.removeItem(8);
            if (location.get() === 20 && !flags.get("isMonsterKilled")) {
                flags.set("isMonsterKilled");
                return "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
            } else {
                return "Я высыпал всю соль. Непонятно, правда, зачем было так делать - вдруг она бы мне пригодилась?";
            }
        }
        if (objectIds.includes(5) && inventory.isItemInInventory(5)) {
            return "Это явно не метательный топорик. Давайте попробуем что-то другое.";
        }
        if (objectIds.includes(2) && inventory.isItemInInventory(2)) {
            return "Слишком тяжёлая, чтобы метать. Ей надо бить, желательно промеж глаз.";
        }
        if (objectIds.includes(7) && inventory.isItemInInventory(7)) {
            inventory.removeItem(7);
            return "Я бросаю лампу, и она разбивается на осколки. И зачем нужно было это делать?";
        }

        return "Не сработает. А если вы хотите положить предмет на землю, то лучше введите команду ПОЛОЖИ.";

    },

    talk(objectIds) {
        if (objectIds.includes(21) && location.get() === 5) {
            return "Старушка рассказывает, что её муж делает лампы, а она их продаёт путникам - такая вещь в путешествии всегда пригодится. Если хотите купить лампу, вам придётся заплатить серебром. Ничего себе цены!";
        }
        if (objectIds.includes(17) && location.get() === 7 && !flags.get("isTrollKilled")) {
            return "Тролль злобно рычит в ответ.";
        }
        if (objectIds.includes(23) && location.get() === 20 && !flags.get("isMonsterKilled")) {
            return "У этого чудища нет рта, чтобы разговаривать.";
        }
        if (objectIds.includes(26) && location.get() === 28) {
            return "Чтобы с ней пообщаться, нужно её разбудить.";
        }

        return "Здесь не с кем говорить.";
    },

    buy(objectIds) {
        if (objectIds.includes(7) && location.get() === 5) {
            if (inventory.isItemInInventory(11)) {
                inventory.removeItem(11);
                inventory.addItem(7);
                return "Я купил у старушки лампу за серебряную монету";
            } else if (inventory.isItemInInventory(12)) {
                return 'Старушка пробует монету на зуб и говорит: "Нет, это не серебро!"';
            } else {
                return "У меня нет денег."
            }
        }

        return "Я не могу это купить";
    },

    pay(objectIds) {
        if (location.get() === 5) {
            if (objectIds.includes(11) && inventory.isItemInInventory(11)) {
                inventory.removeItem(11);
                inventory.addItem(7);
                return "Я купил у старушки лампу за серебряную монету";
            } else if (inventory.isItemInInventory(12)) {
                return 'Старушка пробует монету на зуб и говорит: "Нет, это не серебро!"';
            } else {
                return "Мне нужны деньги, чтобы заплатить."
            }
        }
        if (location.get() === 7 && !flags.get("isTrollKilled")) {
            return "Тролль злобно рычит на меня.";
        }

        return "Похоже, здесь никому не нужны деньги.";
    },

    hit(objectIds) {
        if (location.get() === 7 && !flags.get("isTrollKilled") && objectIds.includes(17)) {
            if (inventory.isItemInInventory(2)) {
                flags.set("isTrollKilled");
                inventory.removeItem(2);
                return "Я бросился на тролля и вломил ему булавой прямо по макушке! Дико заревев, искалеченный тролль с торчащей в черепе булавой убежал в лес. Теперь путь на восток свободен.";
            }
            if (inventory.isItemInInventory(5) && objectIds.includes(5)) {
                return "Не стоит с маленьким топориком лезть на большого тролля. Нужно что-то посерьёзнее.";
            }
            if (inventory.isItemInInventory(3) && objectIds.includes(3)) {
                return "Я похож на черепашку-ниндзя, чтобы нападать с деревянным шестом на толстого тролля?";
            }
            if (!inventory.isItemInInventory(3) && !inventory.isItemInInventory(5)) {
                return "Нападать на тролля с голыми руками? Нет уж!";
            }
            return "Уточните, чем это вы собираетесь убивать тролля?";
        }
        if (location.get() === 5 && objectIds.includes(21)) {
            if (inventory.isItemInInventory(5)) {
                return "Вам не кажется, что эта ситуация со старушкой и топором - из другого произведения?";
            }
            return "Эээ, я не стану нападать на добрую беззащитную старушку!";
        }
        if (location.get() === 23 && !flags.get("isWormKilled") && objectIds.includes(22)) {
            return "Шкура скального червя настолько твёрдая, что я не смогу повредить её никаким оружием.";
        }
        if (location.get() === 28 && objectIds.includes(26)) {
            return "Напоминаю, что эта прекрасная девушка - цель моего приключения. И я не хочу, чтобы это приключение закончилось плачевно.";
        }
        if (location.get() === 20 && !flags.get("isMonsterKilled") && objectIds.includes(23)) {
            return "На такого монстра идти разве что с боевым ледорубом. Но такого у меня точно нет, придётся искать какую-нибудь хитрость.";
        }
        if (inventory.isItemInInventory(5) && objectIds.includes(5)) {
            return "Ничего не произошло. Подсказка: если хотите что-то порубить топором, то лучше скажите мне РУБИ или РАЗРУБИ... или ПОРУБИ, ну, в общем, вы поняли."
        }

        return "Ничего не произошло.";
    },

    chop(objectIds) {
        if (!inventory.isItemInInventory(5)) {
            return "У меня нет топора."
        }
        if (location.get() === 18 && objectIds.includes(20) && !flags.get("isTrapdoorOpened")) {
            flags.set("isTrapdoorOpened");
            return "Я разломал топором деревянный люк. Теперь можно спуститься вниз.";
        }
        if ((location.get() === 7 && objectIds.includes(17)) || (location.get() === 20 && objectIds.includes(23)) || (location.get() === 23 && objectIds.includes(22))) {
            return "Этот топор хорош для колки дров, но в бою будет маловат и неудобен.";
        }
        if (location.get() === 8 && objectIds.includes(18)) {
            inventory.removeItem(5);
            return "Бить топором об камень - не самая хорошая идея. Но, тем не менее, я с размаху бью топором по дереву. Лезвие со свистом врезается в каменный ствол, сыплются искры, и мой топор разлетается на куски.";
        }
        if (location.get() === 14 && objectIds.includes(14)) {
            return "Вы когда-нибудь пробовали рубить топором кусты? Попробуйте на досуге. Здесь пригодился бы секатор, ну, или штыковая лопата, но уж точно не топор";
        }
        if (inventory.isItemInInventory(3) && objectIds.includes(3)) {
            inventory.removeItem(3);
            return "В ярости я накинулся на шест и порубил его в труху.";
        }
        if (itemPlaces.get(3) === location.get() && objectIds.includes(3)) {
            itemPlaces.set(3, -1);
            return "В ярости я накинулся на шест и порубил его в труху.";
        }
        if (inventory.isItemInInventory(4) && objectIds.includes(4)) {
            inventory.removeItem(4);
            return "Я бросил на землю дрова и порубил их в труху.";
        }
        if (itemPlaces.get(4) === location.get() && objectIds.includes(4)) {
            itemPlaces.set(4, -1);
            return "С особой жестокостью я уничтожил все дрова.";
        }
        if (location.get() === 5 && objectIds.includes(21)) {
            return "Вам не кажется, что эта ситуация со старушкой и топором - немного из другого произведения?";
        }
        if ((location.get() === 6 || location.get() === 12) && objectIds.includes(13)) {
            inventory.removeItem(5);
            return "Я нагнулся, чтобы перерубить верёвку, но моя рука дрогнула, и топор улетел в пропасть...";
        }

        return "Это делу не поможет."
    },

    open(objectIds) {
        if (location.get() === 11 && objectIds.includes(16)) {
            if (inventory.isItemInInventory(6) && !flags.get("isDoorOpened")) {
                flags.set("isDoorOpened");
                inventory.removeItem(6);
                return "Я открыл дверь ключом и теперь могу пройти в замок. Правда, ключ намертво застрял в замочной скважине, но вряд ли теперь он мне понадобится.";
            } else if (!flags.get("isDoorOpened")) {
                return "Кажется, дверь заперта. Мне нужен ключ.";
            } else {
                return "Дверь уже открыта, я могу пройти."
            }
        }
        if (location.get() === 18 && objectIds.includes(20) && !flags.get("isTrapdoorOpened")) {
            return "Я не представляю, как его открыть. Здесь нет никакой ручки, не за что зацепиться.";
        }

        return "Тут нечего открывать.";
    },

    lean(objectIds) {
        if (objectIds.includes(0) && !flags.get("isLadderLeanToTree") && inventory.isItemInInventory(0)) {
            flags.set("isLadderLeanToTree");
            inventory.removeItem(0);
            return "Я прислонил лестницу к дереву.";
        }

        return "Хм, это делу не поможет.";
    },

    destroy(objectIds) {
        if (objectIds.includes(0) && inventory.isItemInInventory(0)) {
            inventory.removeItem(0);
            itemPlaces.set(3, location.get());
            return "Я разломал лестницу на куски и получил неплохой длинный шест.";
        }
        if (objectIds.includes(20) && location.get() === 18 && !flags.get("isTrapdoorOpened")) {
            if (inventory.isItemInInventory(5)) {
                flags.set("isTrapdoorOpened");
                return "Я разломал топором деревянный люк. Теперь путь вниз открыт.";
            } else {
                return "У меня нет ничего, чем я могу сломать люк.";
            }
        }
        if (!inventory.isItemInInventory(objectIds[0]) && !inventory.isItemInInventory(objectIds[1])) {
            return "Нужно сначала взять это в руки.";
        }

        return "Я не могу это сломать";
    },

    cross(objectIds) {
        if (objectIds.includes(13) && (location.get() === 6 || location.get() === 12)) {
            let answer;
            if (inventory.isItemInInventory(3)) {
                answer = "Балансируя с помощью шеста, я пересёк расщелину по верёвке.";
                if (location.get() === 6) {
                    location.set(12);
                } else {
                    location.set(6);
                }
            } else {
                answer = "Я упаду с верёвки, мне нужно что-то для балланса.";
            }
            return answer;
        }

        return "Решительно не понимаю, что вы хотите сделать.";
    },

    climb(objectIds) {
        if (location.get() === 8) {
            if (flags.get("isLadderLeanToTree")) {
                location.set(9);
                return "Я залез на дерево по лестнице.";
            } else {
                return "Я не могу залезть на дерево, его ствол гладкий, не за что зацепиться.";
            }
        }

        return "Я не могу туда залезть";
    },

    go() {
        return gameDefaultTexts.helpMessage;
    },

    eat(objectIds) {
        if (objectIds.includes(1)) {
            if (inventory.isItemInInventory(1)) {
                flags.set("isGameOver");
                flags.set("isDiedFromFish");
                return "";
            } else {
                return "У меня нет рыбы.";
            }
        }

        return "Я не буду это есть.";
    },

    turnOn(objectIds) {
        if (objectIds.includes(7) && inventory.isItemInInventory(7)) {
            if (!flags.get("isLampEmpty")) {
                flags.set("isLampEmpty");
                if (location.get() === 23 && !flags.get("isWormKilled")) {
                    flags.set("isWormKilled");
                    return "Я включаю лампу, и её яркий свет озаряет шахту. Червь, привыкший к темноте, издаёт кошмарный вопль и уползает в глубины подземелья. Через несколько мгновений лампа тухнет.";
                } else {
                    return "Я включаю лампу, она ярко горит всего несколько мгновений, а потом тухнет.";
                }
            } else {
                return "Я пробую включить лампу, но ничего не происходит. Надо бы её заправить чем-нибудь горючим.";
            }
        }
        if (objectIds.includes(24) && location.get() === 25) {
            return "Может, лучше нажать на рычаг?";
        }

        return "У меня нет ничего такого, что можно было бы включить."
    },

    pour(objectIds) {
        if (objectIds.includes(8) && inventory.isItemInInventory(8)) {
            inventory.removeItem(8);
            if (location.get() === 20 && !flags.get("isMonsterKilled")) {
                flags.set("isMonsterKilled");
                return "Я бросил мешочек с солью в монстра, и как только крупинки соли коснулись его поверхности, монстр превратился в лужу воды.";
            } else {
                return "Я высыпал всю соль. Непонятно, правда, зачем было так делать - вдруг она бы мне пригодилась?";
            }
        }

        return "Решительно не понимаю, что мне тут рассыпать?";
    },

    fuel(objectIds) {
        if (objectIds.includes(7) && inventory.isItemInInventory(7)) {
            if (inventory.isItemInInventory(9)) {
                if (flags.get("isLampEmpty")) {
                    flags.set("isLampEmpty");
                    return "Я залил немного масла в лампу.";
                } else {
                    return "В лампе достаточно масла, чтобы её включить.";
                }
            } else {
                return "У меня нет ничего, чем я могу заправить лампу";
            }
        } else {
            return "Не совсем понимаю, что вы хотите тут зарядить или заправить.";
        }
    },

    oil(objectIds) {
        if (inventory.isItemInInventory(9)) {
            if (objectIds.includes(24) && location.get() === 25) {
                if (flags.get("isLeverOiled")) {
                    return "Рычаг уже смазан.";
                } else {
                    flags.set("isLeverOiled");
                    inventory.removeItem(9);
                    return "Я аккуратно смазал рычаг и детали управляемого им механизма, потратив всё масло.";
                }
            }
            return "Здесь смазка не нужна.";
        } else {
            return "Для этого мне понадобится масло.";
        }
    },

    press(objectIds) {
        if (objectIds.includes(24) && location.get() === 25) {
            if (flags.get("isLeverOiled")) {
                flags.set("isPortcullisOpened");
                return "Я нажал на рычаг. Вдали послышался какой-то лязг";
            } else {
                return "Я давлю на рычаг, но он не двигается с места. Слишком тут всё проржавело.";
            }
        }

        return "Здесь нечего нажимать."
    },

    reflect(objectIds) {
        return "Не понимаю, что вы хотите сделать.";
    },

    kiss(objectIds) {
        if (objectIds.includes(26) && location.get() === 28) {
            flags.set("isVictory");
            return "Вы целуете принцессу в бледные губы, и её глаза открываются. Вы разбудили принцессу и выиграли игру!";
            // Выход на экран победы в игре
        }
        if (objectIds.includes(21) && location.get() === 5) {
            return "А вы, батенька, шалун!";
        }

        return "Я не буду это целовать.";
    },

    wake(objectIds) {
        if (objectIds.includes(26) && location.get() === 28) {
            return "Я бы рад разбудить её, но как? Есть конкретные предложения?";
        }

        return "Я не совсем понимаю, кого вы тут хотите разбудить.";
    }
}

const gameDefaultTexts = {
    info: 'Я понимаю команды в формате ГЛАГОЛ + ОБЪЕКТ (+ ОБЪЕКТ), например, <span style="color: yellow;">ВОЗЬМИ ЛЕСТНИЦУ</span> или <span style="color: yellow;">НАБЕРИ ВОДЫ В КУВШИН.</span> Язык игры - русский, регистр букв не имеет значения.<br>Используйте команды <span style="color: yellow;">С (север), Ю (юг), З (запад), В (восток), Х (вверх), Н (вниз)</span> для передвижения. <span style="color: yellow;">ОСМОТРИ</span> помогает получить больше информации об игровых объектах. <span style="color: yellow;">И</span> - ваш инвентарь. <span style="color: yellow;">ВЫХОД</span> позволяет вернуться на стартовый экран. Остальные команды вам предстоит открыть самостоятельно. Удачной игры!',

    startMainText: '<span style="color: lime;">❀⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱СПЯЩАЯ КРАСАВИЦА⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱─⊰✫⊱❀</span><br><br>В этом приключении вам нужно пробраться в заброшенный замок, найти волшебный меч и спасти спящую беспробудным сном красавицу, которую усыпила злая ведьма. Исследуйте мир игры, отдавая компьютеру текстовые команды. Если не знаете, как это делается, введите команду-подсказку <span style="color: yellow;">ИНФО</span>.',

    victoryText: 'Этот текст выводится когда игрок побеждает!',

    helpMessage: 'Используйте команды <span style="color: yellow;">С (север), Ю (юг), З (запад), В (восток), Х (вверх), Н (вниз)</span> для передвижения.',

    defaultDescription: 'Ничего необычного.',

    defaultQuestion: 'Что будете делать?',

    defaultAnswer: 'Я не понимаю.',
    
    defaultAnswerToTake: 'Ок, взял.',

    defaultAnswerToDrop: 'Ок, положил.',

    playerCantGo: 'Я не могу туда пройти.',

    itemsInLocation: 'Здесь также есть:',

    itemNotInInventory: 'Чтобы внимательно осмотреть предмет, нужно взять его в руки.',

    specifyAdjective: 'Пожалуйста, уточните прилагательное для этого объекта.',

    specifyObject: 'Пожалуйста, уточните, какой конкретно из объектов вы имеете ввиду?',

    okMessage: "Ок",

    firstGameMessage: 'Ваше приключение начинается! Что будете делать?',

    pressEnterToStart: 'Нажмите ENTER для начала игры',

    pressEnterToStartAgain: 'Нажмите ENTER, если хотите снова сыграть.',

    defaultGameOverText: 'Ваша игра закончилась.'
}

const gameDefaultImages = {
    startImage: '<img src="img/startscreen.png">',
    gameOverImage: '<img src="img/gameover.png">',
    victoryImage: '<img src="img/victory.png">'
}

export {
    resetGameState,
    vocabulary,
    locations,
    encounters,
    gameDefaultTexts,
    gameDefaultImages
};