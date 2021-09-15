import "./App.css";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { useEffect, useRef } from "react";
import {
  AmbientLight,
  BoxGeometry,
  CubeTextureLoader,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshStandardMaterial,
  PCFShadowMap,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from "three";

function App() {
  const rendererRef = useRef();
  useEffect(() => {
    //set up renderer
    const renderer = new WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;
    renderer.setPixelRatio(window.devicePixelRatio);

    const aspect = window.innerWidth / window.innerHeight;
    renderer.setSize(window.innerWidth, window.innerHeight);

    //camera
    const fov = 60;
    const near = 1.0;
    const far = 1000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(100, 150, 200);

    //scene
    const scene = new Scene();

    //lights
    let light = new DirectionalLight(0xffffff);
    light.position.set(100, 100, 100);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.01;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.near = 1.0;
    light.shadow.camera.far = 500;
    light.shadow.camera.left = 200;
    light.shadow.camera.right = -200;
    light.shadow.camera.top = 200;
    light.shadow.camera.bottom = -200;

    scene.add(light);

    light = new AmbientLight(0x404040);

    scene.add(light);

    //skybox
    // 'px.png'
    // 'nx.png'
    // 'py.png'
    // 'ny.png'
    // 'pz.png'
    // 'nz.png'
    const loader = new CubeTextureLoader();
    const texture = loader.load([
      "SpaceboxCollection/Spacebox1/_left.png",
      "SpaceboxCollection/Spacebox1/_right.png",

      "SpaceboxCollection/Spacebox1/_top.png",
      "SpaceboxCollection/Spacebox1/_bottom.png",

      "SpaceboxCollection/Spacebox1/_front.png",
      "SpaceboxCollection/Spacebox1/_back.png",
    ]);
    scene.background = texture;

    //add a plane
    const plane = new Mesh(
      new PlaneGeometry(200, 100, 2, 2),
      new MeshStandardMaterial({
        color: "rgb(206, 194, 123)",
        transparent: false,
      })
    );

    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    plane.material.side = DoubleSide;
    plane.position.set(-100, 0, 0);
    scene.add(plane);

    //add  a box
    const box = new Mesh(
      new BoxGeometry(2, 3, 2),
      new MeshStandardMaterial({
        color: "red",
      })
    );
    box.position.set(-100, 2, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    scene.add(box);

    ////////

    //add boxes
    for (let x = -8; x < 8; x++) {
      for (let y = -8; y < 8; y++) {
        const box = new Mesh(
          new BoxGeometry(2, 2, 2),
          new MeshStandardMaterial({
            color: `rgb(${Math.floor(Math.random() * 255)},${Math.floor(
              Math.random() * 255
            )},${Math.floor(Math.random() * 255)})`,
          })
        );
        box.position.set(
          Math.random() + x * 5,
          Math.random() * 14.0 + 2.0,
          Math.random() + y * 5
        );
        box.castShadow = true;
        box.receiveShadow = true;
        scene.add(box);
      }
    }

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    //animate
    let frameId;
    const RAF = () => {
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(RAF);
    };

    //resize
    window.addEventListener("resize", onResize);

    const { domElement } = renderer;

    //add controls

    const controls = new OrbitControls(camera, domElement);
    controls.target.set(0, 20, 0);
    controls.update();

    //add renderer to DOM
    rendererRef.current.appendChild(domElement);
    //animate
    RAF();

    //cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      // domElement.removeEventListener("DOMContentLoaded", start);
      domElement.remove();
    };
  }, []);

  return (
    <div
      ref={rendererRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    ></div>
  );
}

export default App;
