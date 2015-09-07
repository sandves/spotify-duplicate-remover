# Spotidup

### Table of Contents

1. [Motivation](#motivation)
2. [About](#about)
3. [Todo](#todo)

## Motivation

The main motivation for this project was to learn more about modern web technologies such as HTML5, CSS3, and AngularJS. I knew nothing about Javascript before I started with AngularJS. I also wanted to develop something useful instead of just fiddling around. You can read more about the application in the next section.

## About

If you add a track to one of your Spotify playlists and the track already exists, you will get asked if you want to add it anyway. That is exactly how it should be. However, this feature was not implemented until recently, and earlier versions of Spotify did not have this functionality. That means that there is a great chance that the playlists you created before this feature was implemented, contains duplicate tracks.

Spotidup lets you log in to your Spotify account and inspect your playlists for duplicate tracks. If there are any, you can either choose to remove all, or remove them per-playlist basis. The instance of the track that was added to the playlist first will be kept, all other instances will be removed.

### Technologies

Spotidup utilizes [AngularJS](https://angularjs.org) together with the [Spotify Web API](https://developer.spotify.com/web-api/) to provide you with a fast and responsive SPA (Single Page Application) that interacts with your Spotify library. The UI is powered by [Bootstrap](http://getbootstrap.com) to give it a nice look and feel even on mobile devices.

## Todo

The code definitely needs refactoring as it is a mess right now.
