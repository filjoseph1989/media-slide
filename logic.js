const fileInput = document.getElementById('file-input');
const uploadScreen = document.getElementById('upload-screen');
const sliderScreen = document.getElementById('slider-screen');

const imageViewer = document.getElementById('image-viewer');
const videoViewer = document.getElementById('video-viewer');

const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const randomizeBtn = document.getElementById('randomize-btn');
const changeFilesBtn = document.getElementById('change-files-btn');
const statusDiv = document.getElementById('status');

let mediaFiles = [];
let currentIndex = 0;
let imageTimeout;
const IMAGE_DURATION = 5000; // 5 seconds for images

fileInput.addEventListener('change', (event) => {
  const files = Array.from(event.target.files);
  if (files.length > 0) {
    mediaFiles = files.map(file => ({
      file: file,
      url: URL.createObjectURL(file)
    }));
    uploadScreen.classList.add('hidden');
    sliderScreen.classList.remove('hidden');
    sliderScreen.classList.add('flex');
    startSlider();
  }
});

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function startSlider() {
  shuffleArray(mediaFiles);
  currentIndex = 0;
  displayMedia();
}

function displayMedia() {
  if (mediaFiles.length === 0) return;

  clearTimeout(imageTimeout);

  const currentMedia = mediaFiles[currentIndex];
  const fileType = currentMedia.file.type;

  imageViewer.classList.add('hidden');
  videoViewer.classList.add('hidden');

  if (fileType.startsWith('image/')) {
    imageViewer.src = currentMedia.url;
    imageViewer.classList.remove('hidden');
    imageTimeout = setTimeout(showNext, IMAGE_DURATION);
  } else if (fileType.startsWith('video/')) {
    videoViewer.src = currentMedia.url;
    videoViewer.classList.remove('hidden');
    videoViewer.play().catch(e => console.log("Autoplay was prevented. User must interact first."));
  }
  updateStatus();
}

function showNext() {
  currentIndex = (currentIndex + 1) % mediaFiles.length;
  displayMedia();
}

function showPrev() {
  currentIndex = (currentIndex - 1 + mediaFiles.length) % mediaFiles.length;
  displayMedia();
}

function updateStatus() {
  statusDiv.textContent = `Displaying ${currentIndex + 1} of ${mediaFiles.length}: ${mediaFiles[currentIndex].file.name}`;
}

videoViewer.addEventListener('ended', showNext);
nextBtn.addEventListener('click', showNext);
prevBtn.addEventListener('click', showPrev);

randomizeBtn.addEventListener('click', () => {
  startSlider();
});

changeFilesBtn.addEventListener('click', () => {
  // Clean up old object URLs to prevent memory leaks
  mediaFiles.forEach(media => URL.revokeObjectURL(media.url));
  mediaFiles = [];

  sliderScreen.classList.add('hidden');
  sliderScreen.classList.remove('flex');
  uploadScreen.classList.remove('hidden');
  fileInput.value = ''; // Reset file input
});