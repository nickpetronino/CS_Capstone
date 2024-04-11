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
 * Retrieves an access token from the Spotify API using client credentials authentication.
 * Sets the global variable 'token' with the retrieved access token.
 * 
 * @returns {Promise<Object>} A promise that resolves with an object containing the access token and related information.
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
    token = rv.access_token //Sets Global Token
    return rv
}

getToken()


/**
 * Searches for albums on the Spotify API based on a provided search string.
 * 
 * This function sends a request to the Spotify API to search for albums matching the provided search string.
 * If the search is successful, it returns data about the matching albums. If the request fails,
 * it returns an error message indicating the reason for the failure.
 * 
 * @param {string} searchString The search string to query albums on Spotify. Will get uri encoded to be compatable with api call.
 * @returns {Promise<Object|string>} A promise that resolves with album data if the search is successful, or an error message if the request fails.
 */
const albumSearch = async (searchString) => {
    // Construct search options including the bearer token
    const searchOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchString)}&type=album&limit=10`, searchOptions);
    // Parse the response body as JSON
    const data = await response.json();

    // Check if the response is not ok (i.e., if there's an error)
    if (!response.ok) {
        return data.error.status + " " + data.error.message;
    }
    return data;
}


/**
 * Starts the server to listen on the specified port.
 * 
 * @param {number} PORT The port number on which the server should listen.
 * @param {Function} callback The callback function to be executed when the server starts listening.
 */
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
});

/**
 * Handles GET requests to the /status endpoint.
 * 
 * This endpoint responds with a JSON object containing the server status.
 */
app.get('/status', (request, response) => {
    const status = {
        "Status": "Running"
    };

    response.send(status);
});

/**
 * Handles POST requests to the /search endpoint.
 * 
 * This endpoint processes a search request for albums based on user input.
 * It sends a request to the Spotify API to search for albums matching the user input.
 * Upon receiving the response from the Spotify API, it extracts relevant information
 * from the response data, including album ID, name, total tracks, and artists' names.
 * It then transforms this extracted data into a simplified format and sends it back to the client.
 * 
 * The properties extracted from each album item in the response include:
 * - id: The Spotify ID of the album.
 * - name: The name of the album.
 * - total_tracks: The total number of tracks in the album.
 * - artists: A comma-separated string containing the names of the artists associated with the album.
 * 
 * The simplified response JSON consists of an array of objects, where each object represents an album.
 * Each album object contains the extracted properties mentioned above.
 */
app.post('/search', async (request, response) => {
    const userInput = request.body.searchString;
    const result = await albumSearch(userInput);

    // Extract relevant information from the response data and transform it
    const simplifiedResponse = result.albums.items.map(({ id, name, total_tracks, artists }) => {
        return {
            id,
            name,
            total_tracks,
            artists: artists.map(artist => artist.name).join(', ')
        };
    });

    // Send the simplified response data back to the client
    response.send(simplifiedResponse);
});


module.exports = { app, getToken, albumSearch };