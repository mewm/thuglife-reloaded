import {ReactiveVar} from "meteor/reactive-var";

export class GameSettings {
	constructor()
	{
		this.tweak     = 8096;
		this.chunkSize = 1024;
		this.cellSize  = 32;
		this.chunks    = 3;  
		
		this.canvasW = 1024;
		this.canvasH = 1024;
		
		this.energyDecay = 0.0001;

		this.debug = {
			tile: new ReactiveVar(false),
			chunk: new ReactiveVar(false)
		}
	}
}

