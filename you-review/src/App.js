import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar';
import { Navbar, Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar bg='dark' data-bs-theme='dark' className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">
            <img
              alt=""
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{' '}
            You Review
          </Navbar.Brand>
        </Container>
      </Navbar>
      <SearchBar></SearchBar>
    </div>
  );
}

export default App;
