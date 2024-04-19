import React, { useEffect, useState, useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-star-with-type'
import AppContext from '../AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';


const AlbumDetails = () => {
    const { index } = useParams()
    const { albumList, setAlbumList } = useContext(AppContext)
    const [albumDetails, setAlbumDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const album = albumList[index]
    console.log("Album List = ", albumList)
    useEffect(() => {
        const fetchAlbumDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/album/${albumList[index].id}`);
                console.log()
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const { items = [] } = data
                console.log("Item:", items)
                const albumData = items.map(item => {
                    const { name, duration_ms, artists = [] } = item
                    const artistList = artists.map(artist => artist.name).join(', ')
                    const d = new Date(duration_ms)
                    const duration = `${d.getMinutes()}:${String(d.getSeconds()).padStart(2, '0')}`
                    const truncatedName = name.length > 30 ? name.slice(0, 30) + '...' : name;
                    const stars = {
                        lyrics: 0.5 + Math.random() * 4.5,
                        vocals: 0.5 + Math.random() * 4.5,
                        instrumentals: 0.5 + Math.random() * 4.5,
                        meaning: 0.5 + Math.random() * 4.5,
                        personalOpinion: 0.5 + Math.random() * 4.5
                    }
                    return { name: truncatedName, duration, artists: artistList, stars };
                })
                setAlbumDetails(albumData);
            } catch (error) {
                console.error('Error fetching album details:', error);
                setError('Failed to fetch album details. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchAlbumDetails();
    }, [index]);

    const onChange = (index, field) => value => {
        const newAlbumDetails = [...albumDetails] // Make a shallow copy of albumDetails. 
        console.log("new Album Details:" , newAlbumDetails, index, field)
        newAlbumDetails[index].stars[field] = value
        setAlbumDetails(newAlbumDetails)
    }

    return (
        <div>
            <div style={{ position: 'absolute', top: 10, right: '17.33%' }}>
                <Button variant="primary">Create Review</Button>
            </div>
            <div style={{ margin: '0 auto', width: '83%', paddingLeft: '8.33%', paddingRight: '8.33%' }}>
                <div style={{ paddingLeft: '1%', paddingTop: '1%', paddingBottom: '1%', display: 'flex', alignItems: 'center' }}>
                    <img src={album.images} height='250px' width='250px' />
                    <h1 style={{ marginLeft: '20px' }}>{album.name}</h1>
                </div>
            </div>

            <div style={{ margin: '0 auto', width: '83%', paddingLeft: '8.33%', paddingRight: '8.33%' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th scope='col' className='text-start'>Name</th>
                            <th scope='col'>Lyrics</th>
                            <th scope='col'>Vocals</th>
                            <th scope='col'>Instrumentals</th>
                            <th scope='col'>Meaning</th>
                            <th scope='col'>Personal Opinion</th>
                            <th scope='col'>Duration</th>
                            <th scope='col' className='text-start'>Artist(s)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {albumDetails.map((track, index) => (
                            <tr key={index}>
                                <td className='text-start'>{track.name}</td>
                                <td>
                                    <ReactStars
                                        onChange={onChange(index, 'lyrics')}
                                        value={track.stars.lyrics}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td >
                                    <ReactStars
                                        onChange={onChange(index, 'vocals')}
                                        value={track.stars.vocals}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td >
                                    <ReactStars
                                        onChange={onChange(index, 'instrumentals')}
                                        value={track.stars.instrumentals}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td >
                                    <ReactStars
                                        onChange={onChange(index, 'meaning')}
                                        value={track.stars.meaning}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td>
                                    <ReactStars
                                        onChange={onChange(index, 'personalOpinion')}
                                        value={track.stars.personalOpinion}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td>{track.duration}</td>
                                <td className='text-start'>{track.artists}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
        </div>
    );
};

export default AlbumDetails;
