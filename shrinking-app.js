// Listen for submit click
document.querySelector('#submit').addEventListener('click', (e) => { 
    let channelIds;
    let userChannelID = "";

    if (true) {
        document.getElementById("collapseBtn").click();// close text box
        
        // Render "working" throbber
        document.getElementById('videos').innerHTML = '<div class="spinner-border text-primary" role="status"> <span class="sr-only">Loading...</span></div>';

        // userChannelID = document.getElementById("userChannelId").value;


        // Get Subscriptions then Videos 
        setTimeout(function(){ //Timeout needed for brouser to render throbber to screen

            var provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
            //.then(function(result) {
            // // This gives you a Google Access Token. You can use it to access the Google API.
            // var token = result.credential.accessToken;
            // // The signed-in user info.
            // var user = result.user;
            // // ...
            // }).catch(function(error) {
            // // Handle Errors here.
            // var errorCode = error.code;
            // var errorMessage = error.message;
            // // The email of the user's account used.
            // var email = error.email;
            // // The firebase.auth.AuthCredential type that was used.
            // var credential = error.credential;
            // // ...
            // });




            // channelIds = parseData(document.getElementById("rss").value);
            // videoSource('___',channelIds);
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


'https://www.googleapis.com/youtube/v3/subscriptions?channelId=&part=contentDetails&k'