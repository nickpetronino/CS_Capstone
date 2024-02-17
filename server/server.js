const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;
const clientID = '61fb022f838c48d5bdf9a91490e6f320';
const clientSecret = '6eb233f414f947949a95297dc77c3c63';
let token;

async function getToken() {
    const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        body: new URLSearchParams({
            'grant_type': 'client_credentials',
        }),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + (Buffer.from(clientID + ':' + clientSecret).toString('base64')),
        },
    });
    const rv = await response.json()
    token = rv.access_token
    console.log('rv:', rv)
    return rv
}


getToken()


const albumSearch = async (searchString) => {
    const searchOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        const data = await (await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchString)}&type=album&limit=10`, searchOptions)).json()
        return data;
    } catch (error) {
        console.error('Error fetching access token:', error);
    }
}


app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

app.get('/status', (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

app.post('/search', async (request, response) => {
    const userInput = request.body.searchString;
    console.log('User String:', userInput)
    const result = await (albumSearch(userInput))
    console.log(result)
    const rv = result.albums.items.map(({id, name, total_tracks, artists}) => {
        return {id, name, total_tracks, artists:artists.map(artist => artist.name).join(', ')}
    })
    //response.send(JSON.stringify(result, undefined, 4))
    response.send(rv)
});