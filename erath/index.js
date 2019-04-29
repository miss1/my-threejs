var log = console.log.bind(console);

var globeObj = (function() {
    'use strict';

    // 判断浏览器是否支持webgl
    if(!Detector.webgl) Detector.addGetWebGLMessage();

    var container, stats;
    var camera, scene, renderer;
    var group;
    var mouseX = 0, mouseY = 0;
    var winWth = window.innerWidth, winHgt = window.innerHeight;

    var clickObjects=[];   //需要监听点击事件的模型

    // 根据经纬度获取position
    function getPosition(lng, lat, alt) {
        var phi = (90-lat)*(Math.PI/180),
            theta = (lng+180)*(Math.PI/180),
            radius = alt+200,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return {x: x, y: y, z: z};
    }

    // 地球
    function globe() {
        var globeTextureLoader = new THREE.TextureLoader();
        globeTextureLoader.load('img/earth.jpg', function (texture) {
            var globeGgeometry = new THREE.SphereGeometry(100, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture});
            var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            group.add(globeMesh);
            group.rotation.x = THREE.Math.degToRad(35);
            group.rotation.y = THREE.Math.degToRad(170);
        });
    }
    
    //地球上的云层
    function clouds() {
        var globeTextureClodsLoader = new THREE.TextureLoader();
        globeTextureClodsLoader.load('img/clouds.png', function (texture) {
            var globeGgeometry = new THREE.SphereGeometry(100, 100, 100);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture, transparent: true});
            var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);
            group.add(globeMesh);
        });
    }

    // 星点
    function stars() {
        var starsGeometry = new THREE.Geometry();
        for (var i = 0; i < 2000; i ++) {
            var starVector = new THREE.Vector3(
                THREE.Math.randFloatSpread(2000),
                THREE.Math.randFloatSpread(2000),
                THREE.Math.randFloatSpread(2000)
            );
            starsGeometry.vertices.push(starVector);
        }
        var starsMaterial = new THREE.PointsMaterial({color: 0x888888});
        var starsPoint = new THREE.Points(starsGeometry, starsMaterial);
        group.add(starsPoint);
    }

    // 光
    function lights() {
        var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x333333, 2);
        hemisphereLight.position.x = 0;
        hemisphereLight.position.y = 0;
        hemisphereLight.position.z = -200;
        group.add(hemisphereLight);
    }

    //标记点
    function takatag(item) {
        var globeTakaLoader = new THREE.TextureLoader();
        globeTakaLoader.load('img/avter.jpg', function (texture) {
            var globeGgeometry = new THREE.CubeGeometry(5, 5, 5);
            var globeMaterial = new THREE.MeshStandardMaterial({map: texture});
            var globeMesh = new THREE.Mesh(globeGgeometry, globeMaterial);

            // 定位
            var position = getPosition(item.lng, item.lat, -90);
            globeMesh.position.set(position.x, position.y, position.z);

            group.add(globeMesh);
            clickObjects.push(globeMesh);
        });
    }

    // 初始化
    function init() {
        container = document.getElementById('zh_globe_container');

        scene = new THREE.Scene();
        var bgTexture = new THREE.TextureLoader().load("img/bg.png");
        scene.background = bgTexture;

        camera = new THREE.PerspectiveCamera(50, winWth/winHgt, 1, 2000);
        camera.up.x = 0;
        camera.up.y = 1;
        camera.up.z = 0;
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 400;
        camera.lookAt(0,0,0);

        group = new THREE.Group();
        scene.add(group);

        // 地球    
        globe();

        //云
        clouds();
        
        // 星点
        stars();

        //taka
        takatag({lng: 131.267172, lat: -26.855702});

        // 半球光
        lights();

        // 渲染器
        renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(winWth, winHgt);
        container.appendChild(renderer.domElement);

        // 盘旋控制
        var orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        orbitControl.minDistrance = 20;
        orbitControl.maxDistrance = 50;
        orbitControl.enablePan = false;   //是否可平移
        //orbitControl.enableZoom = false;   //鼠标滚轮缩放控制
        //orbitControl.maxPolarAngle = Math.PI/2;   //最大仰视角

        // 事件监听
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('mousedown', onModelClick, false);
        window.addEventListener('touchstart', onModelMobileClick, false);
    }

    // 窗口大小改变
    function onWindowResize() {
        camera.aspect = window.innerWidth/window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //模型点击事件
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    function onModelClick( event ) {
        event.preventDefault();
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(clickObjects);

        if(intersects.length > 0) {
            // 在这里填写点击代码
            console.log("点击");
            console.log(intersects[0].object);
        }
    }
    //模型点击事件（移动端）
    function onModelMobileClick( event ) {
        mouse.x = (event.touches[ 0 ].pageX /  window.innerWidth) * 2 - 1;
        mouse.y = -(event.touches[ 0 ].pageY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        var intersects = raycaster.intersectObjects(clickObjects);

        if(intersects.length > 0) {
            // 在这里填写点击代码
            console.log("点击");
            console.log(intersects[0].object);
        }
    }

    // 渲染
    function render() {
        group.rotation.y -= 0.0005;
        renderer.render(scene, camera);
    }

    // 动画
    function animate() {
        requestAnimationFrame(animate);
        render();
    }

    init();
    animate();
})();