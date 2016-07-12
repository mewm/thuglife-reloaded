import {ReactiveVar} from "meteor/reactive-var";

export class GameSettings {
	constructor()
	{
		this.tweak     = 8096;
		this.chunkSize = 1024;
		this.tileSize  = 32;
		this.chunks    = 1;

		this.debug = {
			renderChunkDebug: new ReactiveVar(true),
			renderTileDebug: new ReactiveVar(true)
		}
	}
}

