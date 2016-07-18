import {ReactiveVar} from "meteor/reactive-var";

export class GameSettings {
	constructor(game)
	{
		this.game = game;
		this.tweak     = 1024*16;
		this.chunkSize = 1024;
		this.cellSize  = 32;
		this.chunks    = 3;  
		
		// set after initialisation 
		this.canvasW = 0;
		this.canvasH = 0;
		
		this.energyDecay = 0.0001;

		this.debug = {
			tile: new ReactiveVar(false),
			chunk: new ReactiveVar(true)
		}
	}
}

