const objects = [{
    id: 0,
    name: "лестница",
    forms: ["лестница", "лестницу", "лестницой", "лестнице"],
    canHold: true,
    desc: "Это деревянная приставная лестница в полтора метра высотой. Достаточно лёгкая, чтобы носить её с собой, но при этом довольно хлипкая, легко сломать.",
    //adjective: -1
}, {
    id: 1,
    name: "рыба",
    forms: ["рыба", "рыбу", "рыбе", "рыбой"],
    canHold: true,
    desc: "Это красная рыба, гнилая и вонючая. Такую в руках держать неприятно, а с собой таскать - так вообще мерзко.",
    //adjective: -1
}, {
    id: 2,
    name: "булава",
    forms: ["булава", "булавой", "булаве", "булаву"],
    canHold: true,
    desc: "Это короткая булава с шипами. На её рукояти выгравированы слова: СМЕРТЬ ТРОЛЛЯМ.",
    //adjective: -1
}, {
    id: 3,
    name: "шест",
    forms: ["шест", "шеста", "шестом", "шесту"],
    canHold: true,
    desc: "Это шест, который остался от разломанной вами лестницы.",
    //adjective: -1
}, {
    id: 4,
    name: "дрова",
    forms: ["дрова", "дровам", "дров"],
    canHold: true,
    desc: "Это вязанка берёзовых дров, довольно тяжёлая.",
    //adjective: -1
}, {
    id: 5,
    name: "топор",
    forms: ["топор", "топору", "топора", "топором"],
    canHold: true,
    desc: "Это добротный, хорошо заточенный топор.",
    //adjective: -1
}, {
    id: 6,
    name: "ключ",
    forms: ["ключ", "ключом", "ключа", "ключу"],
    canHold: true,
    desc: "Это тяжёлый фигурный ключ из слоновой кости.",
    //adjective: -1
}, {
    id: 7,
    name: "лампа",
    forms: ["лампа", "лампу", "лампы", "лампе", "лампой"],
    canHold: true,
    desc: "Это одноразовая лампа. При необходимости её можно включить, но, по словам старушки, она горит недолго, хоть и очень ярко.",
    //adjective: -1
}, {
    id: 8,
    name: "соль",
    forms: ["соль", "соли", "солью", "мешочек", "мешочком", "мешочку", "мешочка"],
    canHold: true,
    desc: "Это соль в мешочке, на вид и на вкус вполне обычная.",
    //adjective: -1
}, {
    id: 9,
    name: "масло",
    forms: ["масло", "маслом", "маслу", "масленка", "маслёнка", "масленкой", "маслёнкой", "маслёнку", "масленку", "масленке", "маслёнке"],
    canHold: true,
    desc: "Это маслёнка с маслом. Пригодится, если нужно будет что-нибудь смазать.",
    //adjective: -1
}, {
    id: 10,
    name: "меч",
    forms: ["меч", "мечу", "мечом", "меча"],
    canHold: true,
    desc: "Это длинный обоюдоострый меч. Его эфес украшают две химеры, а поверхность лезвия за долгие годы не утратила своего блеска: в него можно смотреться словно в зеркало.",
    //adjective: -1
}, {
    id: 11,
    name: "серебряная монета",
    forms: ["монета", "монету", "монете", "монетой"],
    canHold: true,
    desc: "Это старая серебряная монета с профилем короля.",
    adjective: 0,
}, {
    id: 12,
    name: "медная монета",
    forms: ["монета", "монету", "монете", "монетой"],
    canHold: true,
    desc: "Это старая медная монета с профилем короля.",
    adjective: 1,
}, {
    id: 13,
    forms: ["пропасть", "пропасти", "пропастью", "расщелина", "расщелиной", "расщелину", "расщелины", "верёвка", "веревка", "верёвке", "веревке", "верёвку", "веревку", "верёвки", "веревки", "ущелье", "ущелья"],
    canHold: false,
    desc: "Передо вами узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.",
    adjective: -1,
    location: [12, 6]
}, {
    id: 14,
    forms: ["куст", "куста", "кусту", "кустом"],
    canHold: false,
    adjective: -1,
    location: 14
}, {
    id: 15,
    forms: ["ветви", "ветвей", "ветвям", "щупальца", "щупалец", "щупальцам"],
    canHold: false,
    adjective: -1,
    location: 14
}, {
    id: 16,
    forms: ["дверь", "двери", "дверью"],
    canHold: false,
    adjective: -1,
    location: 11
}, {
    id: 17,
    forms: ["тролль", "тролля", "троллю", "троллем"],
    canHold: false,
    adjective: -1,
    location: 7
}, {
    id: 18,
    forms: ["дерево", "дереву", "деревом", "дерева"],
    canHold: false,
    desc: "Это невысокое, но широкое в обхвате дерево, превратившееся в камень под действием неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя что-то вроде гнезда.",
    adjective: -1,
    location: 8
}, {
    id: 19,
    forms: ["решётка", "решетка", "решётку", "решетку", "решёткой", "решеткой", "решётки", "решетки"],
    canHold: false,
    adjective: -1,
    location: 17
}, {
    id: 20,
    forms: ["люк", "люку", "люка", "люком"],
    canHold: false,
    adjective: -1,
    location: 18
}, {
    id: 21,
    forms: ["старушка", "старушку", "старушки", "старушке", "старушкой", "старуха", "старуху", "старухи", "старухе", "старухой", "бабка", "бабку", "бабки", "бабке", "бабкой", "бабушка", "бабушку", "бабушки", "бабушке", "бабушкой"],
    canHold: false,
    desc: "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.",
    adjective: -1,
    location: 5
}, {
    id: 22,
    forms: ["червь", "червя", "червю", "червяк", "червяка", "червяку"],
    canHold: false,
    adjective: -1,
    location: 23
}, {
    id: 23,
    forms: ["монстр", "монстра", "монстру", "монстре", "монстром"],
    canHold: false,
    adjective: -1,
    location: 20
}, {
    id: 24,
    forms: ["рычаг", "рычага", "рычагом", "рычагу", "механизм", "механизма", "механизмом", "механизму"],
    canHold: false,
    adjective: -1,
    location: 25
}, {
    id: 25,
    forms: ["заклятье", "заклинание", "заклятью", "заклятьем", "заклятья"],
    canHold: false,
    adjective: -1,
    location: 27
}, {
    id: 26,
    forms: ["принцесса", "принцессу", "принцессе", "принцессой", "принцессы"],
    canHold: false,
    desc: "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.",
    adjective: -1,
    location: 28
}, {
    id: 27,
    forms: ["часы", "часов", "часами", "часам"],
    name: "часы",
    canHold: true,
    desc: "Это волшебные часы, которые показывают, сколько ходов в игре вы уже сделали.",
    adjective: -1
}, {
    id: 28,
    forms: ["все", "всё"],
    canHold: false,
    adjective: -1
}]

export default objects