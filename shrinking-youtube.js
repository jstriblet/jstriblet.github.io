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
    today = yyyy + '-' + mm + '-' + dd;

    let savedState = JSON.parse(localStorage.getItem('savedState')) || {date: { [today] : {videoSource : {}, channelSource: {}}}};

    let lastRefreshedDate = JSON.parse(localStorage.getItem('lastRefreshDate'));
    let localChannels = JSON.parse(localStorage.getItem('channelIds'));
    let localVideos = JSON.parse(localStorage.getItem('videoSource'));
    let channelSource;
    let videoSource;
    let from = '';
    

    if (localChannels && localVideos && today == lastRefreshedDate) {
        channelSource = JSON.parse(localStorage.getItem('channelIds'));
        videoSource = JSON.parse(localStorage.getItem('videoSource'));
        from = 'local storage';
    } else {
        channelSource = channelIds;
        videoSource = getVideoList(apiKey, channelSource, today);
        from = 'api call';
    }

    tempSavedState = {
        date: {
            [today] : {
                'videoSource' : videoSource,
                'channelSource' : channelSource
            }
        }
    }
  
    savedState = {...savedState, ...tempSavedState};

    console.log(from);
    console.log(today == lastRefreshedDate);
    console.log(localChannels);
    console.log(localVideos);
    console.log(savedState);


    localStorage.setItem('lastRefreshDate', JSON.stringify(today));
    localStorage.setItem('channelIds', JSON.stringify(channelIds));
    localStorage.setItem('videoSource', JSON.stringify(videoSource));
    renderVideos(videoSource, 'videos');
}

function getVideoList (apiKey, channelSource, today) {
    let videos = [];

    for ( let i = 0; i < channelSource.length; i++) {
        let activities = JSON.parse(getJSONData("https://www.googleapis.com/youtube/v3/activities?part=snippet&publishedAfter=" + today + "T00:00:00.0Z&channelId=" + channelSource[i] + "&maxResults=1&key=" + apiKey));
        let numItems = activities.items.length;

        if (numItems && activities.items[0].snippet.type === "upload") {
            let video = activities.items[0].snippet.thumbnails.default.url.split("/")[4];
            videos.push(video);
        }
    }
    // videos = ['fw9BWOkYPjY', 'VpMwaVM8ZSc', 'RI5JBOsS3AY', 'dQS_kmYz-Bs']; //Place Holder Videos
    return videos;
}

function renderVideos (videos, writediv) {

    let watchedVideos = [].concat(JSON.parse(localStorage.getItem('watchedVideos')));

    videos = videos.filter(el => { 
        console.log(watchedVideos.indexOf(el));
        console.log(el);
        return -1 === watchedVideos.indexOf(el)
        });

    document.getElementById(writediv).innerHTML = '';
    for (var i = 0; i < videos.length; i++) {
        document.getElementById(writediv).innerHTML += "<div class='row'><div id='player_" + videos[i]+ "' class='p-4 align-self-center'></div></div>";
    }

    // create youtube players
    function onYouTubePlayerAPIReady() {
        let player = [];
        for (var j = 0; j < videos.length; j++) {  
            player[j] = new YT.Player('player_' + videos[j], {
            height: '480',
            width: '640',
            videoId: videos[j],
            playerVars: {
                modestbranding: 1,
                rel: 0
            },
            events: {'onStateChange': onPlayerStateChange}
            });
        }
    }
    
    onYouTubePlayerAPIReady();

    // when video ends
    function onPlayerStateChange(event) {   
        let videoDuration = event.target.getDuration();
        let videoCurrentTime = event.target.getCurrentTime();
        let watchedVideos = [].concat(JSON.parse(localStorage.getItem('watchedVideos')));

        if(event.data === 0) {            
            event.target.a.classList.add("fadeOut","animated");

            setTimeout(function(){ event.target.a.remove(); }, 1000);

            console.log(event.target.a.id.split('player_')[1]);

            watchedVideos.push(event.target.a.id.split('player_')[1]);

            localStorage.setItem('watchedVideos', JSON.stringify(watchedVideos));

        // } else if (videoCurrentTime > (videoDuration - (videoDuration/9))) {
        //     //console.log('Youve watched enough!');
        //     event.target.a.classList.add("fadeOut","animated");
        //     setTimeout(function(){ event.target.a.remove(); }, 1000);
        }
    }
}