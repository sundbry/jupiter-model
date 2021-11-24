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
  // Z-Tilt (radians)
  phi_: number = 0.3;
  // Angular velocity of rotation
  omega_: number = 0.001;

  constructor(canvas, scene: Scene) {
    this.scene_ = scene;
    console.log("Constructing JupiterModel");
    this.renderer_ = new WebGLRenderer({canvas, antialias: true});
    this.camera_ = this.createCamera();
    this.planet_ = this.createPlanet();
    // this.rotatePlanet(new Vector3(0, 0, 1).normalize(), 0.5);
    // this.planet_.rotateZ(this.phi_);
    const qz = new Quaternion();
    qz.setFromAxisAngle(new Vector3(0, 0, 1).normalize(), this.phi_);
    this.planet_.applyQuaternion(qz);
    this.scene_.add(this.planet_);
    this.scene_.add(this.createSolarLight());
    this.animationFunction_ = (t) => this.render(t);
  }

  rotatePlanet(axis, radians): void {
    const rotWorldMatrix = new Matrix4();
    rotWorldMatrix.makeRotationAxis(axis, radians);
    rotWorldMatrix.multiply(this.planet_.matrix);
    this.planet_.matrix = rotWorldMatrix;
    //this.planet_.rotation.setEulerFromRotationMatrix(this.planet_.matrix);
    this.planet_.rotation.setFromRotationMatrix(this.planet_.matrix);
  }

  render(time: number): void {
    const x = Math.cos(this.phi_);
    const y = Math.sin(this.phi_);
    const q = new Quaternion();
    const v = new Vector3(x, y, 0);
    v.cross(new Vector3(0, 0, -1));
    q.setFromAxisAngle(v, this.omega_);
    this.planet_.applyQuaternion(q);
    this.renderer_.render(this.scene_, this.camera_);
    requestAnimationFrame(this.animationFunction_);
  }

  initialize(): void {
    console.log("Initializing JupiterModel");
    requestAnimationFrame(this.animationFunction_);
  }

  createPlanet(): Mesh {
    const mesh = new Mesh(this.createPlanetGeometry(), this.createPlanetMaterial());
    // mesh.setRotationFromAxisAngle(new Vector3(0, 0, 1), 0.5);
    //mesh.setRotationFromEuler(new Euler(0, 0, 0.5));
    /*
    const q = new Quaternion();
    q.setFromAxisAngle( new Vector3( 0, 0, 1 ), 0);
    mesh.applyQuaternion(q);
    */

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
