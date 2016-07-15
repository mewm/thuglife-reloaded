export class Camera {
	constructor(xView, yView, canvasWidth, canvasHeight, worldWidth, worldHeight)
	{
		this.xView        = xView;
		this.yView        = yView;
		this.canvasWidth  = canvasWidth;
		this.canvasHeight = canvasHeight;
		this.worldWidth   = worldWidth;
		this.worldHeight  = worldHeight;
		
		this.gui = null;
		this.world = null;
		this.follower = null;
	}
	
	tick()
	{
		if(this.follower !== null) {
 			this.world.pivot.x = this.follower.position.x;
 			this.world.pivot.y = this.follower.position.y;
		}
	}
}