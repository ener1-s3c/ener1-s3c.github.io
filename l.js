var link = document.createElement("a");
link.href = "https://drive.usercontent.google.com/download?id=1Z_Me1I7eeK5Mnz1BtoROrGS-seRBAikY&export=download&authuser=0&confirm=t&uuid=7090ddca-e5d5-4370-8659-c82607552980&at=AO7h07fqcaMOg5xGG9PaxhoL5qCv:1724566298448";
link.download = "payload1.pdf";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
