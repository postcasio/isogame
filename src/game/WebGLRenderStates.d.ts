import { Camera, Light, Scene } from 'three';
import { WebGLLights } from './WebGLLights';

interface WebGLRenderState {

	init(): void;
	state: {
		lightsArray: Light[];
		shadowsArray: Light[];
		lights: WebGLLights;
	};
	setupLights( camera: Camera ): void;
	pushLight( light: Light ): void;
	pushShadow( shadowLight: Light ): void;

}

export class WebGLRenderStates {

	get( scene: Scene, camera: Camera ): WebGLRenderState;
	dispose(): void;

}
