const request = require('supertest');
const { app, albumSearch, getToken, getAlbumDetails } = require('./server');

describe('GET /status tests', () => {
    it('responds with status 200', async () => {
        const response = await request(app).get('/status');
        expect(response.status).toBe(200);
    })
    it('responds with JSON containing the status message', async () => {
        const response = await request(app).get('/status');
        expect(response.body).toEqual({ "Status": "Running" });
    });
});

describe('getToken tests', () => {
    it('should fetch access token correctly', async () => {
        const response = await getToken();

        expect(response).toEqual(expect.objectContaining({
            access_token: expect.any(String),
            token_type: 'Bearer',
            expires_in: 3600
        }));
    });
});

describe('albumSearch tests ', () => {
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
    const searchString = ' ';
    const result = await albumSearch(searchString);
    expect(result).toBe("400 Bad request.");
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
        
        
        response.items.forEach(item => {
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
        expect(response).toBe("400 invalid id"); 
    });
});


describe('POST /search tests', () => {
    it('should return albums matching the search string from Spotify API', async () => {
        const searchString = 'parachutes';

        const res = await request(app)
            .post('/search')
            .send({ searchString });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined();
        expect(res.body.length).toBeGreaterThan(0);


        res.body.forEach(album => {
            expect(album).toHaveProperty('id');
            expect(album).toHaveProperty('name');
            expect(album).toHaveProperty('total_tracks');
            expect(album).toHaveProperty('release_date');
            expect(album).toHaveProperty('artists');
            expect(album).toHaveProperty('images');
        });
    });

    it('should still return closes match', async () => {
        const searchString = ' THERESINOALBUMWITHTHISNAMEANDIAMSIMPLYHOPINGTHATISTRUE'; 

        const res = await request(app)
            .post('/search')
            .send({ searchString });

        expect(res.status).toBe(200);
        expect(res.body).toBeDefined(); // Spotify will always return it "closest" matches.
    });
});

describe('GET /album/:id endpoint tests', () => {
    it('should return album details for a valid album ID', async () => {
        const validAlbumId = '6ZG5lRT77aJ3btmArcykra'; // Replace with a valid album ID

        const response = await request(app)
            .get(`/album/${validAlbumId}`);

        expect(response.status).toBe(200);
        expect(response.body).toBeDefined();
        // Add more assertions here to validate the structure and content of the response
    });
});