import * as tf from "/node_modules/@tensorflow/tfjs/dist/tf.fesm.js";

// Load model di luar fungsi
const loadModel = async () => {
  try {
      const model = await tf.loadLayersModel('model/model.json');
      return model;
  } catch (error) {
      console.error('Error loading model:', error);
      return null;
  }
};

// Memproses pesan saat menerima pesan dari content.js
chrome.runtime.onMessage.addListener(async function(message, sender, sendResponse) {
  // Memproses pesan
  if (message.images) {
    let detectCount = 0;
    const images = message.images;

    // Memuat model
    const model = await loadModel();

    // Memeriksa apakah model telah dimuat dengan sukses sebelum melanjutkan
    if (model) {
        for (const imageUrl of images) {
            getImageDataFromUrl(imageUrl)
            .then(imageData => {
                if (imageData) {
                    console.log('ImageData berhasil diambil:', imageData);
                    const tensorImage = tf.browser.fromPixels(imageData);
                    const resizedImage = tf.image.resizeBilinear(tensorImage, [299, 299]);
                    const normalizedImage = resizedImage.toFloat().div(tf.scalar(255));
                    const expandedImage = normalizedImage.expandDims();

                    // Lakukan prediksi
                    const predictions = model.predict(expandedImage);
                    const prediction = predictions.arraySync()[0][0];
                    console.log(imageUrl);

                    // Mencetak hasil prediksi
                    if (prediction > 0.7) {
                        console.log("Class 1");
                        detectCount += 1;
                        console.log("Terdeteksi positif : ", detectCount)
                    } else {
                        console.log("Class 0");
                    }
                    console.log('Probabilitas prediksi:', prediction);
                } else {
                    console.log('Gagal mengambil ImageData dari URL:', imageUrl);
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    } else {
        console.error('Model gagal dimuat, prediksi tidak dapat dilakukan.');
    }
  }
});

async function getImageDataFromUrl(imageUrl) {
  try {
      // Mengambil gambar dari URL menggunakan fetch API
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Membuat objek ImageData dari blob
      const imageBitmap = await createImageBitmap(blob);
      const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
      const context = canvas.getContext('2d');
      context.drawImage(imageBitmap, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      return imageData;
  } catch (error) {
      console.error('Error fetching or processing image:', error);
      return null;
  }
}






  