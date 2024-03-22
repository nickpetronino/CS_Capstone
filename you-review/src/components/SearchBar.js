import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import AlbumList from "./AlbumList";
import AppContext from "../AppContext";

/**
 * React component representing a search bar for albums.
 * @component
 * @returns {JSX.Element} SearchBar component JSX
 */
const SearchBar = () => {
  const {albumList, setAlbumList} = useContext(AppContext);  // Access albumList and setAlbumList from AppContext using useContext hook
  const [searchString, setSearchString] = useState();  // Store search string state.
  const [noResults, setNoResults] = useState();

  // Handles the search functionality when the form is submitted.
  const search = async (e) => {
    e.preventDefault()
    const request = { searchString }; // Give the request object the search string
    const result = await (await fetch('http://localhost:3001/search', {
        mode: 'cors',
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(request)
    })).json();
    setAlbumList(result);  // Update the albumList state with the search results
    setNoResults(result.length ? false : true)
}

// Render the SearchBar component JSX
  return (
    <Container className="mt-5" style={{
      marginTop: "calc(50vh - 10px)"
    }}>
      <Row>
        <Col sm={10}>
          <Form className="d-flex" onSubmit={search}>
            <Form.Control
              onChange={ e => setSearchString(e.target.value)}
              id="search-string"
              type="search"
              placeholder="Search"
              className="me-2 rounded-pill"
              aria-label="Search"
            />
            <Button type="submit" className="rounded-pill" variant="outline-primary">
              Search
            </Button>
          </Form>
        </Col>
      </Row>
      <AlbumList 
        albums={albumList} 
        noResults={noResults}>
      </AlbumList>
    </Container>
  );
}
export default SearchBar