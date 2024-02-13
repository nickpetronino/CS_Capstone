import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar';
import { Navbar, Container } from 'react-bootstrap';

function App() {
  return (
    <div className="App">
      <Navbar className="bg-body-tertiary">
        <Container className='App-nav'>
          <Navbar.Brand href="#home">
            <img
              src={logo}
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <SearchBar></SearchBar>
    </div>
  );
}

export default App;
