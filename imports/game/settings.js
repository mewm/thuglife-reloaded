import {ReactiveVar} from "meteor/reactive-var";

export class GameSettings {
	constructor()
	{
		this.tweak     = 8096;
		this.chunkSize = 1024;
		this.cellSize  = 32;
		this.chunks    = 2;  
		
		this.canvasW = 1024;
		this.canvasH = 1024;
		
		

		this.debug = {
			tile: new ReactiveVar(true),
			chunk: new ReactiveVar(true)
		}
	}
}

