// import tensorflow.js library
import * as tf from "/node_modules/tf.fesm.js";

// Load model function initiated
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
  
  // Receive messages from content.js
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) { 
    // Processing the messages
    if (message.images) {       
      console.clear()
      let imageCount = 1;
      let detectCount = 0;
      const images = message.images;
      
      // Load model
      loadModel().then(model => {
        console.log("model loaded", model)      
        for (const imageUrl of images) {
          getImageDataFromUrl(imageUrl)
            .then(imageData => {
              if (imageData) {
                console.log('Image url ' + imageCount +': ' + imageUrl);
                console.log('ImageData : ', imageData);
                const tensorImage = tf.browser.fromPixels(imageData);
                const resizedImage = tf.image.resizeBilinear(tensorImage, [299, 299]);
                const normalizedImage = resizedImage.toFloat().div(tf.scalar(255));
                const expandedImage = normalizedImage.expandDims();

                // classifying image
                const predictions = model.predict(expandedImage);
                const prediction = predictions.arraySync()[0][0];                    

                if (prediction > 0.8) {
                    console.log("Porn");
                    detectCount += 1; 
                } else {
                    console.log("Not Porn");
                }
                console.log('Probability :', prediction.toFixed(5));
                console.log("Porn detected : ", detectCount)
                imageCount += 1;

                // send a response to content.js if it finds 5 images detected as pornography
                if (detectCount === 5) {
                    sendResponse({ message: "Porn images detected", detectCount });
                    return;
                }

              } else {
                console.log('Failed to fetch image', imageUrl);
              }                
            })            
            .catch(error => {
              console.error('Error:', error);
            });           
            
        }
      });
    }
    return true;
  });
  
// function to convert image url to imageData
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
        if (canvas.width > 50 && canvas.height > 50) {
          resolve(imageData);
        } else {
          console.log('Failed to fetch image');
        }
        
      })
      .catch(error => {
        console.log('Error fetching or processing image:', error);
      });
  });
}



  