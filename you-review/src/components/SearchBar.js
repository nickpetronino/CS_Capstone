import { useContext, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import AlbumList from "./AlbumList";
import AppContext from "../AppContext";

export default function SearchBar() {
  const {albumList, setAlbumList} = useContext(AppContext)
  const [searchString, setSearchString] = useState()
  console.log('Default')

  const search = async (e) => {
    e.preventDefault()
    console.log("Searching for blah");
    const request = { searchString }
    const result = await (await fetch('http://localhost:3001/search', {
        mode: 'cors',
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(request)
    })).json();
    console.log("Result: " , result)
    setAlbumList(result)
}
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