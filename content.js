// Dijalankan saat halaman web telah sepenuhnya dimuat, mengirim pesan ke background.js
document.addEventListener('DOMContentLoaded', function() {
  const images = document.getElementsByTagName('img');
  const filteredImages = Array.from(images).filter((image, index) => {
      return index < 30 && image.width > 100 && image.height > 100; 
  });
  const imageUrls = filteredImages.map(image => image.src);  

  if (filteredImages.length > 1) {
    chrome.runtime.sendMessage({ images: imageUrls }, function(response) {
      console.log('Gambar telah dikirim ke background.js');
      if (response.message === "Images processed") {        
        const detectCount = response.detectCount;
        console.log("objek terdeteksi : " + detectCount);
        document.head.innerHTML = generateSTYLES();
        document.body.innerHTML = generateHTML();
      }
    });
  } else {
    console.log('Tidak ada gambar dengan lebar dan panjang 100.');
  }  
});

// Fungsi CSS
const generateSTYLES = () => {
  return `
  <style>
  @import url(https://fonts.googleapis.com/css?family=Raleway:700);

  *, *:before, *:after {
    box-sizing: border-box;
  }
  html {
      height: 100%;
  }
  body {
      font-family: 'Raleway', sans-serif;
      background-color: #342643; 
      height: 100%;
      padding: 10px;
  }

  a {
    color: #EE4B5E !important;
    text-decoration:none;
  }
  a:hover {
    color: #FFFFFF !important;
    text-decoration:none;
  }

  .text-wrapper {
      height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
      font-size: 5em;
      font-weight: 700;
      color: #EE4B5E;
  }

  .subtitle {
      font-size: 36px;
      text-align: center;
      font-weight: 700;
      color: #1FA9D6;
  }
  .isi {
      font-size: 18px;
      text-align: center;
      margin:30px;
      padding:20px;
      color: white;
  }
  .buttons {
      margin: 30px;
          font-weight: 700;
          border: 2px solid #EE4B5E;
          text-decoration: none;
          padding: 15px;
          text-transform: uppercase;
          color: #EE4B5E;
          border-radius: 26px;
          transition: all 0.2s ease-in-out;
          display: inline-block;
          
          .buttons:hover {
              background-color: #EE4B5E;
              color: white;
              transition: all 0.2s ease-in-out;
          }
    }
  }
  <style>    
  `;
};

// Fungsi html
const generateHTML = () => {
  return `
  <div class="text-wrapper">
    <div class="title" data-content="404">
      403 - AKSES TERLARANG
    </div>

    <div class="subtitle">
      Anda tidak diijinkan untuk melanjutkan. Kemungkinan halaman yang coba Anda akses mengandung konten pornografi.
    </div>
    <div class="isi">
      Server web dapat mengembalikan kode status HTTP 403 Terlarang sebagai respons terhadap permintaan dari klien untuk halaman web atau sumber daya untuk menunjukkan bahwa server dapat dijangkau dan memahami permintaan tersebut, namun menolak untuk mengambil tindakan lebih lanjut. Respons kode status 403 adalah hasil dari server web yang dikonfigurasi untuk menolak akses, karena alasan tertentu, ke sumber daya yang diminta oleh klien.
    </div>

    <div class="buttons">
        <a class="button" href="about:blank">KEMBALI</a>
    </div>
</div>
   `;
};
