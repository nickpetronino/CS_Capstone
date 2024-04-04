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

/**
 * Gets the Spotify API Authroization Token.
 * 
 * @async
 */
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

/**
 * Queries the Spotify API for the User's search input. 
 * This function sends a GET request to the Spotify API's search endpoint, querying for albums based on the user-inputted search string.
 * @param {string} searchString - The user-inputted search string for albums.
 * @returns {Promise<Object>} - A promise that resolves to the search results containing album information.
 * @throws {Error} - If there is an error fetching the search results.
 * @description
 * This asynchronous function is responsible for initiating a search for albums on the Spotify API based on the provided user-inputted search string. It sends a GET request to the search endpoint with the user's query, including the Spotify API access token in the request headers for authentication. The function returns a promise that resolves to the search results containing information about albums matching the search criteria. In case of an error during the request, the error is caught, logged, and rethrown for the caller to handle.
 */
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

// Listens on the specified port.
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

// Status of the server. Can be checked at localhost:3001/status
app.get('/status', (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

/* /search endpoint:
This route handler is responsible for handling POST requests to the '/search' endpoint.
It extracts user input from the request body, performs an asynchronous search using the `albumSearch` function, and transforms the search results to provide a structured response.
The response includes album details such as ID, name, total tracks, release date (year only), artists, and the album cover URL (for use displaying cover art).
The transformed album data is sent as a JSON response using the Express `response.send` method.
*/
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
