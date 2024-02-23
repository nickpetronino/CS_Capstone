# You Review Top Level Design

## TL;DR

This is a client-server application for searching and reviewing albums. The user inputs their search queries through a client interface search. The client then sends these queries to a server. The server communicates with the Spotify API to execute the searches. The server receives the API's responses and relays the relevant information back to the client. This architecture allows users tosearch for albums on Spotify without the need for direct interaction with the Spotify API, making the process more user-friendly and centralized.

## Components

### 1. Frontend

- **User Interface (UI):** Provides a user-friendly interface for users to input search terms, view album details, and explore songs.

- **User Input Handling:** Takes user input, performs necessary validations, and triggers requests to the backend.

- **Album Details Component:** Displays detailed information about a selected album, including the list of songs.

- **Song Review Component:** Allows users to review and rate individual songs based on specific criteria.

### 2. Backend

- **Express Server:** Serves as the backend for the application.

- **Spotify API Wrapper:** Handles communication with the Spotify API, including obtaining access tokens and making requests for album and song information.

- **Authentication Module:** Manages user authentication with Spotify and ensures the presence of valid access tokens.

- **Search and Album Details Endpoints:** Handles user requests for searching albums and retrieving album details.

- **Song Details Endpoint:** Retrieves detailed information about individual songs within an album.

- **User Review Endpoint:** Manages user reviews and ratings for songs.

### 3. Spotify API

- **Search Endpoint:** Accepts requests for searching albums based on user input.

- **Album Details Endpoint:** Provides detailed information about a specific album, including the list of songs.

- **Song Details Endpoint:** Offers detailed information about a specific song, including metadata and audio features.

## Workflow

1. **User Interaction:**
   - User interacts with the frontend UI, providing search terms, selecting an album, and exploring songs.

2. **Frontend Handling:**
   - Frontend validates user input.
   - Sends requests to the backend for album details and song information.

3. **Backend Processing:**
   - Backend authenticates the request with the Spotify API.
   - Sends requests to the Spotify API for album details and song information.

4. **Spotify API Interaction:**
   - Spotify API processes the requests and returns album and song details.

5. **Backend Response:**
   - Backend processes the Spotify API response.
   - Sends the relevant data back to the frontend.

6. **Frontend Presentation:**
   - Frontend displays the album details, including the list of songs.
   - Allows users to explore and select individual songs.

7. **User Reviews:**
   - Frontend provides the option for users to review and rate individual songs.

8. **Backend Review Processing:**
   - Backend handles user reviews and ratings.
   - Stores review data securely.

9. **Review Presentation:**
   - Frontend displays user reviews and ratings for each song.

