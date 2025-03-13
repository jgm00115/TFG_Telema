import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { setCameraRotation, setFovRotation } from '../../store/reducers/streamReducer';

const VideoSphereManual = ({ videoElement, onCameraRotate }) => {

  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const videoTextureRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);

  useEffect(() => {
    if (!videoElement || !containerRef.current) return;

    // Clean any existing canvas before adding a new one
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild);
    }

    // 1. Create Scene, Camera, and Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 0.1);  // Place camera slightly off center
    camera.lookAt(new THREE.Vector3(0,0,-1));  // Look at the center of the sphere
    camera.rotation.set(0, Math.PI, 0);  // Reset camera rotation 

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();  // Update the camera's projection matrix
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // 2. Create VideoTexture
    const videoTexture = new THREE.VideoTexture(videoElement.current);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBAFormat;
    videoTexture.flipY = true;

    // Store references for cleanup later
    videoTextureRef.current = videoTexture;
    sceneRef.current = scene;
    rendererRef.current = renderer;
    cameraRef.current = camera;

    // 3. Create the sphere geometry (inverted for inside view)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);  // Invert to render the inside of the sphere

    const material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      side: THREE.FrontSide,
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.rotation.y = Math.PI * 1.5;

    scene.add(sphere);

    // 4. Set up OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;  // Smooth orbiting
    controls.dampingFactor = 0.05;
    controls.minDistance = 0.1;  // Prevent zooming too close
    controls.maxDistance = 1000;  // Prevent zooming too far
    controlsRef.current = controls;

    // 5. Render Loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();  // Update controls every frame
      renderer.render(scene, camera);
    };

    const intervalId = setInterval(() => {
      if (cameraRef.current) {
        // x = pitch, y = roll, z = yaw
        const { x, y, z } = cameraRef.current.rotation;
        
        const direction = new THREE.Vector3();
        cameraRef.current.getWorldDirection(direction);
    
        const forwardX = direction.x;
        const forwardZ = direction.z;
    
        let rotationYaw = Math.atan2(forwardX, forwardZ);
  
        rotationYaw -= Math.PI * 1.5;
    
        // Keep yaw in range [-π, π] to prevent weird jumps
        if (rotationYaw < -Math.PI) rotationYaw += 2 * Math.PI;
        if (rotationYaw > Math.PI) rotationYaw -= 2 * Math.PI;
    
        dispatch(setCameraRotation([x, y, z]));
        dispatch(setFovRotation(rotationYaw));
      }
    }, 500); // Runs every 500ms
    
  

    animate();  // Start the animation loop

    return () => {
      clearInterval(intervalId);  // Clear the interval
      window.removeEventListener('resize', handleResize);  // Remove resize listener
      renderer.dispose();  // Free WebGL resources
      videoTexture.dispose();  // Free video texture resources
      geometry.dispose();  // Free geometry
      controls.dispose();  // Dispose of OrbitControls
    };
  }, [videoElement]);

  return (<div>
    <div ref={containerRef} style={{ width: '100%', position: "absolute", height: '100vh', zIndex: -1 }} />
    </div>)
};

export default VideoSphereManual;
