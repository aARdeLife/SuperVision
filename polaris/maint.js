let net;
let classifier;
let video;
let label;
let modelReady = false;
let knnReady = false;
let predicting = false;

let scene;
let camera;
let renderer;
let arToolkitSource;
let arToolkitContext;

let mesh;

const setup = async () => {
  video = document.createElement('video');
  video.width = 224;
  video.height = 224;
  video.autoplay = true;
  video.muted = true;
  video.playsinline = true;
  document.body.appendChild(video);

  net = await mobilenet.load();
  classifier = knnClassifier.create();

  navigator.mediaDevices.getUserMedia({ video: true, audio: false })
    .then((stream) => {
      video.srcObject = stream;
      video.play();
    });

  net.predict(video).then(() => {
    modelReady = true;
  });

  knnReady = true;

  initAR();
  animate();
};

const initAR = () => {
  scene = new THREE.Scene();
  camera = new THREE.Camera();
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });

  renderer.setClearColor(new THREE.Color('lightgrey'), 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  arToolkitSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
  });

  arToolkitContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: 'data/camera_para.dat',
    detectionMode: 'mono',
  });

  arToolkitSource.init(() => {
    setTimeout(() => {
      onResize();
    }, 2000);
  });

  window.addEventListener('resize', onResize);

  add3DModel();
  initClickHandler();
};

const onResize = () => {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  arToolkitContext.arController && arToolkitContext.arController.canvas && arToolkit
