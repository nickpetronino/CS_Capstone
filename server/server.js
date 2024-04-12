const express = require('express');
const cors = require('cors');
const nedb = require('nedb-promises');
const app = express();
const fs = require('fs');
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3001;
const clientID = '61fb022f838c48d5bdf9a91490e6f320';
const clientSecret = '6eb233f414f947949a95297dc77c3c63';
let token; // Variable to store the Spotify API access token globally.

const reviews = new nedb({ filename: './database/reviews.nedb', autoload: true })

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
    const rv = await response.json();
    token = rv.access_token; // Set the obtained access token for future API requests.
}
// Invoke the function to fetch and set the Spotify API access token.
getToken();




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
    // Options for the search API request.
    const searchOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`, // Include the Spotify API access token in the Authorization header.
        },
    };

    try {
        // Make a GET request to the Spotify API to search for albums based on the user-inputted string.
        const data = await (
            await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchString)}&type=album&limit=10`, searchOptions)
        ).json();

        return data; // Return the search results containing album information.
    } catch (error) {
        console.error('Error fetching access token:', error); // Log an error if fetching search results fails.
        throw error; // Propagate the error to the caller.
    }
};

/**
 * Processes the search result for albums.
 * @param {Object} result - The search result object containing albums data.
 * @returns {Array<Object>} - An array of processed album objects for the response.
 */
const processAlbumSearch = (result) => {
    const { albums: { items = [] } = {} } = result; // Destructure the albums' items from the search result with default value to prevent errors while iterating over an array.
    // Map and transform album data for the response.
    const rv = items.map(({ id, name, total_tracks, release_date, artists, images }) => {
        return {
            id,
            name,
            total_tracks,
            release_date: release_date.split('-')[0], // Extract only the year from the release date.
            artists: artists.map(artist => artist.name).join(', '), // Concatenate artist and features names.
            images: (images.length ? images[0].url : null), // Use the first (and only technically) image URL to display album cover, or null if no images are available.
        };
    });
    return rv;
}


/**
 * Fetches an album's tracks from the [Spotify API](https://developer.spotify.com/documentation/web-api/reference/get-an-albums-tracks).
 *
 *
 * @param {string} albumId - The unique identifier of the album.
 * @returns {Promise<Object>} - A promise that resolves to the album details, including tracks.
 * @throws {Error} - If there is an error fetching the album details.
 *
 * @description
 * This asynchronous function is responsible for making a GET request to the Spotify API to fetch details, including tracks, for a specified album. It uses the provided `albumId` as a unique identifier and includes the Spotify API access token in the request headers for authentication. The function returns a promise that resolves to the retrieved album details.
 */
const getAlbumDetails = async (albumId) => {
    // Options for the details API request. Get to retrieve data, auth token from global.
    const detailsOptions = {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    try {
        // Make a GET request (from detailOptions) to the Spotify API to retrieve album details.
        const data = await (
            await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, detailsOptions)).json();
        return data; // Return the retrieved album details as data.
    } catch (error) {
        console.error('Error fetching album details:', error);
    }
};

const saveReview = async (review) => {
    try {
        console.log('Review: ', review)
        await reviews.insert(review)
        return { saved: true }; // Return the retrieved album details as data.
    } catch (error) {
        return { saved: false };
    }
}
/**
 * Retrieves reviews for a given album and updates the review object with aggregated data.
 * @async
 * @param {string} albumId - The ID of the album for which reviews are to be retrieved.
 * @param {Object} rv - The review object to be updated.
 * @returns {Promise<Object>} The updated review object.
 */
const getAlbumReviews = async (albumId, rv) => {
    const docs = await reviews.find({ albumId: albumId })
    if (docs.length) {
        rv.reviewCount = docs.length
        docs.forEach(doc => {
            Object.keys(doc).forEach(song => {
                if (rv[song]) {
                    rv[song].lyrics += (doc[song].lyrics || 0) / docs.length
                    rv[song].vocals += (doc[song].vocals || 0) / docs.length
                    rv[song].instrumentals += (doc[song].instrumentals || 0) / docs.length
                    rv[song].meaning += (doc[song].meaning || 0) / docs.length
                    rv[song].personalOpinion += (doc[song].personalOpinion || 0) / docs.length
                } else {
                    console.log('Song not found', song)
                }
            })
        })
    }
    return rv;
};

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
    const userInput = request.body.searchString;    // Extract the user input from the request body.
    const result = await albumSearch(userInput);
    const rv = processAlbumSearch(result)
    // const { albums: { items = [] } = {} } = result; // Destructure the albums' items from the search result with default value to prevent errors while iterating over an array.
    // // Map and transform album data for the response.
    // const rv = items.map(({ id, name, total_tracks, release_date, artists, images }) => {
    //     return {
    //         id,
    //         name,
    //         total_tracks,
    //         release_date: release_date.split('-')[0], // Extract only the year from the release date.
    //         artists: artists.map(artist => artist.name).join(', '), // Concatenate artist and features names.
    //         images: (images.length ? images[0].url : null), // Use the first (and only technically) image URL to display album cover, or null if no images are available.
    //     };
    // });
    response.send(rv); // Send the transformed album data as a JSON response.
});


/*
This route handler is responsible for handling GET requests to the '/album/:id' endpoint.
It extracts the album ID from the request parameters and calls the asynchronous function `getAlbumDetails` to fetch an albums tracks.
The obtained album details are then sent as a JSON response to the client.
*/
app.get('/album/:id', async (request, response) => {
    const albumId = request.params.id;  // Extract the album ID from the request parameters.
    const albumDetails = await getAlbumDetails(albumId);
    response.send(albumDetails);
});

/*
This endpoint retrieves public reviews for a specific album identified by its ID. 
It first extracts the album ID from the request parameters, then fetches album details 
and initializes an object to store review ratings for different aspects of each item in the album. 
Finally, it sends the album reviews along with the initialized rating object as a response.
*/
app.get('/PublicReviews/:id', async (request, response) => {
    const albumId = request.params.id;  // Extract the album ID from the request parameters.
    const albumDetails = await getAlbumDetails(albumId);
    const rv = {}
    albumDetails.items.forEach(item => {
        const { id } = item
        const stars = {
            lyrics: 0,
            vocals: 0,
            instrumentals: 0,
            meaning: 0,
            personalOpinion: 0
        }
        rv[id] = stars;
    })
    response.send(await getAlbumReviews(albumId, rv));
})

/*
This endpoint receives a review object in the request body and saves it. 
It logs the received review for debugging purposes, then proceeds to save the review using the 'saveReview' function. 
After saving the review, it logs the result and sends it as a response.
*/
app.post('/saveReview', async (request, response) => {
    const review = request.body
    console.log('/saveReview/saveReview/saveReview/saveReview/saveReview', review)
    const result = await saveReview(review);
    console.log('result,result,result,result,result', result)
    response.send(result)
});

exports.processAlbumSearch = processAlbumSearch;
