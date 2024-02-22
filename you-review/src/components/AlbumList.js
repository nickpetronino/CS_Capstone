import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';

/**
 * AlbumList component displays a list of albums with basic information.
 * Each album item is clickable and navigates to the corresponding album details page.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {Array} props.albums - An array of album objects to be displayed.
 * @returns {JSX.Element} JSX.Element
 */
export default function AlbumList(props) {
    const { albums = [] } = props;

    return (
        <ListGroup as="ol">
            {albums.map((album, index) => (
                <ListGroup.Item
                    as="li"
                    className="d-flex justify-content-between align-items-start"
                >
                    <Link to={`album/${index}`}>
                    <img src={album.images} height='100px' width='100px'/>
                    </Link>
                    <div className="ms-2 me-auto" align="left">
                        <div className="fw-bold">{album.name}</div>
                        <div className="fw-normal"> {album.artists} </div>
                        <div className="fw-light"> {album.release_date} </div>
                    </div>
                    <Badge bg="primary" pill>
                        Tracks: {album.total_tracks}
                    </Badge>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
}

////<Link to={`/album/${album.id}`} key={album.id} style={{ textDecoration: 'none' }}>
