// Listen for submit click
document.querySelector('#submit').addEventListener('click', (e) => { 
    let channelIds;

    if (document.getElementById("rss").value) {
        document.getElementById("collapseBtn").click();// close text box
        
        // Do Something to add "working" throbber (maybe a progress bar?) (Replace text on button instead?)
        document.getElementById('videos').innerHTML = '<div class="spinner-border text-primary" role="status"> <span class="sr-only">Loading...</span></div>';

        // Get Videos 
        setTimeout(function(){ //Timeout needed for brouser to render throbber (spinner) to screen
            channelIds = parseData(document.getElementById("rss").value);
            videoSource('___',channelIds);
            }, 1000);
    }
});

function parseData(text) {
    let arr = text.split("\"");
    let xmlLinks = [];
    let channelIds = [];

    xmlLinks = arr.filter( el => {
        return -1 < el.indexOf("https://www.youtube.com/feeds/videos.xml?channel_id=");
    });

    channelIds = xmlLinks.map(el => {
        return el.split("channel_id=")[1];
    }) ;

    return channelIds;
}   