window.onload = () =>{
    init();
}
var pointer;
var raycaster;
let INTERSECTED;
var agent;
var scene;
var head;
var leftArm;
var rightArm;
var leftLeg;
var rightLeg;
var mtarget= new THREE.Vector3()
function vec3(x,y,z){
  this.x = x;
  this.y = y;
  this.z = z;
  return this;
}
class cube{
  constructor(name,size,pos,parent,uv,textureSize){
    this.name = name;
    this.size = size;
    this.pos = pos;
    //this.material = material;
    //this.geometry = new THREE.BoxGeometry(size.x, size.y, size.z);


    this.cube = box(pos,size,uv,textureSize);


    this.cube.position.x = pos.x + size.x / 2;
    this.cube.position.y = pos.y + size.y / 2;
    this.cube.position.z = pos.z + size.z / 2;


    this.velocity = vec3(0,0,0);
    this.lerping = false;
    this.target = pos;
    this.parent = parent;
    parent.add(this.cube);
  }
  lerp(target,speed){
    this.target = target;
    this.lerping = true;
    this.velocity.x = (target.x - this.pos.x) * speed;
    this.velocity.y = (target.y - this.pos.y) * speed;
    this.velocity.z = (target.z - this.pos.z) * speed;
  }
  asyncLerp(target,speed){
    if(!this.lerping){
      this.lerp(target,speed);
    }
  }
  onTick(){
    this.pos.x += this.velocity.x;
    this.pos.y += this.velocity.y;
    this.pos.z += this.velocity.z;
    if(this.pos.x == this.target.x && this.pos.y == this.target.y && this.pos.z == this.target.z){
      this.lerping = false;
    }
  }
}
function loop(){

}
var py = 5;
var pi = 0;
var ang = 30;


