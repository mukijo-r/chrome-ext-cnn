
// Dijalankan saat halaman web telah sepenuhnya dimuat, mengirim pesan ke background.js
window.onload = function() {  
  chrome.runtime.sendMessage(document.images.length);  

}



