import { Euler, Geometry, Material, Matrix4, Mesh, MeshLambertMaterial, PerspectiveCamera, Quaternion, Scene, SphereGeometry, SpotLight, SpotLightHelper, Texture, TextureLoader, Vector3, WebGLRenderer } from 'three';

import jupiterJpg from 'url:./jupiter2_1k.jpg'

// Earth with clouds:
// https://github.com/enesser/earth-webgl

// Stripe globe
// https://stripe.com/blog/globe

// UC Davis: Quaternions
// https://www.youtube.com/watch?v=mHVwd8gYLnI

const scene = new Scene();

class JupiterModel {

  animationFunction_: any;
  planet_: Mesh;
  renderer_: WebGLRenderer;
  scene_: Scene;
  camera_: PerspectiveCamera;
  // Tilt vector (radians)
  tilt_: Vector3 = new Vector3(-0.3, 0.9, 0.3);
  // Angular velocity of rotation
  omega_: number = 0.002;
  // Initial angular offset
  // Just before the great red spot enters the picture
  omega0_: number = 9 * Math.PI / 8;
  q_: Quaternion = new Quaternion();

  constructor(canvas, scene: Scene) {
    this.scene_ = scene;
    console.log("Constructing JupiterModel");
    // No antialiasing for performance
    this.renderer_ = new WebGLRenderer({canvas, antialias: false});
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    this.renderer_.setSize(w, h);
    this.camera_ = this.createCamera(parseInt(w / h));
    this.planet_ = this.createPlanet();
    for (var i = 0; i <= 2; i++) {
      const q = new Quaternion();
      const phi = this.tilt_.getComponent(i);
      q.setFromAxisAngle(new Vector3(i==0?1:0, i==1?1:0, i==2?1:0), phi);
      this.q_.multiply(q);
    }
    this.planet_.applyQuaternion(this.q_);
    this.scene_.add(this.planet_);
    this.scene_.add(this.createSolarLight());
    this.animationFunction_ = (t) => this.render(t);
  }

  rotatePlanet(radians: number) {
    // Rotate about Y axis of planet
    const v = new Vector3(0, 1, 0);
    v.applyQuaternion(this.q_);
    const q = new Quaternion();
    q.setFromAxisAngle(v, radians);
    this.planet_.applyQuaternion(q);
  }

  render(time: number): void {
    this.rotatePlanet(this.omega_);
    this.renderer_.render(this.scene_, this.camera_);
    requestAnimationFrame(this.animationFunction_);
  }

  initialize(): void {
    console.log("Initializing JupiterModel");
    this.rotatePlanet(this.omega0_);
    requestAnimationFrame(this.animationFunction_);
  }

  createPlanet(): Mesh {
    const mesh = new Mesh(this.createPlanetGeometry(), this.createPlanetMaterial());
    return mesh;
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

  createCamera(aspect: number): PerspectiveCamera {
    const fov = 75;
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
