// Dependencies
const express = require('express');
const cors = require('cors');
const nedb = require('nedb-promises');
const fs = require('fs');

// Express app setup
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Global variables
const clientID = '61fb022f838c48d5bdf9a91490e6f320';
const clientSecret = '6eb233f414f947949a95297dc77c3c63';
let token; // Variable to store the Spotify API access token globally.

// Database setup
const reviews = new nedb({
	filename: './database/reviews.nedb',
	autoload: true
});

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
			grant_type: 'client_credentials'
		}),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			Authorization: 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64')
		}
	});
	const rv = await response.json();
	token = rv.access_token; //Sets Global Token
	return rv;
}
getToken(); // Invoke the function to fetch and set the Spotify API access token.

// Routes

// Endpoint to check server status
app.get('/status', (request, response) => {
	const status = {
		Status: 'Running'
	};
	response.send(status);
});

// Endpoint to search for albums
app.post('/search', async (request, response) => {
	const userInput = request.body.searchString; // Extract the user input from the request body.
	const result = await searchForAlbums(userInput);
	const rv = processAlbumSearch(result);
	response.send(rv); // Send the transformed album data as a JSON response.
});

// Endpoint to retrieve album details
app.get('/album/:id', async (request, response) => {
	const albumId = request.params.id; // Extract the album ID from the request parameters.
	const albumDetails = await getAlbumDetails(albumId);
	response.send(albumDetails);
});

// Endpoint to retrieve public reviews for an album
app.get('/PublicReviews/:id', async (request, response) => {
	const albumId = request.params.id; // Extract the album ID from the request parameters.
	const albumDetails = await getAlbumDetails(albumId);
	const rv = {};
	albumDetails.items.forEach((item) => {
		const { id } = item;
		const stars = {
			lyrics: 0,
			vocals: 0,
			instrumentals: 0,
			meaning: 0,
			personalOpinion: 0
		};
		rv[id] = stars;
	});
	console.log('PUBLIC REVIEWS', rv);
	response.send(await getAlbumReviews(albumId, rv));
});

// Endpoint to save a review
app.post('/saveReview', async (request, response) => {
	const review = request.body;
	const result = await saveReview(review, reviews);
	response.send(result);
});

// Start the server
app.listen(PORT, () => {
	console.log('Server Listening on PORT:', PORT);
});

// Functions

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
const searchForAlbums = async (searchString) => {
	const searchOptions = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
	const response = await fetch(
		`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchString)}&type=album&limit=10`,
		searchOptions
	);
	const data = await response.json();
	if (!response.ok) {
		return data.error.status + ' ' + data.error.message;
	}
	return data;
};

/**
 * Processes the search result for albums.
 * @param {Object} result - The search result object containing albums data.
 * @returns {Array<Object>} - An array of processed album objects for the response.
 */
const processAlbumSearch = (result) => {
	const { albums: { items } } = result;
	const rv = items.map(({ id, name, total_tracks, release_date, artists, images }) => {
		return {
			id,
			name,
			total_tracks,
			release_date: release_date.split('-')[0],
			artists: artists.map((artist) => artist.name).join(', '),
			images: images[0].url
		};
	});
	return rv;
};

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
	const detailsOptions = {
		method: 'GET',
		headers: {
			Authorization: `Bearer ${token}`
		}
	};
	const response = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks`, detailsOptions);
	const data = await response.json();
	if (!response.ok) {
		return data.error.status + ' ' + data.error.message;
	}
	return data;
};

/**
 * Retrieves reviews for a given album and updates the review object with aggregated data.
 * @async
 * @param {string} albumId - The ID of the album for which reviews are to be retrieved.
 * @param {Object} rv - The review object to be updated.
 * @returns {Promise<Object>} The updated review object.
 */
const getAlbumReviews = async (albumId, rv) => {
	const docs = await reviews.find({ albumId: albumId });
	if (docs.length) {
		rv.reviewCount = docs.length;
		docs.forEach((doc) => {
			Object.keys(doc).forEach((key) => {
				if (key !== '_id' && key !== 'albumId') {
					if (rv[key]) {
						rv[key].lyrics += doc[key].lyrics / docs.length;
						rv[key].vocals += doc[key].vocals / docs.length;
						rv[key].instrumentals += doc[key].instrumentals / docs.length;
						rv[key].meaning += doc[key].meaning / docs.length;
						rv[key].personalOpinion += doc[key].personalOpinion / docs.length;
					} else {
						console.log('Song not found', key);
					}
				}
			});
		});
	}
	return rv;
};

/**
 * Asynchronously saves a review to the database.
 *
 * @async
 * @param {Object} review - The review object to be saved. If the review object is null or empty, the function will return { saved: false }.
 * @param {Object} db - The database object where the review will be saved.
 * @returns {Promise<Object>} A promise that resolves to an object. The object has a 'saved' property that indicates whether the review was saved successfully. If saved, the 'review' property will contain the saved review.
 */
const saveReview = async (review, db) => {
	if (!review || Object.keys(review).length === 0) {
		return { saved: false };
	} else {
		await db.insert(review);
		return { saved: true, review };
	}
};


// Exported functions
exports.processAlbumSearch = processAlbumSearch;

module.exports = {
	app,
	getToken,
	searchForAlbums,
	getAlbumDetails,
	getAlbumReviews,
	saveReview
};
