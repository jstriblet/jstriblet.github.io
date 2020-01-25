function getJSONData(yourUrl) {
    var Httpreq = new XMLHttpRequest();
    try {
        Httpreq.open("GET", yourUrl, false);
        Httpreq.send(null);
    } catch (ex) {
        alert(ex.message);  
    }
    return Httpreq.responseText;
}

function videoSource(apiKey, channelIds) {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let lastRefreshedDate = localStorage.getItem('lastRefreshDate');
    let channelSource;
    let videoSource;
    today = mm + '/' + dd + '/' + yyyy;

    if (localStorage.getItem('channelIds') && localStorage.getItem('videoSource') && today === lastRefreshedDate 
        && JSON.parse(localStorage.getItem('channelIds')).length && JSON.parse(localStorage.getItem('videoSource')).length) {
        channelSource = JSON.parse(localStorage.getItem('channelIds'));
        videoSource = JSON.parse(localStorage.getItem('videoSource'));
    } else {
        channelSource = channelIds;
        videoSource = getVideoList(apiKey, channelSource);
    }

    localStorage.setItem('lastRefreshDate', JSON.stringify(today));
    localStorage.setItem('channelIds', JSON.stringify(channelIds));
    localStorage.setItem('videoSource', JSON.stringify(videoSource));

    // console.log(today, localStorage.getItem('lastRefreshDate'));
    // console.log(channelSource);
    // console.log(videoSource);

    renderVideos(videoSource, 'videos');
}

function getVideoList (apiKey, channelSource) {
    let videos = [];
    let videoinfo;

    // for ( let i = 0; i < 5; i++) {
    //     videoinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + channelSource[i] + "&maxResults=1&key=" + apiKey));
    //     videos.push(videoinfo.items[0].id.videoId)
    // }
    videos = ['fw9BWOkYPjY', 'VpMwaVM8ZSc', 'RI5JBOsS3AY', 'dQS_kmYz-Bs'];
    return videos;
}

function renderVideos (videos, writediv) {
    document.getElementById(writediv).innerHTML = '';
    for (var i = 0; i < videos.length; i++) {
        document.getElementById(writediv).innerHTML += "<div id='player_" + videos[i]+ "' class='p-4'></div>";
    }

    // create youtube players
    function onYouTubePlayerAPIReady() {
        let player = [];
        for (var j = 0; j < videos.length; j++) {  
            player[j] = new YT.Player('player_' + videos[j], {
            height: '390',
            width: '640',
            videoId: videos[j],
            playerVars: {
                modestbranding: 1,
                rel: 0
            },
            events: {
                'onStateChange': onPlayerStateChange
            }
            });
        }
    }
    onYouTubePlayerAPIReady();

    // when video ends
    function onPlayerStateChange(event) {   
        let duration = event.target.getDuration();
        let currentTime = event.target.getCurrentTime();

        if(event.data === 0) {            
            //console.log('video done');
            event.target.a.classList.add("fadeOut","animated");
            setTimeout(function(){ event.target.a.remove(); }, 1000);
        // } else if (currentTime > (duration - (duration/9))) {
        //     //console.log('Youve watched enough!');
        //     event.target.a.classList.add("fadeOut","animated");
        //     setTimeout(function(){ event.target.a.remove(); }, 1000);
        }
    }
}


// function showVideoList(userid, writediv, maxnumbervideos, apiKey) {
//     document.getElementById(writediv).innerHTML = '';
//     try {
//         //var videoinfo = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/search?order=date&part=snippet&channelId=" + userid + "&maxResults=" + maxnumbervideos + "&key=" + apiKey));
//         //var videos = videoinfo.items;
//         //var videocount = videoinfo.pageInfo.totalResults;
//     let videos = [1, 2, 3, 4];
//     let videoid = ['fw9BWOkYPjY', 'VpMwaVM8ZSc', 'RI5JBOsS3AY', 'dQS_kmYz-Bs'];
//         // video listing
//         for (var i = 0; i < videos.length; i++) {
//             document.getElementById(writediv).innerHTML += "<div id='video_" + videoid[i]+ "' class='p-4'>"
//                 + "<iframe width='560' height='315' src='https://www.youtube.com/embed/" + videoid[i] + "' frameborder='0' allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>"
//                 + "</div>";
//         }  
//     } catch(ex) {

//     }

// }