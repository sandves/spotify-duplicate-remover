var app = angular
    .module('spoti_dup', ['spotify'])
    .config(function (SpotifyProvider) {
        SpotifyProvider.setClientId(
            '48e5a9cd2b0a481c940b2bf1c3ef9ee5'
        );
        SpotifyProvider.setRedirectUri(
            'http://localhost:63342/spotify-duplicate-remover/callback.html'
        );

        SpotifyProvider.setScope(
            'playlist-read-private playlist-modify-private playlist-modify-public'
        );
    })
    .controller('MainController', ['$scope', '$http', '$q', 'Spotify',
        function ($scope, $http, $q, Spotify) {

            $scope.currentPage = 0;
            $scope.pageSize = 20;
            $scope.playlists = [];
            $scope.playlists_tracks = [];
            $scope.playlists_tracks_temp = [];
            $scope.tracks = [];
            $scope.loggedIn = false;
            $scope.userName = "";
            $scope.token = "";
            $scope.currentUser = null;

            $scope.numberOfTracks = function () {
                var n = 0;
                console.log($scope.playlists_tracks);
                $scope.playlists_tracks.forEach(function (p) {
                    //
                });
                return n;
            };

            $scope.numberOfPages = function () {
                return Math.ceil($scope.playlists.length / $scope.pageSize);
            };

            $scope.login = function () {
                Spotify.login().then(function (data) {
                    $scope.loggedIn = true;
                    $scope.token = data;
                    $scope.getCurrentUser(function (data) {
                        $scope.userName = data["display_name"];
                        $scope.getUserOwnedPlaylists($scope.fetchAllPlaylistTracks);
                    });

                }, function () {
                    console.log('didn\'t log in');
                });
            };

            $scope.fetchAllPlaylistTracks = function (playlists) {

                var promise = $q(function(resolve, reject) {
                    playlists.forEach(function (p) {
                        $scope.fetchPlaylistTracks(p.id).then(function(tracks) {
                            var deferred = $q.defer();
                            deferred.resolve(tracks);
                            return deferred.promise;
                        }).then(function (data) {
                            $scope.setPlaylistTracks(data).then(function (d) {
                                $scope.playlists_tracks_temp.push(d);
                            });
                        });
                    });
                    resolve($scope.playlists_tracks_temp);
                });

                promise.then(function(allTracks) {
                    $scope.playlists_tracks = allTracks;
                    console.log($scope.playlists_tracks);
                });
            };

            $scope.fetchPlaylistTracks = function (playlist_id) {

                return $q(function (resolve, reject) {
                    Spotify.getPlaylistTracks($scope.currentUser["id"], playlist_id).then(
                        function (data) {
                            resolve(data);
                        }, function (reason) {
                            reject(reason);
                        })
                });
            };

            $scope.setPlaylistTracks = function (tracks) {

                return $q(function (resolve, reject) {
                    $scope.tracks.push.apply($scope.tracks, tracks.items);

                    if (tracks.next) {
                        $scope.callSpotify(tracks.next, function(data) {
                            $scope.setPlaylistTracks(data);
                        });
                    }

                    resolve($scope.tracks);
                });
            };

            $scope.callSpotify = function (url, callback) {
                $http.get(url, {
                    headers: {'Authorization': "Bearer " + $scope.token}
                }).then(function (response) {
                    callback(response.data);
                }, function (response) {
                    console.log(response.data || "Request failed");
                    console.log(response.status);
                })
            };

            $scope.getCurrentUser = function (callback) {
                $http.get("https://api.spotify.com/v1/me", {
                    headers: {'Authorization': "Bearer " + $scope.token}
                }).then(function (response) {
                    $scope.currentUser = response.data;
                    callback(response.data);
                    return response.data;
                }, function (response) {
                    console.log(response.data || "Request failed");
                    console.log(response.status);
                })
            };

            $scope.getUserOwnedPlaylists = function (callback) {
                Spotify.getUserPlaylists(
                    $scope.currentUser["id"], {"limit": 50}).then(function (data) {
                        $scope.playlists = data.items.filter(function (playlist) {
                            return playlist.owner.id === $scope.currentUser["id"];
                        });
                        callback($scope.playlists);
                    });
            };


        }]);

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});