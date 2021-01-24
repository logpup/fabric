import * as THREE from './three/build/three.module.js';

function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas, alpha:true});

    // boiler plate scene init function
    function makeScene(elem) {
        const scene = new THREE.Scene();

        scene.background = new THREE.Color('#ffffff');

        const fov = 45;
        const aspect = 2;
        const near = 0.01;
        const far = 5;
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.z = 2;
        camera.position.set(0, 0, 3);
        camera.lookAt(0, 0, 0);

        {
            const color = 0xFFFFFF;
            const intensity = 1;
            const light = new THREE.DirectionalLight(color, intensity);
            light.position.set(-1, 2, 4);
            scene.add(light);
        }

        return {scene, camera, elem};
    }

    // add cube mesh fx
    function setupScene1() {
        const sceneInfo = makeScene(document.querySelector('#box'));
        const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
        const material = new THREE.MeshPhongMaterial({color: 'red'});
        const mesh = new THREE.Mesh(geometry, material);
        sceneInfo.scene.add(mesh);
        sceneInfo.mesh = mesh;
        return sceneInfo;
    }

    // add diamond geode mesh fx
    function setupScene2() {
        const sceneInfo = makeScene(document.querySelector('#pyramid'));
        const radius = .8;
        const widthSegments = 4;
        const heightSegments = 2;
        const geometry = new THREE.SphereBufferGeometry(radius, widthSegments, heightSegments);
        const material = new THREE.MeshPhongMaterial({
            color: 'blue',
            flatShading: true,
        });
        const mesh = new THREE.Mesh(geometry, material);
        sceneInfo.scene.add(mesh);
        sceneInfo.mesh = mesh;
        return sceneInfo;
    }

    const sceneInfo1 = setupScene1();
    const sceneInfo2 = setupScene2();

    function resizeRendererToDisplaySize(renderer) {
        const canvas = renderer.domElement;
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        const needResize = canvas.width!== width || canvas.height !== height;
        if (needResize) {
            renderer.setSize(width, height, false);
        }
        return needResize;
    }

    function renderSceneInfo(sceneInfo) {
        const {scene, camera, elem} = sceneInfo;

        // get the viewport relative position of this element
        const {left, right, top, bottom, width, height} = elem.getBoundingClientRect();

        const isOffscreen = 
        bottom < 0 ||
        top > renderer.domElement.clientHeight ||
        right < 0 ||
        left > renderer.domElement.clientWidth;

        if (isOffscreen) {
            return;
        }

        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        const positiveYUpBottom = renderer.domElement.clientHeight - bottom;
        renderer.setScissor(left, positiveYUpBottom, width, height);
        renderer.setViewport(left, positiveYUpBottom, width, height);

        renderer.render(scene, camera);
    }

    function render(time) {
        time *= 0.001;

        resizeRendererToDisplaySize(renderer);

        renderer.setScissorTest(false);
        renderer.clear(true, true);
        renderer.setScissorTest(true);

        sceneInfo1.mesh.rotation.y = time * .1;
        sceneInfo2.mesh.rotation.y = time * .1;

        renderSceneInfo(sceneInfo1);
        renderSceneInfo(sceneInfo2);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}

main();