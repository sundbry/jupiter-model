import { Geometry, Material, Mesh, MeshLambertMaterial, PerspectiveCamera, Scene, SphereGeometry, SpotLight, SpotLightHelper, Texture, TextureLoader, Vector3, WebGLRenderer } from 'three';

import jupiterJpg from 'url:./jupiter2_1k.jpg'

const scene = new Scene();

class JupiterModel {

  animationFunction_: any;
  planet_: Mesh;
  renderer_: WebGLRenderer;
  scene_: Scene;
  camera_: PerspectiveCamera;

  constructor(canvas, scene: Scene) {
    this.scene_ = scene;
    console.log("Constructing JupiterModel");
    this.renderer_ = new WebGLRenderer({canvas});
    this.camera_ = this.createCamera();
    this.planet_ = this.createPlanet();
    this.scene_.add(this.planet_);
    this.scene_.add(this.createSolarLight());
    this.animationFunction_ = (t) => this.render(t);
  }

  render(time: number): void {
    time *= 0.001;  // convert 1time to seconds
    this.planet_.rotation.x = 0.4;
    this.planet_.rotation.y = time / 4;
    this.renderer_.render(this.scene_, this.camera_);
    requestAnimationFrame(this.animationFunction_);
  }

  initialize(): void {
    console.log("Initializing JupiterModel");
    requestAnimationFrame(this.animationFunction_);
  }

  createPlanet(): Mesh {
    return new Mesh(this.createPlanetGeometry(), this.createPlanetMaterial());
  }

  createPlanetGeometry(): Geometry {
    return new SphereGeometry(/*radius=*/1, /*widthSegments=*/32, /*heightSegments=*/32);
  }

  createPlanetMaterial(): Material {
    return new MeshLambertMaterial({
      // color: 0xd4ca48,
      emissive: 0xa010bf,
      emissiveIntensity: 0.05,
      map: this.createPlanetTexture(),
    });
  }

  createPlanetTexture(): Texture {
    // Textures from http://planetpixelemporium.com/jupiter.html
    const loader = new TextureLoader();
    return loader.load(jupiterJpg);
  }

  createCamera(): PerspectiveCamera {
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 5;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 2;
    return camera;
  }

  createSolarLight(): SpotLight {
    var spotlight = new SpotLight(0xffffff);
    spotlight.position.set(-2, 3, 5);
    var spotLightHelper = new SpotLightHelper(spotlight);
    spotlight.add(spotLightHelper);
    return spotlight;
  }

}

export function main(): void {
  const canvas = document.querySelector('#planet');
  const scene = new Scene();
  const model = new JupiterModel(canvas, scene);
  model.initialize();
}
