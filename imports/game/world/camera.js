import {ElementFactory} from "./elementFactory";
import PIXI from "../../../node_modules/pixi.js";

export class Camera {
	constructor(canvas, settings, ticker)
	{
		this.canvas         = canvas;
		this.settings       = settings;
		this.ticker         = ticker;
		this.elementFactory = new ElementFactory(this.settings);

		// Containers
		this.gui   = this.elementFactory.createEmptyContainer();
		this.scene = this.elementFactory.createEmptyContainer();
		this.prepareWorldContainerWithLayers();
		this.onResize();

		this.renderer = PIXI.autoDetectRenderer(settings.canvasW, settings.canvasH, {backgroundColor: 0x34495e});

		// Main view
		this.cameraContainer             = new PIXI.Container();
		this.cameraContainer.interactive = true;

		// Add world and gui to camera
		this.cameraContainer.addChild(this.scene);
		this.cameraContainer.addChild(this.gui);

		this.following = null;

		this.fps = 0;

		let textOptions = {
			font: '16px Arial', fill: 0xffffff, stroke: 0x000000, strokeThickness: 2
		};
		this.cameraInfo = new PIXI.Text(this.fps, textOptions);

	}

	onResize()
	{
		this.settings.canvasW = this.canvas.width() - 300;
		this.settings.canvasH = this.canvas.height();

		// Adjust X Y to center on canvas. Adjust pivot to have center of camera on X Y position on world  
		this.scene.x = this.settings.canvasW / 2; // canvasW/2
		this.scene.y = this.settings.canvasH / 2; // canvasH/2
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

	addPlayerAndFollow(player)
	{
		this.scene.addChild(player.shape);
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

	addToLayer(container, layer)
	{
		this.worldLayers[layer].addChild(container);
	}

	update()
	{
		this.tick();
		this.fps.text        = this.ticker.FPS;
		this.cameraInfo.text = 'Camera/scene pos: ' + this.scene.x + ',' + this.scene.y + ' pivot: ' + this.scene.pivot.x + ',' + this.scene.pivot.y;
		this.renderer.render(this.cameraContainer);
	}

	tick()
	{
		if (this.following !== null) {
			this.scene.pivot.x = this.following.shape.x;
			this.scene.pivot.y = this.following.shape.y;
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

	prepareWorldContainerWithLayers()
	{
		// Create world container
		this.worldLayers      = {
			chunks: this.elementFactory.createEmptyContainer(),
			trees: this.elementFactory.createEmptyContainer(),
			thugPlayers: this.elementFactory.createEmptyContainer()
		};
		this.debugWorldLayers = {
			tile: this.elementFactory.createEmptyContainer(),
			chunk: this.elementFactory.createEmptyContainer()
		};

		// To world container
		_.map(this.worldLayers, (layer, key) =>
		{
			this.scene.addChild(layer);
		});
		_.map(this.debugWorldLayers, (layer) =>
		{
			this.scene.addChildAt(layer, 2);
		});
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
		this.debugWorldLayers[key].visible = visibility;
	}

}