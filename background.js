import * as tf from "/node_modules/@tensorflow/tfjs/dist/tf.fesm.js";

// Load model di luar fungsi
const loadModel = () => {
    return tf.loadLayersModel('model/model.json')
      .then(model => {
        return model;
      })
      .catch(error => {
        console.error('Error loading model:', error);
        return null;
      });
  };
  
  // Memproses pesan saat menerima pesan dari content.js
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) { 
    // Memproses pesan
    if (message.images) {       
      console.clear()
      let imageCount = 0;
      let detectCount = 0;
      const tabId = sender.tab.id;
      const images = message.images;
      console.log('tab id :' + tabId)
      
      // Memuat model secara synchronous
      loadModel().then(model => {      
        for (const imageUrl of images) {
          
          getImageDataFromUrl(imageUrl)
            .then(imageData => {
              if (imageData) {
                console.log(imageUrl);
                console.log('ImageData ' + imageCount + ': ', imageData);
                const tensorImage = tf.browser.fromPixels(imageData);
                const resizedImage = tf.image.resizeBilinear(tensorImage, [299, 299]);
                const normalizedImage = resizedImage.toFloat().div(tf.scalar(255));
                const expandedImage = normalizedImage.expandDims();

                // Lakukan prediksi
                // Lakukan prediksi
                const predictions = model.predict(expandedImage);
                const prediction = predictions.arraySync()[0][0];                    

                // Mencetak hasil prediksi
                if (prediction > 0.7) {
                    console.log("Class 1");
                    detectCount += 1; 
                } else {
                    console.log("Class 0");
                }
                console.log('Probabilitas :', prediction.toFixed(5));
                console.log("Terdeteksi positif : ", detectCount)
                imageCount += 1;

                if (detectCount === 4) {
                    sendResponse({ message: "Images processed", detectCount });;
                }

              } else {
                console.log('Gagal mengambil ImageData dari URL:', imageUrl);
              }                
            })
            .catch(error => {
              console.error('Error:', error);
            });
          if (detectCount === 10) { 
            return; 
          }   
        }
      });
    }
    return true;
  });
  

function getImageDataFromUrl(imageUrl) {
  return new Promise((resolve, reject) => {
    fetch(imageUrl)
      .then(response => response.blob())
      .then(blob => createImageBitmap(blob))
      .then(imageBitmap => {
        const canvas = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const context = canvas.getContext('2d');
        context.drawImage(imageBitmap, 0, 0);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        resolve(imageData);
      })
      .catch(error => {
        console.error('Error fetching or processing image:', error);
        reject(null);
      });
  });
}



  