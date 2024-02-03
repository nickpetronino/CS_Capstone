# Music Reviewing App Design
A full architectural design following the **Entity-Relationship Model** will be here as a file once completed.

## General Schematic Summary

### Albums
An Album Entity these relationships, One to Many with Songs, One to Many with Reviews, Many to One with Artists (Initially, collaboration albums need be accounted for)

### Songs
Songs are related to albums, each song can only have one album.

### Artists
Artist have many albums attributed to them. Note: The songs are not directly attributed to the artist, only via albums can they be linked.

### Review
While tough to specify in text before actual implementation, a review should possess a one to one relationship with an album and a user. Users can create multiple reviews of an album but they are all distinct. 

### User
Users have reviews attributed to them in a Many to One relatioship with Reviews. User should not directly interact with artists or review artists, just albums.
