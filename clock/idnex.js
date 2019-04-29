/**
 * Created by Administrator on 2018/10/26.
 */

(function box() {
    var mesh;
    var texture;
    var camera;
    var scene;
    var renderer;
    var controller;

    function initThree() {
        renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        document.body.appendChild( renderer.domElement );

        camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
        camera.position.x = 0;
        camera.position.y = 300;
        camera.position.z = 300;
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.lookAt(0,0,0);

        controller = new THREE.OrbitControls(camera, renderer.domElement);
        controller.target = new THREE.Vector3(0,0,0);

        scene = new THREE.Scene();

        var geometry = new THREE.CubeGeometry(150, 150, 150);
        texture = new THREE.Texture( canvas );
        var material = new THREE.MeshBasicMaterial({map:texture});
        texture.needsUpdate = true;
        mesh = new THREE.Mesh( geometry,material );
        scene.add( mesh );

        window.addEventListener( 'resize', onWindowResize, false );
    }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }

    function animate() {
        texture.needsUpdate = true;
        mesh.rotation.y -= 0.01;
        //mesh.rotation.x -= 0.01;
        requestAnimationFrame( animate );
        renderer.render( scene, camera );
    }

    function start() {
        initThree();
        animate();
    }

    start();
})();