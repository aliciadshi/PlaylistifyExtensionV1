// CAUTION: CHECK IF PERSONAL API KEY IS STILL THERE BEFORE PUSHING TO GITHUB

const apiUrl = "https://api.openai.com/v1/completions"

if(typeof init === 'undefined') {
    
    const init = function() {
        const targetNode = document.body;
        
        const config = { attributes: false, childList: true, subtree: false };

        const callback = (mutationList, observer) => {
            for (const mutation of mutationList) {
                console.log(mutation.type);
                if (mutation.type === "childList") {
                    const tracksElement = document.querySelector("[data-testid='playlist-tracklist']");
                    if (tracksElement != null) {                        
                        console.log("trackselement")
                        console.log(tracksElement);

                        const selectedbyQuery = document.querySelector("[data-testid='entityTitle']");
                        console.log(selectedbyQuery);

                        const button = document.createElement("button");
                        button.textContent = "Suggest Names"
                        button.id = "extension-added-button-1"
                        
                        button.style.display =  "inline-block";
                        button.style.padding= "10px 20px";
                        button.style.fontSize= "16px";
                        button.style.fontWeight= "bold";
                        button.style.textAlign= "center";
                        button.style.textDecoration= "none";
                        button.style.color="#fff";
                        button.style.background= "linear-gradient(to right, #1db954, #25b960)";
                        button.style.border= "none";
                        button.style.borderRadius = "30px";
                        button.style.cursor= "pointer";
                        button.style.transition = "background 0.3s ease";
                        
                        button.onclick = function() {clickHandler(button, selectedbyQuery)};
                        
                        if (!document.getElementById("extension-added-button-1")&&!document.getElementById("extension-added-suggested-name")) {
                            selectedbyQuery.appendChild(button)
                        }

                        break;
                    }
                }
            }
        }

        const observer = new MutationObserver(callback);

        observer.observe(targetNode, config);
    }
    init();
}

function clickHandler(el, element) {
    const songNamesString = scrapeScreen();
    getRequest(songNamesString, element);
    var button = el;
    button.remove();
}

function scrapeScreen() {
    console.log("my button clicked")
    const tracklist = document.querySelectorAll("[data-testid='tracklist-row']");
    
    const songNames = [];

    for (const pack of tracklist) { 
        const unpacked = pack.querySelectorAll("div[data-encore-id]");
        songNames.push([unpacked[0].textContent, unpacked[1].textContent]);
    }
    
    var songNamesString = "Give me only a playlist name the following songs: \n";

    for (let index = 0; index < songNames.length; index++) {
        const songName = songNames[index][0];
        const songArtist = songNames[index][1];

        songNamesString = songNamesString.concat(songName, " - ", songArtist, "\n");
    }

    console.log("songNamesString");
    console.log(songNamesString);

    return songNamesString;
}

function getRequest(input, element) {
    fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer YOUR_API_KEY_HERE', // YOUR_API_KEY_HERE
        },
        body: JSON.stringify({
            "model": "gpt-3.5-turbo-instruct",
            "prompt": input
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data.choices[0].text);

        const para = document.createElement('p');
        const beginningPara = "Suggested: ";
        para.textContent = beginningPara.concat(data.choices[0].text);
        para.id = "extension-added-suggested-name"

        element.appendChild(para);
    })
    .catch(error => console.error(error));
}