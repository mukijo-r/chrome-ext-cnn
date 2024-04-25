import * as tf from "/node_modules/@tensorflow/tfjs/dist/tf.fesm.js";

// Mendapatkan tab yang sedang aktif
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse,) {
  chrome.storage.sync.set({"x": (response)}, function() {
  console.log('Set x as '+ (response));
  
  });
  });
  