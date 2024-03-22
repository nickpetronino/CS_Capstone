import React from 'react';
import logo from './logo.svg';
import './App.css';
import SearchBar from './components/SearchBar';
import { Navbar, Container } from 'react-bootstrap';
import { Route, Routes } from 'react-router-dom';
import AlbumDetails from './components/AlbumDetails';
import AppContext  from './AppContext';
import { useState } from 'react';


function App() {
  const [albumList, setAlbumList] = useState()
  
  return (
    <div className="App">
      <AppContext.Provider value={{ albumList, setAlbumList }}>
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
        <Routes>
          <Route path='/' element={<SearchBar />} />
          <Route path='/album/:index' element={<AlbumDetails />} />
        </Routes>
      </AppContext.Provider>
    </div>
  );
}

export default App;
