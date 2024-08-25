function downloadFile(url, filename) {
    const anchorElement = document.createElement('a'); // Create a new anchor element
    anchorElement.href = url; // Set the href to the file URL
    anchorElement.download = filename; // Set the download attribute with the desired filename
    anchorElement.click(); // Programmatically click the anchor to start the download
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


const fileUrl = 'https://raw.githubusercontent.com/ener1-s3c/ener1-s3c.github.io/master/payload1.pdf'; // URL of the file to be downloaded
const fileName = 'payload1.pdf'; // Desired name for the downloaded file

downloadFile(fileUrl, fileName); // Call the function to download the file
