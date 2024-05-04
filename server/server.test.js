const request = require('supertest');
const nedb = require('nedb-promises');
const { app, searchForAlbums, getToken, getAlbumDetails, getAlbumReviews, saveReview } = require('./server');

describe('GET /status tests', () => {
	it('responds with status 200', async () => {
		const response = await request(app).get('/status');
		expect(response.status).toBe(200);
	});
	it('responds with JSON containing the status message', async () => {
		const response = await request(app).get('/status');
		expect(response.body).toEqual({ Status: 'Running' });
	});
});

describe('getToken tests', () => {
	it('should fetch access token correctly', async () => {
		const response = await getToken();

		expect(response).toEqual(
			expect.objectContaining({
				access_token: expect.any(String),
				token_type: 'Bearer',
				expires_in: 3600
			})
		);
	});
});

describe('searchForAlbums testing', () => {
	describe('Search Result Structure', () => {
		it('should return albums matching the search string with proper structure', async () => {
			const searchString = 'parachutes';
			const result = await searchForAlbums(searchString);
			expect(result).toHaveProperty('albums');
			expect(result.albums).toHaveProperty('items');
			expect(Array.isArray(result.albums.items)).toBe(true);
			expect(result.albums.items.length).toBeGreaterThan(0);
		});

		it('should handle errors gracefully', async () => {
			const invalidAlbumId = 'invalidAlbumId';
			const response = await getAlbumDetails(invalidAlbumId);
			expect(response).toBeDefined();
			expect(response).toBe('400 invalid id');
		});
	});

	describe('Empty Search String', () => {
		it('should return `no search query` message', async () => {
			const searchString = '';
			const result = await searchForAlbums(searchString);
			expect(result).toBe('400 No search query');
		});
	});

	describe('Album Details', () => {
		it('should return albums with correct details', async () => {
			const searchString = 'parachutes';
			const result = await searchForAlbums(searchString);
			const firstAlbum = result.albums.items[0];

			expect(firstAlbum).toHaveProperty('id');
			expect(firstAlbum).toHaveProperty('name');
			expect(firstAlbum).toHaveProperty('total_tracks');
			expect(firstAlbum.id).toBe('6ZG5lRT77aJ3btmArcykra');
			expect(firstAlbum.name).toBe('Parachutes');
			expect(firstAlbum.total_tracks).toBe(10);
		});
	});

	describe('Album Artists', () => {
		it('should return albums with correct artist information', async () => {
			const searchString = 'parachutes';
			const result = await searchForAlbums(searchString);
			const firstAlbum = result.albums.items[0];

			expect(firstAlbum).toHaveProperty('artists');
			expect(Array.isArray(firstAlbum.artists)).toBe(true);
			expect(firstAlbum.artists.length).toBeGreaterThan(0);
			expect(firstAlbum.artists[0]).toHaveProperty('name');
			expect(firstAlbum.artists[0].name).toBe('Coldplay');
		});

		it('should handle albums with multiple artists properly', async () => {
			const searchString = 'what a time to be alive';
			const result = await searchForAlbums(searchString);
			const firstAlbum = result.albums.items[0];

			expect(firstAlbum).toHaveProperty('artists');
			expect(Array.isArray(firstAlbum.artists)).toBe(true);
			expect(firstAlbum.artists.length).toBeGreaterThan(0);
			expect(firstAlbum.artists[0]).toHaveProperty('name');
			expect(firstAlbum.artists[0].name).toBe('Drake');
			expect(firstAlbum.artists[1].name).toBe('Future');
		});
	});
});

describe('getAlbumDetails tests', () => {
	it('should fetch album details successfully', async () => {
		const albumId = '6ZG5lRT77aJ3btmArcykra';

		const response = await getAlbumDetails(albumId);

		expect(response).toBeDefined();
		expect(response.error).toBeUndefined();

		expect(response).toHaveProperty('href');
		expect(response).toHaveProperty('items');
		expect(Array.isArray(response.items)).toBe(true);
		expect(response).toHaveProperty('total');
		expect(response.total).toBe(10);

		response.items.forEach((item) => {
			expect(item).toHaveProperty('artists');
			expect(Array.isArray(item.artists)).toBe(true);
			expect(item).toHaveProperty('duration_ms');
			expect(typeof item.duration_ms).toBe('number');
			expect(item).toHaveProperty('name');
		});
	});

	it('should handle errors gracefully', async () => {
		const invalidAlbumId = 'invalidAlbumId';

		const response = await getAlbumDetails(invalidAlbumId);

		expect(response).toBeDefined();
		expect(response).toBe('400 invalid id');
	});
});

