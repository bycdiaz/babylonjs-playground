const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    
    
    // *** CAMERA 1 ****
    // Creates and positions a free camera
    const camera = new BABYLON.FreeCamera("camera1", 
        new BABYLON.Vector3(0, 2, -10), scene);
        
    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);


    // *** CAMERA 2 ****
    // const camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), scene);

    // // This positions the camera
    // camera.setPosition(new BABYLON.Vector3(0, 2, -10));

    // // This attaches the camera to the canvas
    // camera.attachControl(canvas, true);

    const zDistanceBehindArcCamera = -15;
    const polyhedron = BABYLON.MeshBuilder.CreatePolyhedron("shape", { type: 13 }, scene);
    polyhedron.position.z = zDistanceBehindArcCamera;

    const polyhedron2 = BABYLON.MeshBuilder.CreatePolyhedron("shape", { type: 14 }, scene);
    polyhedron2.position.z = zDistanceBehindArcCamera;
    polyhedron2.position.x = 3;

    const polyhedron3 = BABYLON.MeshBuilder.CreatePolyhedron("shape", { type: 0, size: .5 }, scene);
    polyhedron3.position.z = zDistanceBehindArcCamera;
    polyhedron3.position.x = -3;


    // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), scene);
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7;

    const pointerDragBehavior = new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(1,0,0)});
    
    // Use drag plane in world space
    pointerDragBehavior.useObjectOrientationForDragging = false;

    // Listen to drag events
    pointerDragBehavior.onDragStartObservable.add((event)=>{
        console.log("dragStart");
        console.log(event);
    })
    pointerDragBehavior.onDragObservable.add((event)=>{
        console.log("drag");
        console.log(event);
    })
    pointerDragBehavior.onDragEndObservable.add((event)=>{
        console.log("dragEnd");
        console.log(event);
    })

    // Built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        { diameter: 1, segments: 16 }, scene);
    sphere.material = new BABYLON.StandardMaterial("", scene);
    sphere.addBehavior(pointerDragBehavior);

    // const snowPerson = BABYLON.SceneLoader.ImportMeshAsync("", "https://assets.babylonjs.com/meshes/Demos/Snow_Man_Scene/", "snowMan.glb", scene);


    const [box1, box2] = makeBoxes(scene);

    createButtons(sphere);

    text("Card Sort, But make it 3D. Wow.", 2, 0);

    scene.registerBeforeRender(function () {
      const sphereContactBox1 = !!sphere.intersectsMesh(box1, true);
      const sphereContactBox2 = !!sphere.intersectsMesh(box2, true);
      const sphereContactsBox = sphereContactBox1 || sphereContactBox2;

      if (sphereContactsBox) {
        console.log('contact!');
        sphere.material.emissiveColor = new BABYLON.Color3(150, 0, 0);
      } else {
        sphere.material.emissiveColor = new BABYLON.Color3(0, 0 , 0);
      }

      if (sphereContactBox1) {
        console.log('contact with box 1');
        box1.material.emissiveColor = new BABYLON.Color3(0, 60, 0);
      } else {
        box1.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
      }

      if (sphereContactBox2) {
        console.log('contact with box 2');
        box2.material.emissiveColor = new BABYLON.Color3(0, 90, 0);
      } else {
        box2.material.emissiveColor = new BABYLON.Color3(0, 0, 0);
      }
    });

    const environment = scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 2.8 });
    environment.setMainColor(BABYLON.Color3.FromHexString("#4781b9"));
    const vrHelper = scene.createDefaultVRExperience({createDeviceOrientationCamera:false, useXR: true});
    vrHelper.enableTeleportation({ floorMeshes: [environment.ground] });

    return scene;
};

//Call the createScene function
const scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
  scene.render();
});
// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
  engine.resize();
});

function createButtons(sphere) {
  button('up', sphere, { top: 50, right: 150 });
  button('down', sphere, { top: 150, right: 150 });
  button('left', sphere, { top: 100, right: 250 });
  button('right', sphere, { top: 100, right: 50 });
}

function button(direction, sphere, position) {
  const sphereStep = .5;
  const button = document.createElement('button');
  button.style.top = `${position.top}px`;
  button.style.right = `${position.right}px`;
  button.className = 'button';
  button.textContent = direction;

  document.body.appendChild(button);

  button.addEventListener('click', () => {
    if (sphere) {
      switch (direction) {
        case 'up':
          sphere.position.y += sphereStep;
          break;
        case 'down':
          sphere.position.y -= sphereStep;
          break;
        case 'left':
          sphere.position.x -= sphereStep;
          break;
          case 'right':
            sphere.position.x += sphereStep;
            break;
        default:
          console.log(`Unknown direction: ${direction}.`);
      }
    }
    console.log(sphere.position);
  })

  button.addEventListener('keydown', event => {
    if (sphere) {
      if (event.key === 'ArrowUp' || event.key === 'w') {
        sphere.position.y += sphereStep;
      } else if (event.key === 'ArrowDown' || event.key === 's') {
        sphere.position.y -= sphereStep;
      } else if (event.key === 'ArrowLeft' || event.key === 'a') {
        sphere.position.x -= sphereStep;
      } else if (event.key === 'ArrowRight' || event.key === 'd') {
        sphere.position.x += sphereStep;
      }
    }
    console.log(sphere.position);
  })
}

function makeBoxes(scene) {
  const box1 = BABYLON.MeshBuilder.CreateBox('box', {
    size: 1.5
  }, scene);
  box1.position.x = -4;
  box1.material = new BABYLON.StandardMaterial("", scene);

  const box2 = BABYLON.MeshBuilder.CreateBox('box', {
    size: 1.5
  }, scene);
  box2.position.x = 4;
  box2.material = new BABYLON.StandardMaterial("", scene);


  return [box1, box2];
}

function text(text, horizontalAlignment = 0, verticalAlignment = 0) {
  const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  const title = new BABYLON.GUI.TextBlock();
  title.text = text;
  title.color = 'white';
  title.textHorizontalAlignment = horizontalAlignment;
  title.textVerticalAlignment = verticalAlignment;
  title.fontSize = 40;
  advancedTexture.addControl(title);
}