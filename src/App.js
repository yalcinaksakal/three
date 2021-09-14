import "./App.css";

import { useEffect, useRef } from "react";
import {
  AmbientLight,
  DirectionalLight,
  PCFShadowMap,
  PerspectiveCamera,
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
    renderer.setSize(window.innerWidth, window.innerHeight);

    //camera
    const fov = 60;
    const aspect = 1920 / 1000;
    const near = 1.0;
    const far = 1000.0;
    const camera = new PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(75, 20, 0);

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

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    let frameId;
    const RAF = () => {
      frameId = requestAnimationFrame(() => {
        renderer.render(scene, camera);
        RAF();
      });
    };

    //resize
    window.addEventListener("resize", onResize);

    //add renderer to DOM
    const { domElement } = renderer;
    rendererRef.current.appendChild(domElement);

    //animate
    RAF();

    //cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", onResize);
      domElement.remove();
    };
  }, []);

  return <div ref={rendererRef}></div>;
}

export default App;
