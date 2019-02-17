import {
    vocabulary
} from './gamedata.js';

const getItemDescriptionById = (id) => {
    const item = vocabulary.objects.find(e => e.id === id);
    return item.desc;
}

const userExamineObject = (object, inventory, itemPlaces, currentLocation, flags) => {
    let answer;
    if (object === "пропасть" && (currentLocation === 6 || currentLocation === 12)) answer = "Передо мной узкая, но глубокая пропасть. Через неё можно перейти по верёвке, но перед этим озаботьтесь тем, чтобы суметь удержать равновесие. Верёвка на вид крепкая.";

    if (object === "куст" && currentLocation === 14) {
        answer = "Ветви этого куста похожи на щупальца осминога.";
        if (!flags.isKeyRevealed) {
            flags.isKeyRevealed = true;
            inventory["ключ"] = true;
            answer += " На одном из таких щупальцев я обнаружил ключ.";
        }
    }

    if (object === "дверь" && currentLocation === 11) {
        answer = flags.isDoorOpened ? "Дверь открыта." : "Дверь заперта.";
    }

    if (object === "тролль" && currentLocation === 7 && !flags.isTrollKilled) {
        answer = "Это огромный мерзкий зелёный тролль. Ничего, кроме страха и омерзения, не вызывает.";
    }

    if (object === "дерево" && currentLocation === 8) answer = "Это невысокое, но очень широкое в обхвате дерево, превратившееся в камень под действием какого-то неизвестного колдовства. Ствол дерева гол словно столб, а на вершине в два моих роста ветви хитро переплетаются, образуя нишу.";

    if (object === "решётка" && currentLocation === 17) {
        answer = flags.isPortcullisOpened ? "Решётка поднята к потолку - проход свободен." : "Мощная железная решётка с толстыми прутьями. Своими силами такую не поднять, но, может быть, где-то я найду подъёмный механизм?";
    }

    if (object === "люк" && currentLocation === 18) {
        answer = flags.isTrapdoorOpened ? "Здесь уже дыра вместо люка, да щепки вокруг разбросаны." : "Это деревянный люк,  закрывающий путь вниз. Я не вижу никакой ручки, с помощью которой можно открыть этот люк, видимо, время её не пощадило.";
    }

    if (object === "старушка" && currentLocation === 5) answer = "Это старая женщина в деревенской одежде. Рядом с ней на куске ткани разложены различные масляные лампы, которые она продаёт.";

    if (object === "червь" && currentLocation === 23 && !flags.isWormKilled) answer = "Огромный скальный червь. Его шкура крепче камня, и ходят легенды, что убить эту тварь невозможно в принципе. Эти древние злобные создания проводят всю жизнь под землёй и никогда не видят солнечного света.";

    if (object === "монстр" && currentLocation === 20 && !flags.isMonsterKilled) answer = "Этот монстр кажется слепленным из бесформенных глыб льда. Судя по всему, именно из-за него замёрзли ближайшие комнаты.";

    if (object === "рычаг" && currentLocation === 25) {
        answer = flags.isLeverOiled ? "Это ржавый рычаг, присоединённый к какому-то механизму. Я его смазал, теперь его можно нажимать." : "Это ржавый рычаг, присоединённый к какому-то механизму. Нажать не получится - за долгие годы он сильно проржавел. Не мешало бы его смазать."
    }

    if (object === "принцесса" && currentLocation === 28) answer = "Прекрасная, но очень бледная. Её грудь медленно поднимается и опускается: принцесса крепко спит.";

    return {
        answer: answer,
        inventory: inventory,
        itemPlaces: itemPlaces,
        flags: flags
    }
}

const userExamineItem = (item, inventory, itemPlaces, currentLocation, flags) => {
    let answer;

    if (item === "дрова" && inventory[item]) {
        answer = getItemDescriptionById(item);
        if (!flags.isAxeRevealed) {
            flags.isAxeRevealed = true;
            itemPlaces["топор"] = currentLocation;
            answer += " Осматривая вязанку, я обнаружил спрятанный в ней топор.";
        }
    }

    if (item === "лестница" && flags.isLadderLeanToTree && currentLocation === 8) answer = "Лестница приставлена к дереву. Я могу залезть наверх.";

    return {
        answer: answer,
        inventory: inventory,
        itemPlaces: itemPlaces,
        flags: flags
    }
}

export { userExamineObject, userExamineItem };