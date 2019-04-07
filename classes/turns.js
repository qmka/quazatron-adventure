import Counters from './counters.js';
import Flags from './flags.js';
import Inventory from './inventory.js';
import ItemPlaces from './itemplaces.js';
import CurrentLocation from './location.js';

const GameTurns = {
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

export default GameTurns;