describe('POST /search tests', () => {
	describe('Normal Case', () => {
		it('should return albums matching the search string from Spotify API', async () => {
			const searchString = 'parachutes';

			const res = await request(app).post('/search').send({ searchString });

			expect(res.status).toBe(200);
			expect(res.body).toBeDefined();
			expect(res.body.length).toBeGreaterThan(0);

			res.body.forEach((album) => {
				expect(album).toHaveProperty('id');
				expect(album).toHaveProperty('name');
				expect(album).toHaveProperty('total_tracks');
				expect(album).toHaveProperty('release_date');
				expect(album).toHaveProperty('artists');
				expect(album).toHaveProperty('images');
			});
		});
	});

	describe('release_date tests', () => {
		it('should shorten release date to just the year', async () => {
			const searchString = 'parachutes';
			const res = await request(app).post('/search').send({ searchString });
			expect(res.body[0].release_date).toBe('2000');
		});
	});

	describe('artists tests', () => {
		it('should NOT comma separate albums with a single artists (possible trailing comma)', async () => {
			const searchString = 'parachutes';
			const res = await request(app).post('/search').send({ searchString });
			expect(res.body[0].artists).toBe('Coldplay');
		});

		it('should comma separate albums with multiple artists', async () => {
			const searchString = 'What A Time to Be Alive';
			const res = await request(app).post('/search').send({ searchString });
			expect(res.body[0].artists).toBe('Drake, Future');
		});
	});

	describe('image tests', () => {
		it('should check that the image url is of a valid format', async () => {
			const searchString = 'parachutes';
			const res = await request(app).post('/search').send({ searchString });
			expect(res.body[0].images).toBeDefined();
		});
	});

	describe('Error Case', () => {
		it('should still return closest match', async () => {
			const searchString = ' THERESINOALBUMWITHTHISNAMEANDIAMSIMPLYHOPINGTHATISTRUE';
			const res = await request(app).post('/search').send({ searchString });
			expect(res.status).toBe(200);
			expect(res.body).toBeDefined(); // Spotify will always return it "closest" matches.
		});
	});
});

describe('GET /album/:id endpoint tests', () => {
	it('should return album details for a valid album ID', async () => {
		const validAlbumId = '6ZG5lRT77aJ3btmArcykra';

		const response = await request(app).get(`/album/${validAlbumId}`);

		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
	});
});

