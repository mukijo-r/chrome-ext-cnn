// send a message to background.js after the page has finished loading
window.onload = function() {
  const images = document.getElementsByTagName('img');
  const filteredImages = Array.from(images).filter((image) => {
    return image.width > 100 && image.height > 100;
  });

  const limitedImages = filteredImages.slice(0, 40);
  const imageUrls = limitedImages.map(image => image.src); 

  if (filteredImages.length > 0) {
    chrome.runtime.sendMessage({ images: imageUrls }, function(response) {
      console.log('Images fetched and sent to background.js');
      if (response.message === "Porn images detected") {        
        const detectCount = response.detectCount;
        console.log("Receive detected porn images : " + detectCount);
        document.head.innerHTML = generateSTYLES();
        document.body.innerHTML = generateHTML();
      }
    });
  } else {
    console.log('Stop Porn : failed to fetch picture or picture not available');
  }  
};

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
      background-color: #4C4650; 
      height: 100%;
      padding: 10px;
  }

  a {
    color: #30DF0D !important;
    text-decoration:none;
  }
  a:hover {
    color: #FFFFFF !important;
    text-decoration:none;
  }

  .text-wrapper {
      height: 100%;
    display: flex;
    text-align: center;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .title {
      font-size: 40px;
      font-weight: 600;
      color: #EE4B5E;
  }

  .subtitle {
      font-size: 36px;
      text-align: center;
      font-weight: 600;
      color: #1FA9D6;
  }
  .isi {
      font-size: 26px;
      text-align: center;
      margin:30px;
      padding:20px;
      color: white;
  }
  .buttons {
      margin: 30px;
          font-weight: 700;
          border: 2px solid #30DF0D;
          text-decoration: none;
          padding: 15px;
          text-transform: uppercase;
          color: #30DF0D;
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
      403 - ACCESS FORBIDEN
    </div>

    <div class="subtitle">
      You don't have permission to open this web page.
    </div>
    <div class="isi">
      The browser can't provide additional entry because the web page you're trying to open is a resource that you're not allowed to access.
    </div>

    <div class="buttons">
        <a class="button" href="about:blank">HOME</a>
    </div>
</div>
   `;
};
