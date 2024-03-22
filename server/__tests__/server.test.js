const server = require('../server')

describe('"processAlbumSearch" related tests.', () => {
    test('Test Empty Search Result', () => {
        const result = {};
        expect(server.processAlbumSearch(result)).toStrictEqual([]);
    })
    test('Test Single Album Search Result', () => {
        const sampleInput = {
            albums: {
                "items": [
                    {
                        "total_tracks": 9,
                        "id": "2up3OPMp9Tb4dAKM2erWXQ",
                        "images": [
                            {
                                "url": "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228",
                            }
                        ],
                        "name": "testName",
                        "release_date": "1981-12",
                        "artists": [
                            {
                                "name": "John Lennon",
                            },
                            {
                                "name": "Paul McCartney",
                            },
                            {
                                "name": "George Harrison",
                            },
                            {
                                "name": "Ringo Starr",
                            }
                        ]
                    }
                ]
            }
        }
        const result = server.processAlbumSearch(sampleInput);
        expect(result.length).toStrictEqual(1)
        expect(result[0].id).toBe('2up3OPMp9Tb4dAKM2erWXQ');
        expect(result[0].name).toBe('testName');
        expect(result[0].total_tracks).toBe(9);
        expect(result[0].release_date).toBe('1981');
        expect(result[0].artists).toBe('John Lennon, Paul McCartney, George Harrison, Ringo Starr');
        expect(result[0].images).toBe('https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228');
    })
    test('Test No Valid Album Cover', () => {
        const sampleInput = {
            albums: {
                "items": [
                    {
                        "total_tracks": 9,
                        "id": "2up3OPMp9Tb4dAKM2erWXQ",
                        "images": [
                        ],
                        "name": "testName",
                        "release_date": "1981-12",
                        "artists": [
                            {
                                "name": "John Lennon",
                            },
                            {
                                "name": "Paul McCartney",
                            },
                            {
                                "name": "George Harrison",
                            },
                            {
                                "name": "Ringo Starr",
                            }
                        ]
                    }
                ]
            }
        }
        const result = server.processAlbumSearch(sampleInput);
        expect(result[0].images).toBe(null);
    })
    test('Test One Artist Only', () => {
        const sampleInput = {
            albums: {
                "items": [
                    {
                        "total_tracks": 9,
                        "id": "2up3OPMp9Tb4dAKM2erWXQ",
                        "images": [
                        ],
                        "name": "testName",
                        "release_date": "1981-12",
                        "artists": [
                            {
                                "name": "John Lennon",
                            }
                        ]
                    }
                ]
            }
        }
        const result = server.processAlbumSearch(sampleInput);
        expect(result[0].artists).toBe('John Lennon');
    })
})
