    var back = document.getElementById("back");
    back.style.opacity = "0.5";
    var tcanvas = document.createElement('canvas');
    tcanvas.width = 1280;
    tcanvas.height = 1024;
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(tcanvas);

    let tcontext = tcanvas.getContext('2d');
    var txt = "Make the diagnosis RADIOLOGY";
    tcontext.shadowColor = "yellow";
    tcontext.shadowBlur = 40;
    tcontext.lineWidth = 20;
    tcontext.font = "bold 90px Machine Gunk";
    tcontext.textAlign = "center";
    var a2 = tcanvas.width;
    var b2 = tcontext.measureText(txt).width;
    var gradient = tcontext.createLinearGradient((a2 - b2) / 2, 0, (a2 + b2) / 2, 0);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(1, 'magenta');
    tcontext.fillStyle = gradient;

    printAtWordWrap(tcontext, txt, tcanvas.width / 2, tcanvas.height / 2, 120, tcanvas.width - 150);
    document.querySelector('div.wrap').style.display = "none";

    tcanvas.addEventListener('click', function() {
        body.removeChild(tcanvas);
        back.style.opacity = "1";
        document.querySelector('div.wrap').style.display = "block";
    })

    function printAtWordWrap(context, text, x, y, lineHeight, fitWidth) {
        fitWidth = fitWidth || 0;
        if (fitWidth <= 0) {
            context.fillText(text, x, y);
            return;
        }
        var words = text.split(' ');
        var currentLine = 0;
        var idx = 1;
        while (words.length > 0 && idx <= words.length) {
            var str = words.slice(0, idx).join(' ');
            var w = context.measureText(str).width;
            if (w > fitWidth) {
                if (idx == 1) {
                    idx = 2;
                }
                context.fillText(words.slice(0, idx - 1).join(' '), x, y + (lineHeight * currentLine));
                currentLine++;
                words = words.splice(idx - 1);
                idx = 1;
            } else {
                idx++;
            }
        }
        if (idx > 0)
            context.fillText(words.join(' '), x, y + (lineHeight * currentLine));
    }