import * as tf from '@tensorflow/tfjs';
// Load model
tf.loadLayersModel('model.json').then(async function(model) {
  
  // Function to be executed when the DOM content is fully loaded
  document.addEventListener('DOMContentLoaded', async function() {
    
    // Mendapatkan semua elemen gambar di halaman
    const images = document.getElementsByTagName('img');
      
    // Mendefinisikan variabel untuk menyimpan jumlah hotdog yang terdeteksi
    let hotdogCount = 0;

    // Fungsi untuk memeriksa apakah suatu gambar adalah hotdog
    async function isHotdog(imgSrc) {
      // Load image tensor
      const img = document.createElement('img');
      img.src = imgSrc;
      await img.decode();
      const tensor = tf.browser.fromPixels(img)
          .resizeNearestNeighbor([299, 299])
          .toFloat()
          .expandDims();

      // Perform prediction
      const prediction = model.predict(tensor).dataSync();
      return prediction[0] === 1;
    }

    for (let i = 0; i < images.length; i++) {
      if (await isHotdog(images[i].src)) {
          hotdogCount++;
      }
    }

    hotdogCount += 1;

    // Memperbarui teks
    document.getElementById('count').textContent = hotdogCount;
  });
});