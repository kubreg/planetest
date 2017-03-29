var Colors = {
    red:0xf25346,
    white:0xd8d0d1,
    brown:0x59332e,
    pink:0xF5986E,
    brownDark:0x23190f,
    blue:0x68c3c0,
};

window.addEventListener('load', init, false);
 
function init() {
    // set up the scene, the camera and the renderer
    createScene();
 
    // add the lights
    createLights();
 
    // add the objects
    createPlane();
    createSea();
    createSky();
 
    // start a loop that will update the objects' positions 
    // and render the scene on each frame
    loop();
}

var scene,
    camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
    renderer, container;
 
function createScene() {
    // Get the width and the height of the screen,
    // use them to set up the aspect ratio of the camera 
    // and the size of the renderer.
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
 
    // Create the scene
    scene = new THREE.Scene();
 
    // Add a fog effect to the scene; same color as the
    // background color used in the style sheet
    scene.fog = new THREE.Fog(0xf7d9aa, 100, 950);
    
    // Create the camera
    aspectRatio = WIDTH / HEIGHT;
    fieldOfView = 60;
    nearPlane = 1;
    farPlane = 10000;
    camera = new THREE.PerspectiveCamera(
        fieldOfView,
        aspectRatio,
        nearPlane,
        farPlane
        );
    
    // Set the position of the camera
    camera.position.x = 0;
    camera.position.z = 200;
    camera.position.y = 100;
    
    // Create the renderer
    renderer = new THREE.WebGLRenderer({ 
        // Allow transparency to show the gradient background
        // we defined in the CSS
        alpha: true, 
 
        // Activate the anti-aliasing; this is less performant,
        // but, as our project is low-poly based, it should be fine :)
        antialias: true 
    });
 
    // Define the size of the renderer; in this case,
    // it will fill the entire screen
    renderer.setSize(WIDTH, HEIGHT);
    
    // Enable shadow rendering
    renderer.shadowMap.enabled = true;
    
    // Add the DOM element of the renderer to the 
    // container we created in the HTML
    container = document.getElementById('world');
    container.appendChild(renderer.domElement);
    
    // Listen to the screen: if the user resizes it
    // we have to update the camera and the renderer size
    window.addEventListener('resize', handleWindowResize, false);
}


function handleWindowResize() {
    // update height and width of the renderer and the camera
    HEIGHT = window.innerHeight;
    WIDTH = window.innerWidth;
    renderer.setSize(WIDTH, HEIGHT);
    camera.aspect = WIDTH / HEIGHT;
    camera.updateProjectionMatrix();
}

var hemisphereLight, shadowLight;
 
function createLights() {
    // A hemisphere light is a gradient colored light; 
    // the first parameter is the sky color, the second parameter is the ground color, 
    // the third parameter is the intensity of the light
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9)
    
    // A directional light shines from a specific direction. 
    // It acts like the sun, that means that all the rays produced are parallel. 
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);
 
    // Set the direction of the light  
    shadowLight.position.set(150, 350, 350);
    
    // Allow shadow casting 
    shadowLight.castShadow = true;
 
    // define the visible area of the projected shadow
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;
 
    // define the resolution of the shadow; the higher the better, 
    // but also the more expensive and less performant
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;
    
    // to activate the lights, just add them to the scene
    scene.add(hemisphereLight);  
    scene.add(shadowLight);
}

// First let's define a Sea object :
Sea = function(){
    
    // create the geometry (shape) of the cylinder;
    // the parameters are: 
    // radius top, radius bottom, height, number of segments on the radius, number of segments vertically
    var geom = new THREE.CylinderGeometry(600,600,800,40,10);
    
    // rotate the geometry on the x axis
    geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
    
    // create the material 
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.blue,
        transparent:true,
        opacity:.6,
        shading:THREE.FlatShading,
    });
 
    // To create an object in Three.js, we have to create a mesh 
    // which is a combination of a geometry and some material
    this.mesh = new THREE.Mesh(geom, mat);
 
    // Allow the sea to receive shadows
    this.mesh.receiveShadow = true; 
}
 
// Instantiate the sea and add it to the scene:
 
var sea;
 
function createSea(){
    sea = new Sea();
 
    // push it a little bit at the bottom of the scene
    sea.mesh.position.y = -600;
 
    // add the mesh of the sea to the scene
    scene.add(sea.mesh);
}
Cloud = function(){
    // Create an empty container that will hold the different parts of the cloud
    this.mesh = new THREE.Object3D();
    
    // create a cube geometry;
    // this shape will be duplicated to create the cloud
    var geom = new THREE.BoxGeometry(20,20,20);
    
    // create a material; a simple white material will do the trick
    var mat = new THREE.MeshPhongMaterial({
        color:Colors.white,  
    });
    
    // duplicate the geometry a random number of times
    var nBlocs = 3+Math.floor(Math.random()*3);
    for (var i=0; i<nBlocs; i++ ){
        
        // create the mesh by cloning the geometry
        var m = new THREE.Mesh(geom, mat); 
        
        // set the position and the rotation of each cube randomly
        m.position.x = i*15;
        m.position.y = Math.random()*10;
        m.position.z = Math.random()*10;
        m.rotation.z = Math.random()*Math.PI*2;
        m.rotation.y = Math.random()*Math.PI*2;
        
        // set the size of the cube randomly
        var s = .1 + Math.random()*.9;
        m.scale.set(s,s,s);
        
        // allow each cube to cast and to receive shadows
        m.castShadow = true;
        m.receiveShadow = true;
        
        // add the cube to the container we first created
        this.mesh.add(m);
    } 
}


renderer.render(scene, camera);