var link = document.createElement("a");
link.href = "https://ener1-s3c.github.io/payload1.pdf";
link.download = "a.pdf";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
