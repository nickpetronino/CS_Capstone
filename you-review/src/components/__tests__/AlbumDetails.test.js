// import React from 'react';
// import { render, waitFor } from '@testing-library/react';
// import '@testing-library/jest-dom/extend-expect';
// import AlbumDetails from '../AlbumDetails';

const renderWithContext = (ui, { providerProps, ...renderOptions }) => {
  return render(
    <AppContext.Provider value={providerProps}>{ui}</AppContext.Provider>,
    renderOptions
  );
};

