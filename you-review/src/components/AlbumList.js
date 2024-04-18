import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import 'bootstrap/dist/css/bootstrap.min.css';

/**
 * AlbumList component displays a list of albums with basic information.
 * Each album item is clickable and navigates to the corresponding album details page.
 *
 * @component
 * @param {Array} props.albums - An array of album objects to be displayed.
 * @returns {JSX.Element} JSX.Element
 */
function AlbumList(props) {
    const { albums = [] } = props

    return (
        <ListGroup as='ol' numbered>
            {albums.map(album => <ListGroup.Item
                as="li"
                className="d-flex justify-content-between align-items-start"
            >
                <div className="ms-2 me-auto" align='left'>
                    <div className="fw-bold">{album.name}</div>
                    {album.artists}
                </div>
                <Badge bg="primary" pill>
                    Tracks: {album.total_tracks}
                </Badge>
            </ListGroup.Item>)}

            
        </ListGroup>
    )
}

export default AlbumList;