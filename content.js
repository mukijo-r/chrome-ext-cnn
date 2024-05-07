
// Dijalankan saat halaman web telah sepenuhnya dimuat, mengirim pesan ke background.js
window.onload = function() {
  const images = document.getElementsByTagName('img');
  const filteredImages = Array.from(images).filter(image => {
    return image.width > 100 && image.height > 100; // Check width and height
  });
  const imageUrls = filteredImages.map(image => image.src);

  if (filteredImages.length > 1) {
    chrome.runtime.sendMessage({ images: imageUrls }, function(response) {
      console.log('Gambar telah dikirim ke background.js');
      if (response.message === "Images processed") {        
        const detectCount = response.detectCount;
        console.log("objek terdeteksi : " + detectCount);
      }
    });
  } else {
    console.log('Tidak ada gambar dengan lebar dan panjang 100.');
  }
  
};
