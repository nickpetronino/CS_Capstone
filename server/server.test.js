const request = require('supertest');
const { app, albumSearch, getToken } = require('./server'); // Adjust the path as needed

describe('GET /status', () => {

    it('responds with status 200', async () => {
        const response = await request(app).get('/status');
        expect(response.status).toBe(200);
    });

    it('responds with JSON containing the status message', async () => {
        const response = await request(app).get('/status');
        expect(response.body).toEqual({ "Status": "Running" });
    });

});

describe('getToken', () => {
    it('should fetch access token correctly', async () => {
        // Call the actual getToken function which makes a real API call
        const response = await getToken();

        // Verify that the response is an object with the expected properties
        expect(response).toEqual(expect.objectContaining({
            access_token: expect.any(String),
            token_type: 'Bearer',
            expires_in: 3600
        }));
    });
});

describe('Album Search tests', () => {
  it('should return albums matching the search string', async () => {
    const searchString = 'parachutes';
    const result = await albumSearch(searchString);
    expect(result).toHaveProperty('albums');
    expect(result.albums).toHaveProperty('href');
    expect(result.albums).toHaveProperty('items');
    expect(result.albums).toHaveProperty('limit');
    expect(result.albums).toHaveProperty('next');
    expect(result.albums).toHaveProperty('offset');
    expect(result.albums).toHaveProperty('previous');
    expect(result.albums).toHaveProperty('total');
    expect(Array.isArray(result.albums.items)).toBe(true);
    expect(result.albums.items.length).toBeGreaterThan(0);
    expect(result.albums.items[0]).toHaveProperty('id');
    expect(result.albums.items[0]).toHaveProperty('name');
    expect(result.albums.items[0]).toHaveProperty('total_tracks');
    expect(result.albums.items[0]).toHaveProperty('artists');
    expect(Array.isArray(result.albums.items[0].artists)).toBe(true);
    expect(result.albums.items[0].artists.length).toBeGreaterThan(0);
    expect(result.albums.items[0].artists[0]).toHaveProperty('name');
  });

  it('should handle a single space', async () => {
    const searchString = ' '; // Single space which may cause an error
    const result = await albumSearch(searchString);
    expect(result).toBe("400 Bad request.");
  });
});

describe('POST /search', () => {
    it('should return albums matching the search string from Spotify API', async () => {
        // Define the search string
        const searchString = 'parachutes';

        // Send a mock request to the /search route
        const res = await request(app)
            .post('/search')
            .send({ searchString });

        // Expect the response to have a status of 200
        expect(res.status).toBe(200);

        // Validate the structure and content of the response body
        expect(res.body).toBeDefined();
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0]).toHaveProperty('id');
        expect(res.body[0]).toHaveProperty('name');
        expect(res.body[0]).toHaveProperty('total_tracks');
        expect(res.body[0]).toHaveProperty('artists');
        // Add more specific assertions as needed based on the structure of the response
    });
});
