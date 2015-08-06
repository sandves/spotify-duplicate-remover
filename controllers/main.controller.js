angular
.module('spoti_dup', ['spotify'])
.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('48e5a9cd2b0a481c940b2bf1c3ef9ee5');
  SpotifyProvider.setRedirectUri('file:///Users/stian/dev/angular/spotify-duplicate-remover/callback.html');
  SpotifyProvider.setScope('playlist-read-private playlist-modify-private playlist-modify-public');
})
.controller('MainController', ['$scope', 'Spotify', function ($scope, Spotify) {

  $scope.searchArtist = function () {
    Spotify.search($scope.searchartist, 'artist', {"limit": 50}).then(function (data) {
      $scope.artists = data.artists.items;
    });
  };

  $scope.login = function () {
    Spotify.login().then(function (data) {
      console.log(data);
      alert("You are now logged in");
    }, function () {
      console.log('didn\'t log in');
    });
  };

  $scope.appTitle = "Spotify Duplicate Remover";
  $scope.appHeadline = "Remove duplicate tracks from your Spotify playlists";
  $scope.saved = localStorage.getItem('todos');
  $scope.todos = (localStorage.getItem('todos')!==null) ? JSON.parse($scope.saved) : [ {text: 'Learn AngularJS', done: false}, {text: 'Build an Angular app', done: false} ];
  localStorage.setItem('todos', JSON.stringify($scope.todos));

  $scope.addTodo = function() {
    $scope.todos.push({
      text: $scope.todoText,
      done: false
    });
    $scope.todoText = ''; //clear the input after adding
    localStorage.setItem('todos', JSON.stringify($scope.todos));
  };

  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo){
      count+= todo.done ? 0 : 1;
    });
    return count;
  };

  $scope.archive = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo){
      if (!todo.done)
        $scope.todos.push(todo);
    });
    localStorage.setItem('todos', JSON.stringify($scope.todos));
  };

    // Gets an album
    Spotify.getAlbum('0sNOF9WDwhWunNAHPD3Baj').then(function (data){
      console.log('=================== Album - ID ===================');
      console.log(data);
    });
    // Works with Spotify uri too
    Spotify.getAlbum('spotify:album:0sNOF9WDwhWunNAHPD3Baj').then(function (data){
      console.log('=================== Album - Spotify URI ===================');
      console.log(data);
    });

    //Get multiple Albums
    Spotify.getAlbums('41MnTivkwTO3UUJ8DrqEJJ,6JWc4iAiJ9FjyK0B59ABb4,6UXCm6bOO4gFlDQZV5yL37').then(function (data) {
      console.log('=================== Albums - Ids ===================');
      console.log(data);
    });
    Spotify.getAlbums(['41MnTivkwTO3UUJ8DrqEJJ','6JWc4iAiJ9FjyK0B59ABb4','6UXCm6bOO4gFlDQZV5yL37']).then(function (data) {
      console.log('=================== Albums - Array ===================');
      console.log(data);
    });


    Spotify.getAlbumTracks('41MnTivkwTO3UUJ8DrqEJJ').then(function (data) {
      console.log('=================== Album Tracks - ID ===================');
      console.log(data);
    });
    Spotify.getAlbumTracks('spotify:album:41MnTivkwTO3UUJ8DrqEJJ').then(function (data) {
      console.log('=================== Album Tracks - Spotify URI ===================');
      console.log(data);
    });



    //Artist
    Spotify.getArtist('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist - Id ===================');
      console.log(data);
    });
    Spotify.getArtist('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist - Spotify URI ===================');
      console.log(data);
    });

    Spotify.getArtistAlbums('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist Albums - Id ===================');
      console.log(data);
    });

    Spotify.getArtistAlbums('spotify:artist:0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Artist Albums - Spotify URI ===================');
      console.log(data);
    });

    Spotify.getArtistTopTracks('0LcJLqbBmaGUft1e9Mm8HV', 'AU').then(function (data) {
      console.log('=================== Artist Top Tracks Australia ===================');
      console.log(data);
    });

    Spotify.getRelatedArtists('0LcJLqbBmaGUft1e9Mm8HV').then(function (data) {
      console.log('=================== Get Releated Artists ===================');
      console.log(data);
    });


    //Tracks
    Spotify.getTrack('0eGsygTp906u18L0Oimnem').then(function (data) {
      console.log('=================== Track ===================');
      console.log(data);
    });

    Spotify.getTracks('0eGsygTp906u18L0Oimnem,1lDWb6b6ieDQ2xT7ewTC3G').then(function (data) {
      console.log('=================== Tracks - String ===================');
      console.log(data);
    });

    Spotify.getTracks(['0eGsygTp906u18L0Oimnem','1lDWb6b6ieDQ2xT7ewTC3G']).then(function (data) {
      console.log('=================== Tracks - Array ===================');
      console.log(data);
    });

  }]);