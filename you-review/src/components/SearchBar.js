import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import AlbumList from "./AlbumList";
import AppContext from "../AppContext";

/**
 * React component representing a search bar for albums.
 * @component
 * @returns {JSX.Element} SearchBar component JSX
 */
export default function SearchBar() {
  const {albumList, setAlbumList} = useContext(AppContext);  // Access albumList and setAlbumList from AppContext using useContext hook
  const [searchString, setSearchString] = useState();  // Store search string state.
  console.log('Default')

  // Handles the search functionality when the form is submitted.
  const search = async (e) => {
    e.preventDefault()
    console.log("Searching for blah");
    const request = { searchString }; // Give the request object the search string
    const result = await (await fetch('http://localhost:3001/search', {
        mode: 'cors',
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(request)
    })).json();
    console.log("Result: " , result)
    setAlbumList(result);  // Update the albumList state with the search results
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
      <AlbumList albums={albumList}></AlbumList>
    </Container>
  );
}