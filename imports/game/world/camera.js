import {ElementFactory} from "./elementFactory";
import PIXI from "../../../node_modules/pixi.js";

export class Camera {
	constructor(settings, ticker)
	{
		this.elementFactory = new ElementFactory(this.settings);
		this.settings       = settings;
		this.renderer       = PIXI.autoDetectRenderer(settings.canvasW, settings.canvasH, {backgroundColor: 0x34495e});

		// Containers
		this.gui   = this.elementFactory.createEmptyContainer();
		this.scene = this.elementFactory.createEmptyContainer();
		this.prepareWorldContainerWithLayers();

		// Main view
		this.cameraContainer             = new PIXI.Container();
		this.cameraContainer.interactive = true;

		// Add world and gui to camera
		this.cameraContainer.addChild(this.scene);
		this.cameraContainer.addChild(this.gui);

		
		
		this.cameraContainer.x = 512;
		this.cameraContainer.y = 512;
		this.follower          = null;

		this.fps    = 0;
		this.ticker = ticker;

	}

	addPlayerAndFollow(shape)
	{
		this.scene.addChild(shape);
		this.follower = shape;
		this.update();
	}

	addToLayer(container, layer)
	{
		this.worldLayers[layer].addChild(container);
	}

	update()
	{
		this.tick();
		this.fps.text = this.ticker.FPS;
		this.renderer.render(this.cameraContainer);
	}

	tick()
	{
		if (this.follower !== null) {
			this.scene.pivot.x = this.follower.position.x;
			this.scene.pivot.y = this.follower.position.y;
		}
	}

	addFpsTicker()
	{
		let textOptions = {
			font: '16px Arial', fill: 0xffffff, stroke: 0x000000, strokeThickness: 2
		};
		this.fps        = new PIXI.Text('Loading', textOptions);
		this.fps.x      = 10 - 512;
		this.fps.y      = 10 - 512;
		this.gui.addChild(this.fps);

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