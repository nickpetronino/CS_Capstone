import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers like toBeInTheDocument
import SearchBar from '../SearchBar';
import App from '../../App'
import AppContext from '../../AppContext';
import userEvent from '@testing-library/user-event';

// global.fetch = jest.fn(() => {
//   return Promise.resolve({
//     json: () => Promise.resolve([])
//   })
// }
// )



const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};
// // Mocking useContext hook
// jest.mock('react', () => ({
//   ...jest.requireActual('react'),
//   useContext: jest.fn(),
// }));

// jest.mock("react-bootstrap", () => { 
//   // get the original boostrap library
//   const orgBootstrap = jest.requireActual("react-bootstrap"); 
//   // mock the Modal component
//   const mockThemeProvider = {
//     useBootstrapPrefix: (p1,p2) => p2
//   }
//   const mockContainer = ({ children }) => { return <div>{children}</div>; };
//   const mockRow = ({ children }) => { return <div>{children}</div>; }; 
//   const mockCol = ({ children }) => { return <div>{children}</div>; }; 
//   const mockForm = ({ children }) => { return <div>{children}</div>; }; 
//   const mockButton = ({ children }) => { return <div>{children}</div>; }; 

//   mockForm.Control = (props) => <div>{props.children}</div>;



//   // mock the sub-components of the Modal


//   // return your modified boostrap library instance with mocked Modal
//   const mockBoostrap = { __esModule: true, ...orgBootstrap, Container: mockContainer, Row: mockRow, Col: mockCol, Form: mockForm, Button: mockButton, ThemeProvider: mockThemeProvider}; 
//   return mockBoostrap; 
// });

describe('SearchBar Component', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  })
  test('renders without crashing', () => {
    const providerProps = {
      albumList: [],
      setAlbumList: jest.fn(),
    };
    renderWithContext(<SearchBar />, { providerProps });
  });
  test('test empty search', async () => {
    const providerProps = {
      albumList: [],
      setAlbumList: jest.fn(),
    };
    jest.spyOn(global, 'fetch').mockImplementationOnce(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve([])
    }))
    await act(async () => {
      renderWithContext(<SearchBar />, { providerProps })
    });
    // fetch.mockImplementationOnce(() => Promise.resolve({
    //   json: () => Promise.resolve([])
    // }))
    const button = screen.getByText('Search')
    expect(button).toBeInTheDocument();
    await act(async () => {
      userEvent.click(button)
    });
    expect(screen.getByText(/No results found!/i)).toBeInTheDocument()
  });

  // test('captures input correctly', () => {
  //   // Mock useContext to provide required context values
  //   const contextValue = {
  //     albumList: [],
  //     setAlbumList: jest.fn(),
  //   };
  //   React.useContext.mockReturnValue(contextValue);

  //   const { getByPlaceholderText } = render(<SearchBar />);
  //   const inputElement = getByPlaceholderText('Search');

  //   fireEvent.change(inputElement, { target: { value: 'test' } });
  //   expect(inputElement.value).toBe('test');
  // });

  // test('triggers search function correctly', async () => {
  //   // Mock useContext to provide required context values
  //   const contextValue = {
  //     albumList: [],
  //     setAlbumList: jest.fn(),
  //   };
  //   React.useContext.mockReturnValue(contextValue);

  //   const { getByPlaceholderText, getByText } = render(<SearchBar />);
  //   const inputElement = getByPlaceholderText('Search');
  //   const searchButton = getByText('Search');

  //   fireEvent.change(inputElement, { target: { value: 'test' } });
  //   fireEvent.click(searchButton);

  //   await waitFor(() => {
  //     expect(contextValue.setAlbumList).toHaveBeenCalled();
  //   });
  // });

  // test('displays album list after searching', async () => {
  //   // Mock useContext to provide required context values
  //   const contextValue = {
  //     albumList: [{ name: 'Album 1', artists: 'Artist 1', release_date: '2022-01-01', total_tracks: 10 }],
  //     setAlbumList: jest.fn(),
  //   };
  //   React.useContext.mockReturnValue(contextValue);

  //   const { getByText } = render(<SearchBar />);
  //   await waitFor(() => {
  //     expect(getByText('Album 1')).toBeInTheDocument();
  //     expect(getByText('Artist 1')).toBeInTheDocument();
  //     expect(getByText('Tracks: 10')).toBeInTheDocument();
  //   });
  // });
});
