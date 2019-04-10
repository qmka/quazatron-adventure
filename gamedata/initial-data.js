const defaultLocation = 0;

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
    12: 2,
    27: -1
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
    isDiedFromTrollWithAxe: false,
    isDiedFromTrollWithoutWeapon: false,
    isDiedFromTrollWithStick: false,
    isDiedFromMonster: false,
    isDiedFromWorm: false,
    isDiedFromLady: false,
    isDiedByCutRope: false,
    isKilledPrincess: false,
    isFellIntoAbyss: false,
    isVictory: false,
    isGameOver: false
}

const initialCounters = {
    gameTurns: 0
}

const initialInventory = [27];

export {
    defaultLocation,
    initialFlags,
    initialItemPlaces,
    initialCounters,
    initialInventory
};