function init() {
    var base = document.getElementById("viewport");


    var width = base.clientWidth;
    var height = base.clientHeight;
    pointer = new THREE.Vector2();
    // レンダラーを作成
    const renderer = new THREE.WebGLRenderer({
      canvas: base,
      alpha:true
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    // シーンを作成
    scene = new THREE.Scene();
    // カメラを作成
    const camera = new THREE.PerspectiveCamera(40, width / height);
    camera.position.set(100, 60, -100);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //const controls = new THREE.OrbitControls(camera, base);

    base.addEventListener( 'resize',()=>{
      base = document.getElementById("viewport");
      width = base.clientWidth;
      height = base.clientHeight;
    
      // レンダラーのサイズを調整する
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(width, height);
    
      // カメラのアスペクト比を正す
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }, true);

    const light = new THREE.HemisphereLight(0xFFFFFF, 0x888888, 1.0);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xFFFFFF);
    directionalLight.position.set(-100, 60, -100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);


    const size = 1;

    const material = new THREE.MeshLambertMaterial({color: 0xAAAAAA});
    // 箱を作成
    agent = new THREE.Group(); 
    scene.add(agent); 
    var texturesize = {x:32,y:32};
    const body1 = new cube("body1",new vec3(8,4,4),new vec3(-4,5,-2),agent,[ 0.0, 12.0 ],texturesize);
    const body2 = new cube("body2",new vec3(6,2,4),new vec3(-3,3,-2),agent,[ 0.0, 20.0 ],texturesize);

    head = new THREE.Group();
    agent.add(head); 
    head.position.set(0,9,0);
    head.rotation.x = head.rotation.y = head.rotation.z = 0;

    const head1 = new cube("head1",new vec3(6,7,5),new vec3(-3,0,-3),head,[ 0.0, 0.0 ],texturesize);
    const head2 = new cube("head2",new vec3(2,3,1),new vec3(-1,0,-4),head,[ 17.0, 1.0 ],texturesize);

    var hidden = new THREE.Object3D();
    hidden.position.set(0,9,0);
    hidden.rotation.x = hidden.rotation.y = hidden.rotation.z = 0;

    leftArm = new THREE.Group();
    agent.add(leftArm);
    leftArm.position.y = 9;

    const leftArm1 = new cube("leftArm1",new vec3(2,9,2),new vec3(-6,-9,-1),leftArm,[ 24.0, 11.0 ],texturesize);

    rightArm = new THREE.Group();
    agent.add(rightArm);
    rightArm.position.y = 9;

    const rightArm1 = new cube("rightArm1",new vec3(2,9,2),new vec3(4,-9,-1),rightArm,[ 24.0, 0.0 ],texturesize);

    leftLeg = new THREE.Group();
    agent.add(leftLeg);

    const leftLeg1 = new cube("leftLeg1",new vec3(2,3,2),new vec3(-3,0,-1),leftLeg,[ 8.0, 26.0 ],texturesize);

    rightLeg = new THREE.Group();
    agent.add(rightLeg);

    const rightLeg1 = new cube("rightLeg1",new vec3(2,3,2),new vec3(1,0,-1),rightLeg,[ 0.0, 26.0 ],texturesize);

    //const baseblock = new cube("base",new vec3(30,5,30),new vec3(-15,-15,-15),scene);
    const geometry1 = new THREE.BoxGeometry(30, 5, 30);
    const baseblock = new THREE.Mesh(geometry1, material);
    baseblock.position.set(0,-10,0);
    baseblock.receiveShadow = true;
    scene.add(baseblock);
    const geometry2 = new THREE.BoxGeometry(20, 20, 20);
    const baseblock2 = new THREE.Mesh(geometry2, material);
    baseblock2.position.set(-10 + 10,-30 + 10,-10 + 10);
    scene.add(baseblock2);
    //const baseblock2 = new cube("base",new vec3(20,20,20),new vec3(-10,-30,-10),scene);
    var target = new THREE.Vector3();


    raycaster = new THREE.Raycaster();
    base.addEventListener( 'mousemove', onPointerMove );
    tick();
    setTimeout(loop, 10);
    // 毎フレーム時に実行されるループイベントです
    function tick() {
      raycaster.setFromCamera(pointer, camera);
      renderer.render(scene, camera); // レンダリング

      agent.position.y += (py - agent.position.y) * 0.01;
      if(agent.position.y >= 2.0) py = -7;
      else if(agent.position.y <= -6) py = 3;

      if(pi >= 20) ang = -30;
      else if(pi <= -20) ang = 30;
      pi += (ang - pi) * 0.01;

      var radian = pi * ( Math.PI / 180 ) ;
      leftArm.rotation.x = -radian;
      rightArm.rotation.x = radian;
      
      head.rotation.x += (hidden.rotation.x - head.rotation.x) * 0.1;
      head.rotation.y += (hidden.rotation.y - head.rotation.y) * 0.1;
      head.rotation.z += (hidden.rotation.z - head.rotation.z) * 0.1;

      const intersects = raycaster.intersectObjects( agent.children );
      if ( intersects.length > 0 ) {
        hidden.lookAt(new THREE.Vector3(-camera.position.x,-camera.position.y,-camera.position.z))
      } else {
        hidden.rotation.x = hidden.rotation.y = hidden.rotation.z = 0;
      }

  
      requestAnimationFrame(tick);
    }
  }


  function onPointerMove( event ) {
    var rect = event.target.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;
    pointer.x = ( mouseX / rect.width) * 2 - 1;
    pointer.y = - ( mouseY / rect.height) * 2 + 1;
  
  }

  function box(origin,offset,uv,textureSize){
    /*var color = Math.round(Math.random() * 101 + 155) * 0x10000 + Math.round(Math.random() * 101 + 155) * 0x100 + Math.round(Math.random() * 101 + 155) * 0x1
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(
        offset.x,offset.y,offset.z), new THREE.MeshLambertMaterial({color: color}));
    mesh.position.x = origin.x + offset.x / 2;
    mesh.position.y = origin.y + offset.y / 2,
    mesh.position.z = origin.z + offset.z / 2
    group.add(mesh);*/
    //console.log("a");




    let geom = new THREE.BoxGeometry(offset.x, offset.y, offset.z);

    geom.faces.forEach( face => { face.materialIndex = 0 });

    let tex = {
      resolution: { width: textureSize.x, height: textureSize.y },
      uv: [
        { tag: "left", x: uv[0] + 0, y:uv[1] +  offset.z, w: offset.z, h: offset.y, topleft: 2 },
        { tag: "right", x:uv[0] +  offset.x + offset.z, y:uv[1] + offset.z, w: offset.z, h: offset.y, topleft: 2 },
        { tag: "top", x:uv[0] +  offset.z, y:uv[1] + 0, w: offset.x, h: offset.z, topleft: 0 },
        { tag: "bottom", x:uv[0] +  offset.z + offset.x, y:uv[1] + 0, w: offset.x, h: offset.z, topleft: 2 },
        { tag: "front", x:uv[0] +  offset.z * 2 + offset.x, y:uv[1] + offset.z, w: offset.x, h: offset.y, topleft: 0 },
        { tag: "back", x:uv[0] +  offset.z, y:uv[1] + offset.z, w: offset.x, h: offset.y, topleft: 0 },
      ]
    }
  
    let points = [];
    for(let i=0; i<6; i++)
    {
      let rect = {
        left:   tex.uv[i].x / tex.resolution.width,
        top:    1 - tex.uv[i].y / tex.resolution.height,
        right:  (tex.uv[i].x + tex.uv[i].w) / tex.resolution.width,
        bottom: 1 - (tex.uv[i].y + tex.uv[i].h) / tex.resolution.height
      }
  
      points[i] = [
        { x: rect.left,  y: rect.top,    order: (tex.uv[i].topleft + 0) % 4 },
        { x: rect.right, y: rect.top,    order: (tex.uv[i].topleft + 1) % 4 },
        { x: rect.right, y: rect.bottom, order: (tex.uv[i].topleft + 2) % 4 },
        { x: rect.left,  y: rect.bottom, order: (tex.uv[i].topleft + 3) % 4 },
      ]

      points[i] = points[i].sort( (a,b)=>{ return b.order - a.order } );
    }

    let triangle = (point, indices, shift) => {
      shift = shift ? shift: 0
      indices = indices.map( v => (v + shift) % 4 );
      return [
        new THREE.Vector2( point[ indices[0] ].x, point[ indices[0] ].y ),
        new THREE.Vector2( point[ indices[1] ].x, point[ indices[1] ].y ),
        new THREE.Vector2( point[ indices[2] ].x, point[ indices[2] ].y )
      ]
    }

    geom.faceVertexUvs[0] = [
      // right
      triangle( points[0], [ 1, 2, 0 ] ),
      triangle( points[0], [ 2, 3, 0 ] ),
      // left
      triangle( points[1], [ 1, 2, 0 ] ),
      triangle( points[1], [ 2, 3, 0 ] ),
      // top
      triangle( points[2], [ 1, 2, 0 ], 2 ),
      triangle( points[2], [ 2, 3, 0 ], 2 ),
      // bottom
      triangle( points[3], [ 1, 2, 0 ] ),
      triangle( points[3], [ 2, 3, 0 ] ),
      // front
      triangle( points[4], [ 1, 2, 0 ], 2 ),
      triangle( points[4], [ 2, 3, 0 ], 2 ),
      // back
      triangle( points[5], [ 1, 2, 0 ], 2 ),
      triangle( points[5], [ 2, 3, 0 ], 2 ),
    ];
  
    // ジオメトリの更新フラグを立てる
    geom.uvsNeedUpdate = true;
  
    // IMGタグからテクスチャオブジェクトを作成
    let texture = new THREE.CanvasTexture( document.getElementById("texture") );
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.type = THREE.FloatType;
  
    // Meshオブジェクトの作成
    let box = new THREE.Mesh(
      geom,
      [ new THREE.MeshLambertMaterial({ map: texture ,transparent:true}) ]
    );

    box.position.x = origin.x + offset.x / 2;
    box.position.y = origin.y + offset.y / 2;
    box.position.z = origin.z + offset.z / 2;
    box.castShadow = true;
    return box;
}