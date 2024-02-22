import React, { useEffect, useState, useContext } from 'react';
import { Table } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AppContext from '../AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';


const AlbumDetails = () => {
    const { index } = useParams()
    const {albumList, setAlbumList} = useContext(AppContext)
    const [albumDetails, setAlbumDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const album = albumList[index]
    console.log("Album List = " , albumList)
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
                    return { name, duration, artists: artistList }
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

    return (
        <div>
            <h1> <img src={album.images} height='250px' width='250px' /> &nbsp; Album: {album.name}</h1>
            
            <Table striped bordered hover style={{
                marginLeft: 100,
                paddingRight: 100
                }}>
                <thead>
                    <tr>
                        <th scope='col' className='text-start'>Name</th>
                        <th scope='col'>Duration</th>
                        <th scope='col' className='text-start'>Artist(s)</th>
                    </tr>
                </thead>
                {albumDetails.map(track => {
                    return (
                        <tr>
                            <td className='text-start'>
                                {track.name}
                            </td>
                            <td>
                                {track.duration}
                            </td>
                            <td className='text-start'>
                                {track.artists}
                            </td>
                        </tr>
                    )
                }
                )}
            </Table>
        </div>
    );
};

export default AlbumDetails;
