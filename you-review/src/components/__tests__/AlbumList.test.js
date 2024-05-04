// import React from 'react';
// import { render, screen } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect'; // For additional matchers like toBeInTheDocument
// import { BrowserRouter as Router } from 'react-router-dom';
// import AlbumList from '../AlbumList';

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};

