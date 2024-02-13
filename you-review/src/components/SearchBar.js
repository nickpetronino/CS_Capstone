import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";

export default function SearchBar() {
  const [searchString, setSearchString] = useState()

  const search = async () => {
    const request = { searchString }
    const result = await (await fetch('http://localhost:3001/search', {
        mode: 'cors',
        method: 'post',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify(request)
    })).json();
    console.log("Result: " , result)
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
    </Container>
  );
}