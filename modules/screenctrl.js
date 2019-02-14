import { USER_HAVE_ITEM } from './constants.js';

const makeLocation = (g) => {
    let description = "";
    g.locations.forEach(e => {
        if (e.index === g.currentLoc) {
            description += e.desc;
        }
    })

    if (g.flags.isLadderLeanToTree && g.currentLoc === 8) description += "<br>К дереву приставлена лестница.";
    if (g.currentLoc === 11 && g.flags.isDoorOpened) description += "<br>Дверь открыта.";
    if (g.currentLoc === 7 && !g.flags.isTrollKilled) description += "<br>Путь на восток преграждает толстый тролль.";
    if (g.currentLoc === 17 && !g.flags.isPortcullisOpened) description += "<br>Решётка опущена - не пройти.";
    if (g.currentLoc === 17 && g.flags.isPortcullisOpened) description += "<br>Решётка поднята к потолку.";
    if (g.currentLoc === 18 && g.flags.isTrapdoorOpened) description += "<br>В полу комнаты дыра, через которую можно спуститься вниз.";
    if (g.currentLoc === 18 && !g.flags.isTrapdoorOpened) description += "<br>В полу есть закрытый люк.";
    if (g.currentLoc === 23 && !g.flags.isWormKilled) description += "<br>Вход в южный тоннель преграждает огромный скальный червь.";
    if (g.currentLoc === 20 && !g.flags.isMonsterKilled) description += "<br>Северный проход охраняет страшный ледяной монстр.";
    if (g.currentLoc === 27 && !g.flags.isWitchKilled) description += "<br>В противоположном конце комнаты вы видите ведьму. Её заклятье летит прямо в вашу сторону, нужно быстро что-то делать!";

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
            return e.place === USER_HAVE_ITEM;
        })) {
        g.objects.forEach(e => {
            if (e.place === USER_HAVE_ITEM) {
                inventory += `${e.id}<br>`;
            }
        })
    } else {
        inventory += `пусто<br>`;
    }
    return inventory;
}


const makeScreen = (g, actionText) => {
    document.getElementById("screen").innerHTML = makeLocation(g);
    document.getElementById("right-sidebar").innerHTML = makeInventory(g);
    document.getElementById("image").innerHTML = `<img src="img/${g.locations[g.currentLoc].img}">`
    document.getElementById("action").innerHTML = actionText;
    document.getElementById("input-area").style.display = "block";
};

const makeStaticScreen = (text, sidebar, action) => {
    document.getElementById("screen").innerHTML = text;
    document.getElementById("right-sidebar").innerHTML = sidebar;
    document.getElementById("action").innerHTML = action;
    document.getElementById("input-area").style.display = "none";
}

export { makeScreen, makeStaticScreen };