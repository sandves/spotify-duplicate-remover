var app = angular
.module('spoti_dup', ['spotify'])
.config(function (SpotifyProvider) {
  SpotifyProvider.setClientId('48e5a9cd2b0a481c940b2bf1c3ef9ee5');
  SpotifyProvider.setRedirectUri('http://localhost:63342/spotify-duplicate-remover/callback.html');
  SpotifyProvider.setScope('playlist-read-private playlist-modify-private playlist-modify-public');
})
.controller('MainController', ['$scope', '$http', '$q', 'Spotify', function ($scope, $http, $q, Spotify) {

  $scope.appTitle = "Spotify Duplicate Remover";
  $scope.appHeadline = "Remove duplicate tracks from your Spotify playlists";

  $scope.currentPage = 0;
  $scope.pageSize = 20;
  $scope.playlists = [];

  $scope.numberOfPages=function(){
      return Math.ceil($scope.playlists.length/$scope.pageSize);
  }

  $scope.searchArtist = function () {
    Spotify.search($scope.searchartist, 'artist', {"limit": 50}).then(function (data) {
      $scope.artists = data.artists.items;
    });
  };

  $scope.loggedIn = false;
  $scope.userName = "";
  $scope.token = "";
  $scope.currentUser = null;

  $scope.login = function () {
    Spotify.login().then(function (data) {
      console.log(data);
      $scope.loggedIn = true;
      $scope.token = data;
      $scope.getCurrentUser();
      $scope.$watch('currentUser', function(newValue, oldValue) {
        if (oldValue === null && newValue !== null) {
          $scope.userName = $scope.currentUser["display_name"];
          $scope.getUserOwnedPlaylists();
        }
      });
      //alert("You are now logged in");
    }, function () {
      console.log('didn\'t log in');
    });
  };

  $scope.setPlaylistTracks = function (playlist_id) {
      $scope.getPlaylistTracks(playlist_id).then(function (tracks) {
          $scope.tracks = tracks;
      });
  }

  $scope.getPlaylistTracks = function (playlist_id) {

    return $q(function (resolve, reject) {
        Spotify.getPlaylistTracks($scope.currentUser["id"], playlist_id).then(function(data) {
            console.log(data);

            var tracks = data.items;

            if(data.next != null) {
                console.log("More than one page");
                console.log(data.next);
                $http.get(data.next, {
                    headers: {'Authorization': "Bearer " + $scope.token}
                }).then(function(response) {
                    console.log(response.status);
                    console.log(response.data);
                    tracks.push.apply(tracks, response.data.items);
                }, function(response) {
                    console.log(response.data || "Request failed");
                    console.log(response.status);
                })
            }

            resolve(tracks);

        }, function(reason) {
            reject(reason);
        })
    });

  }

  $scope.getCurrentUser = function () {
    $http.get("https://api.spotify.com/v1/me", {
      headers: {'Authorization': "Bearer " + $scope.token}
    }).then(function(response) {
        $scope.currentUser = response.data;
        return response.data;
    }, function(response) {
      console.log(response.data || "Request failed");
      console.log(response.status);
  })};

  $scope.getUserOwnedPlaylists = function() {
    Spotify.getUserPlaylists($scope.currentUser["id"], {"limit": 50}).then(function (data){
      $scope.playlists = data.items.filter(function(playlist) {
        return playlist.owner.id === $scope.currentUser["id"];
      });
    });
  }

  $scope.fetchAllTracks = function (playlists) {
      playlists.forEach( function(p) {
         $scope.tracks[p.id] = $scope.getPlaylistTracks(p.id);
      });
  }

  $scope.deduplicate = function(playlistId) {

  }

  }]);

app.filter('startFrom', function() {
  return function(input, start) {
    start = +start; //parse to int
    return input.slice(start);
  }
});
