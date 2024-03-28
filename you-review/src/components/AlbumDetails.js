import React, { useEffect, useState, useContext } from 'react';
import { Table, Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ReactStars from 'react-rating-star-with-type'
import AppContext from '../AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * Functional component for displaying album details and managing reviews.
 * 
 * @component
 * @returns {JSX.Element} JSX element representing the AlbumDetails component.
 */
const AlbumDetails = () => {
    const { index } = useParams()
    const { albumList, setAlbumList } = useContext(AppContext)
    const [albumDetails, setAlbumDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [inEditMode, setEditMode] = useState(false)
    const [review, setReview] = useState({})
    const album = albumList[index]
    console.log("Album List = ", albumList)
    useEffect(() => {
        /**
         * Fetches album details from the backend API.
         */
        const fetchAlbumDetails = async () => {
            try {
                const response = await fetch(`http://localhost:3001/album/${albumList[index].id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                const { items = [] } = data
                console.log("Item:", items)
                const albumData = items.map(item => {
                    const { name, id, duration_ms, artists = [] } = item
                    const artistList = artists.map(artist => artist.name).join(', ')
                    const d = new Date(duration_ms)
                    const duration = `${d.getMinutes()}:${String(d.getSeconds()).padStart(2, '0')}`
                    const truncatedName = name.length > 30 ? name.slice(0, 30) + '...' : name;
                    return { name: truncatedName, id, duration, artists: artistList };
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

    useEffect(() => {
        /**
         * 
         */
        const fetchPublicReviews = async () => {
            try {
                const response = await fetch(`http://localhost:3001/PublicReviews/${albumList[index].id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const review = await response.json();
                console.log("%%%%%%%%%%%%%%%% REVIEW %%%%%%%%%%%%%%%%%:", review)
                setReview(review);
            } catch (error) {
                console.error('Error fetching reviews', error);
                setError('Failed to fetch album details. Please try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchPublicReviews();
    }, [albumDetails]);


    /**
     * Handles the change event for updating a specific field in the album details.
     * 
     * @param {number} index - The index of the album details to be updated.
     * @param {string} field - The field within the album details object to be updated.
     * @param {Function} A function that accepts the new value for the specified field.
     */
    const onChange = (songId, field) => value => {
        console.log("Review", review)
        review[songId][field] = value
        setReview({ ...review })
    }

    /**
     * Toggles the review mode for the current album.
     * @returns {Promise<void>} - A promise that resolves once the review mode is toggled.
     */
    const toggleReviewMode = async () => {
        const review = { albumId: albumList[index].id }
        albumDetails.map(song => {
            const { id } = song
            const stars = {
                lyrics: 0.5 + Math.random() * 4.5,
                vocals: 0.5 + Math.random() * 4.5,
                instrumentals: 0.5 + Math.random() * 4.5,
                meaning: 0.5 + Math.random() * 4.5,
                personalOpinion: 0.5 + Math.random() * 4.5
            }
            // Assign stars object to the review object using the song ID as key.
            review[id] = stars
        })
        const result = await (await fetch('http://localhost:3001/saveReview', {
            mode: 'cors',
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(review)
        })).json();
        // Update the state of album details.
        setAlbumDetails([...albumDetails])
    }

    return (
        <div>
            <div style={{ position: 'absolute', top: 10, right: '17.33%' }}>
                <Button type="button" id="toggleButton" onClick={toggleReviewMode}>Create Review</Button>
            </div>
            <div style={{ margin: '0 auto', width: '83%', paddingLeft: '8.33%', paddingRight: '8.33%' }}>
                <div style={{ paddingLeft: '1%', paddingTop: '1%', paddingBottom: '1%', display: 'flex', alignItems: 'center' }}>
                    <img src={album.images} height='250px' width='250px' />
                    <h1 style={{ marginLeft: '20px' }}>Album: {album.name}</h1>
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
                                        onChange={onChange(track.id, 'lyrics')}
                                        value={review[track.id]?.lyrics}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td >
                                    <ReactStars
                                        onChange={onChange(track.id, 'vocals')}
                                        value={review[track.id]?.vocals}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td >
                                    <ReactStars
                                        onChange={onChange(track.id, 'instrumentals')}
                                        value={review[track.id]?.instrumentals}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td >
                                    <ReactStars
                                        onChange={onChange(track.id, 'meaning')}
                                        value={review[track.id]?.meaning}
                                        isEdit={true}
                                        isHalf={true}
                                    />
                                </td>
                                <td>
                                    <ReactStars
                                        onChange={onChange(track.id, 'personalOpinion')}
                                        value={review[track.id]?.personalOpinion}
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
