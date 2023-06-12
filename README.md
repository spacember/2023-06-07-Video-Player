

# Video Player

This script goal is to set autoplay to true if a videoPlayer entry has a background image. For testing, a list of videoPlayer entries must be created from a given JSON file.

### This script does the following actions in order:

1. Gets the environment.
2. Gets the entries (in the current locale).
3. Creates the entries.
4. Updates field autoplay, accordingly.

### To run this script

1. cd into 2023-06-07-Video-Player
2. Run node index.js.

### config.json

1. accessToken - contentful access token (Generate your own accessToken).
2. space - contentful space information for targeted market.
3. spaceId - contentful spaceId for required market
4. environmentId: contentful environmentId for required market
5. locale - contentful local for required market (To find the local, click on Settings -> locales. You should see a default locale.)
6. contentType: required contentType = videoPlayer
