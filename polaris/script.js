let net;
let classifier;
let video;
let label;
let modelReady = false;
let knnReady = false;
let predicting = false;

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
};

const update = async () => {
  if (modelReady && knnReady) {
    const activation = net.infer(video, 'conv_preds');
    const result = await classifier.predictClass(activation);

    label = result.label;
    updateKNN();
    updateLabel();
  }

  requestAnimationFrame(update);
};

const updateKNN = () => {
  if (label && predicting) {
    classifier.addExample(net.infer(video, 'conv_preds'), label);
    predicting = false;
  }
};

const updateLabel = () => {
  const labelElement
const updateLabel = () => {
  const labelElement = document.querySelector('#label');
  if (labelElement && label) {
    labelElement.innerHTML = `Label: ${label}`;
  }
};
