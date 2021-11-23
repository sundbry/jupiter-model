import { Geometry, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, SphereGeometry, WebGLRenderer } from 'three';

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
    this.animationFunction_ = (t) => this.render(t);
  }

  render(time: number): void {
    time *= 0.001;  // convert time to seconds
    this.planet_.rotation.x = time;
    this.planet_.rotation.y = time;
    this.renderer_.render(this.scene_, this.camera_);
    requestAnimationFrame(this.animationFunction_);
  }

  initialize(): void {
    console.log("Initializing JupiterModel");
    this.scene_.add(this.planet_);
    requestAnimationFrame(this.animationFunction_);
  }

  createPlanet(): Mesh {
    return new Mesh(this.createPlanetGeometry(), this.createPlanetMaterial());
  }

  createPlanetGeometry(): Geometry {
    return new SphereGeometry(/*radius=*/1, /*widthSegments=*/16, /*heightSegments=*/16);
  }

  createPlanetMaterial(): MeshBasicMaterial {
    return new MeshBasicMaterial({color: 0xd4ca48});
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

}

export function main(): void {
  const canvas = document.querySelector('#planet');
  const scene = new Scene();
  const model = new JupiterModel(canvas, scene);
  model.initialize();
}
