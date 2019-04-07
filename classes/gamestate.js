import Counters from './counters.js';
import Flags from './flags.js';
import Inventory from './inventory.js';
import ItemPlaces from './itemplaces.js';
import CurrentLocation from './location.js';

/*

const state = [{state1}, {state2}, {state3}]

state1 = {
	inventory: [],
	currentLocation: число,
	flags: {},
	counters: {},
	itemPlaces: {}
}

save - добавляем в массив состояний объект state (это происходит каждый ход)
restore - восстанавливаем предыдущее состояние во все классы

+++1. Прописать всем классам метод getAll()
+++2. Прописать логику Restore
3. Включить это в основной игровой цикл и привязать к команде ОТМЕНА

*/

const GameState = {
	_state: [],
	_lastMove: {},

	clear() {
		this._state.length = 0;
		this._lastMove.length = 0;
	},

	save() {
		const curI = [].concat(Inventory.getAll());
		const curL = CurrentLocation.get().valueOf();
		const curF = Object.assign({}, Flags.getAll());
		const curC = Object.assign({}, Counters.getAll());
		const curP = Object.assign({}, ItemPlaces.getAll());
		this._state.push(this._lastMove);
		this._lastMove = Object.assign({}, { curI, curL, curF, curC, curP	});
		console.log('SAVED:');
		console.log(this._state);
	},

	restore() {
		console.log(this._state);
		if (this._state.length > 0) {
			const { curI, curL, curF, curC, curP } = this._state.pop();
			this._lastMove = Object.assign({}, { curI, curL, curF, curC, curP	});
			Inventory.init(curI);
			CurrentLocation.set(curL);
			Flags.init(curF);
			Counters.init(curC);
			ItemPlaces.init(curP);
		}
	},
};

export default GameState;