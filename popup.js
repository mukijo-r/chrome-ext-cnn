// Mengambil nilai yang disimpan dengan kunci "x" dari penyimpanan sinkronisasi Chrome
chrome.storage.sync.get('x', function(data) {
  document.getElementById("imageCount").innerHTML = data.x;
  });