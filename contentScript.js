const apiUrl = "https://api.openai.com/v1/completions"

if(typeof init === 'undefined') {
    const init = function() {
        const songNames = [];
        setTimeout(function(){
            const selectedbyQuery = document.querySelector("[data-testid='entityTitle']");
            console.log(selectedbyQuery);

            const tracklist = document.querySelectorAll("[data-testid='tracklist-row']");

            for (const pack of tracklist) { 
                const unpacked = pack.querySelectorAll("div[data-encore-id]");
                songNames.push([unpacked[0].textContent, unpacked[1].textContent]);
            }
            
            var songNamesString = "Come up with a playlist name for a playlist with the following songs: \n";

            for (let index = 0; index < songNames.length; index++) {
                const songName = songNames[index][0];
                const songArtist = songNames[index][1];

                songNamesString = songNamesString.concat(index+1, ". ", songName, " - ", songArtist, "\n");

            }

            console.log("songNamesString");
            console.log(songNamesString);

            fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": 'Bearer YOUR_API_KEY_HERE', //YOUR_API_KEY_HERE
                },
                body: JSON.stringify({
                    "model": "gpt-3.5-turbo-instruct",
                    "prompt": songNamesString
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log(data.choices[0].text);
                
                const para = document.createElement('p');
                const beginningPara = "Suggested: ";
                para.textContent = beginningPara.concat(data.choices[0].text);

                selectedbyQuery.appendChild(para);
            })
            .catch(error => console.error(error));

        },1000)
    }
    init();
}