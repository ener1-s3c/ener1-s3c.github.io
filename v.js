var link = document.createElement("a");
link.href = "https://raw.githubusercontent.com/ener1-s3c/ener1-s3c.github.io/master/payload1.pdf";
link.download = "payload1.pdf";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
