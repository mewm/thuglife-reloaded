import PIXI from "../../../node_modules/pixi.js";

import {GameEngine} from "../game-engine";

export class Camera extends PIXI.Container {
	constructor(game)
	{
		super();
		
		// Main game
		this.game     = game;
		this.settings = game.settings;
		this.interactive = true;

		// Scene and GUI
		this.scene = game.scene;
		this.gui   = GameEngine.createEmptyContainer();
		super.addChild(this.gui);

		// Add camera info
		this.fps        = 0;
		this.cameraInfo = new PIXI.Text(this.fps, {
			font: '16px Arial', fill: 0xffffff, stroke: 0x000000, strokeThickness: 2
		});

		// Trigger resize to adjust canvas
		this.onResize();

	}

	onResize()
	{
		let settings     = this.settings;
		
		settings.canvasW = this.game._$canvas.width() - 300;
		settings.canvasH = this.game._$canvas.height();

		// Adjust X Y to center on canvas. Adjust pivot to have center of camera on X Y position on world  
		this.scene.x = settings.canvasW / 2; // canvasW/2
		this.scene.y = settings.canvasH / 2; // canvasH/2
	}

	moveTo(x, y)
	{
		this.scene.pivot.x = x;
		this.scene.pivot.y = y;
	}

	moveLeft(amount)
	{

		this.scene.pivot.x -= amount;
	}

	moveRight(amount)
	{
		this.scene.pivot.x += amount;
	}

	moveUp(amount)
	{
		this.scene.pivot.y -= amount;
	}

	moveDown(amount)
	{
		this.scene.pivot.y += amount;
	}

	follow(player)
	{
		cn.local('Camera following: <strong>' + player.name + '</strong>');
		this.moveToPlayer(player);
		this.following = player;
		return this;
	}

	unfollow()
	{
		if (this.following) {
			cn.local('Camera unfollowing: <strong>' + this.following.name + '</strong>');
			this.following = null;
		}
		return this;
	}

	followPlayer(player)
	{
		this.moveToPlayer(player)
			.follow(player)
			.update();
		return this;
	}

	moveToPlayer(player)
	{
		this.moveTo(player.shape.x, player.shape.y);
		return this;
	}

	update()
	{
		this.tick();
		this.fps.text        = this.game.ticker.FPS;
		this.cameraInfo.text = 'Camera/scene pos: ' + this.scene.x + ',' + this.scene.y + ' pivot: ' + this.scene.pivot.x + ',' + this.scene.pivot.y;
		this.game.renderer.render(this);
	}

	tick()
	{
		if (this.following !== null) {
// 			this.game.scene.pivot.x = this.following.shape.x;
// 			this.game.scene.pivot.y = this.following.shape.y;
		}
	}

	addFpsTicker()
	{
		let textOptions = {
			font: '16px Arial', fill: 0xffffff, stroke: 0x000000, strokeThickness: 2
		};
		this.fps        = new PIXI.Text('Camera stats loading...', textOptions);
		this.fps.x      = 10;
		this.fps.y      = 10;
		this.gui.addChild(this.fps);
	}

	addCameraStats()
	{
		this.cameraInfo.x = 400;
		this.cameraInfo.y = 10;
		this.gui.addChild(this.cameraInfo);
	}

	debugVisibility(key, toggle)
	{
		this.setDebugLayerVisibility(key, toggle);
	}

	/**
	 * @param key
	 * @param visibility
	 */
	setDebugLayerVisibility(key, visibility)
	{
		this.game.world._debugLayers[key].visible = visibility;
	}

}