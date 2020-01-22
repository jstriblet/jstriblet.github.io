
function getJSONData(yourUrl) {
    var Httpreq = new XMLHttpRequest();
    try {
        Httpreq.open("GET", yourUrl, false);
        Httpreq.send(null);
    } catch (ex) {
        alert(ex.message);  
    }
    // console.log(Httpreq.responseText)
    return Httpreq.responseText;
}

// https://www.googleapis.com/youtube/v3/channels?part=snippet&id=UCxdCeHBUOlcCWr6RM8acEog,UCoOae5nYA7VqaXzerajD0lg&key=KEY!!
// https://www.googleapis.com/youtube/v3/videos?part=snippet&id=fw9BWOkYPjY&key=KEY!!

function showVideoList(userid, writediv, maxnumbervideos, apikey) {
    try {
        document.getElementById(writediv).innerHTML = "";
        var keyinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/channels?part=snippet&id=" + userid + "&key=" + apikey));
        var userid = keyinfo.items[0].id;
        var channeltitle = keyinfo.items[0].snippet.title;
        var channeldescription = keyinfo.items[0].snippet.description;
        var channelthumbnail = keyinfo.items[0].snippet.thumbnails.default.url; // default, medium or high
        //channel header
        document.getElementById(writediv).innerHTML += "<div style='width:100%;min-height:90px;'>"
            + "<a href='https://www.youtube.com/channel/" + userid + "' target='_blank'>"
            + "<img src='" + channelthumbnail + "' style='border:none;float:left;margin-right:10px;' alt='" + channeltitle + "' title='" + channeltitle + "' /></a>"
            + "<div style='width:100%;text-align:center;'><h1><a href='https://www.youtube.com/channel/" + userid + "' target='_blank'>" + channeltitle + "</a></h1>" + channeldescription + "</div>"
            + "</div>";
        var videoinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + userid + "&maxResults=" + maxnumbervideos + "&key=" + apikey));
        var videos = videoinfo.items;
        var videocount = videoinfo.pageInfo.totalResults;
        // video listing
        for (var i = 0; i < videos.length; i++) {
            var videoid = videos[i].id.videoId;
            var videotitle = videos[i].snippet.title;
            var videodescription = videos[i].snippet.description;
            var videodate = videos[i].snippet.publishedAt; // date time published
            var videothumbnail = videos[i].snippet.thumbnails.default.url; // default, medium or high
            document.getElementById(writediv).innerHTML += "<hr /><div style='width:100%;min-height:90px;'>"
                + "<a href='https://www.youtube.com/watch?v=" + videoid + "' target='_blank'>"
                + "<img src='" + videothumbnail + "' style='border:none;float:left;margin-right:10px;' alt='" + videotitle + "' title='" + videotitle + "' /></a>"
                + "<h3><a href='https://www.youtube.com/watch?v=" + videoid + "' target='_blank'>" + videotitle + "</a></h3>" + videodescription + ""
                + "</div>";
        }
    } catch (ex) {
        alert(ex.message);
    }
}


// Listen for submit click
document.querySelector('#submit').addEventListener('click', (e) => {
    let text = document.getElementById("rss").value;
    
    if (text) {
        parseData(text);
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
    // console.log(channelIds);

    saveXmlLinks(channelIds);
    getYouTubeVideos(channelIds);
}

function getYouTubeVideos(channelIds) {

    for (let i = 0; i < channelIds.length; i++) {
        showVideoList(channelIds[1], "videos", 4, "KEY!!");
 
    }
}


// Save xmlLinks to local storage
const saveXmlLinks = (xmlLinks) => {
    localStorage.setItem('xmlLinks', JSON.stringify(xmlLinks));
}