describe('saveReview function', () => {
	const normal_review = {
		albumId: '6ZG5lRT77aJ3btmArcykra',
		'2QhURnm7mQDxBb5jWkbDug': {
			lyics: 0,
			vocals: 3.5,
			instrumentals: 3,
			meaning: 3,
			personalOpinion: 2.5,
			lyrics: 5
		},
		'0qksx8mV28lztYIZ1om8ml': {
			lyics: 0,
			vocals: 4.5,
			instrumentals: 4,
			meaning: 3.5,
			personalOpinion: 3.5,
			lyrics: 3
		},
		'2mLgOcRkEgq89j8WstUpui': {
			lyics: 0,
			vocals: 4,
			instrumentals: 3.5,
			meaning: 3.5,
			personalOpinion: 2.5,
			lyrics: 3.5
		},
		'7D0RhFcb3CrfPuTJ0obrod': {
			lyics: 0,
			vocals: 3.5,
			instrumentals: 3,
			meaning: 3.5,
			personalOpinion: 4,
			lyrics: 2.5
		},
		'3AJwUDP919kvQ9QcozQPxg': {
			lyics: 0,
			vocals: 4.5,
			instrumentals: 4.5,
			meaning: 5,
			personalOpinion: 5,
			lyrics: 4.5
		},
		'0R8P9KfGJCDULmlEoBagcO': {
			lyics: 0,
			vocals: 3.5,
			instrumentals: 3,
			meaning: 3.5,
			personalOpinion: 3.5,
			lyrics: 3.5
		},
		'4qzoHxgp42ylb18ga1SWTL': {
			lyics: 0,
			vocals: 3.5,
			instrumentals: 4.5,
			meaning: 3.5,
			personalOpinion: 2.5,
			lyrics: 2.5
		},
		'2DHgvPQD1jApRnT1DBZdrS': {
			lyics: 0,
			vocals: 2.5,
			instrumentals: 3.5,
			meaning: 4,
			personalOpinion: 4,
			lyrics: 3.5
		},
		'5TB6QgrF0RPIxSCGfRDLoe': {
			lyics: 0,
			vocals: 3.5,
			instrumentals: 3.5,
			meaning: 3.5,
			personalOpinion: 3.5,
			lyrics: 3
		},
		'1RNtm45kw0hPMBz7gKiIYu': {
			lyics: 0,
			vocals: 4,
			instrumentals: 3.5,
			meaning: 3.5,
			personalOpinion: 2.5,
			lyrics: 4
		}
	};
	const blank_review = {};
	it('should save a typical (~ 10 songs) review successfully', async () => {
		const response = await request(app).post('/saveReview').send(normal_review).expect(200);
		expect(response.body.review).toEqual(normal_review);
		expect(response.body.saved).toEqual(true);
	});

	it('should not save an empty review', async () => {
		const response = await request(app).post('/saveReview').send(blank_review).expect(200);
		expect(response.body.saved).toEqual(false);
	});
});

describe('GET /PublicReviews/:id endpoint tests', () => {
	it('should return aggregated album reviews for a valid album ID', async () => {
		const albumId = '6ZG5lRT77aJ3btmArcykra';
		const albumDetails = await getAlbumDetails(albumId);
		const mockReviews = await getAlbumReviews(albumId, albumDetails);
		const response = await request(app).get(`/PublicReviews/${albumId}`);
		expect(response.status).toBe(200);
		expect(response.body).toBeDefined();
		albumDetails.items.forEach((item) => {
			const trackId = item.id;
			expect(response.body).toHaveProperty(trackId);
			const receivedValues = response.body[trackId];
			for (const value of Object.values(receivedValues)) {
				expect(typeof value).toBe('number');
			}
		});
	});
});

describe('getAlbumReviews function', () => {
	it('should aggregate reviews for a valid album ID', async () => {
		const validAlbumId = 'sampleAlbumId';
		const initialReviewObject = {
			'2QhURnm7mQDxBb5jWkbDug': {
				lyrics: 0,
				vocals: 0,
				instrumentals: 0,
				meaning: 0,
				personalOpinion: 0
			},
			'0qksx8mV28lztYIZ1om8ml': {
				lyrics: 0,
				vocals: 0,
				instrumentals: 0,
				meaning: 0,
				personalOpinion: 0
			},
			'2mLgOcRkEgq89j8WstUpui': {
				lyrics: 0,
				vocals: 0,
				instrumentals: 0,
				meaning: 0,
				personalOpinion: 0
			}
		};
		const response = await getAlbumReviews(validAlbumId, initialReviewObject);
		expect(response).toEqual({
			'2QhURnm7mQDxBb5jWkbDug': {
				lyrics: expect.any(Number),
				vocals: expect.any(Number),
				instrumentals: expect.any(Number),
				meaning: expect.any(Number),
				personalOpinion: expect.any(Number)
			},
			'0qksx8mV28lztYIZ1om8ml': {
				lyrics: expect.any(Number),
				vocals: expect.any(Number),
				instrumentals: expect.any(Number),
				meaning: expect.any(Number),
				personalOpinion: expect.any(Number)
			},
			'2mLgOcRkEgq89j8WstUpui': {
				lyrics: expect.any(Number),
				vocals: expect.any(Number),
				instrumentals: expect.any(Number),
				meaning: expect.any(Number),
				personalOpinion: expect.any(Number)
			}
		});
	});
});
