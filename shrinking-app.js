// Listen for submit click
document.querySelector('#submit').addEventListener('click', (e) => {    
    if (document.getElementById("rss").value) {
        parseData(document.getElementById("rss").value);
        document.getElementById("collapseBtn").click();
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
    }) 

    videoSource('---',channelIds);
}