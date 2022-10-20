const canvas = document.getElementById("renderCanvas"); // Get the canvas element
const engine = new BABYLON.Engine(canvas, true); // Generate the BABYLON 3D engine
const createScene = function () {
    // Creates a basic Babylon Scene object
    const scene = new BABYLON.Scene(engine);
    // Creates and positions a free camera
    const camera = new BABYLON.FreeCamera("camera1", 
        new BABYLON.Vector3(0, 5, -10), scene);
        
    // Targets the camera to scene origin
    camera.setTarget(BABYLON.Vector3.Zero());
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    // Creates a light, aiming 0,1,0 - to the sky
    const light = new BABYLON.HemisphericLight("light", 
        new BABYLON.Vector3(0, 1, 0), scene);
    // Dim the light a small amount - 0 to 1
    light.intensity = 0.7;

    const pointerDragBehavior = new BABYLON.PointerDragBehavior({dragAxis: new BABYLON.Vector3(1,0,0)});
    
    // Use drag plane in world space
    pointerDragBehavior.useObjectOrientationForDragging = false;

    // Listen to drag events
    // pointerDragBehavior.onDragStartObservable.add((event)=>{
    //     console.log("dragStart");
    //     console.log(event);
    // })
    // pointerDragBehavior.onDragObservable.add((event)=>{
    //     console.log("drag");
    //     console.log(event);
    // })
    // pointerDragBehavior.onDragEndObservable.add((event)=>{
    //     console.log("dragEnd");
    //     console.log(event);
    // })

    // Built-in 'sphere' shape.
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", 
        { diameter: 1, segments: 16 }, scene);

    sphere.addBehavior(pointerDragBehavior);

    makeBoxes(scene);
    createButtons(sphere);

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const title = new BABYLON.GUI.TextBlock();
    title.text = "Card Sort, But make it 3D";
    title.color = 'white';
    title.textHorizontalAlignment = 2;
    title.textVerticalAlignment = 0;
    title.fontSize = 24;
    advancedTexture.addControl(title);   

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
  })
}

function makeBoxes(scene) {
  const box1 = BABYLON.MeshBuilder.CreateBox('box', scene);
  box1.position.x = -2;

  const box2 = BABYLON.MeshBuilder.CreateBox('box', scene);
  box2.position.x = 2;
}
