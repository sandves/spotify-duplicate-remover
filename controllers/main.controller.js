var app = angular
    .module('spoti_dup', ['spotify', 'ngAnimate', 'ui.bootstrap'])
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
            $scope.duplicate_tracks = [];
            $scope.tracks = [];
            $scope.loggedIn = false;
            $scope.userName = "";
            $scope.token = "";
            $scope.currentUser = null;
            $scope.duplicates = {};
            $scope.processing = true;
            $scope.processed_playlists = 10;

            $scope.numberOfPages = function () {
                return Math.ceil($scope.playlists.length / $scope.pageSize);
            };

            $scope.login = function () {
                Spotify.login().then(function (data) {
                    $scope.loggedIn = true;
                    $scope.token = data;
                    $scope.getCurrentUser(function (data) {
                        $scope.userName = data["display_name"];
                        $scope.getUserOwnedPlaylists(null);
                    });
                }, function () {
                    console.log('didn\'t log in');
                });
            };

            $scope.findDuplicates = function (playlist_id, tracks) {

                var sorted = tracks.slice()
                    .sort(function (a, b) {
                        if (a.track == null || b.track == null)
                            return 0;
                        if (a.track.id < b.track.id)
                            return -1;
                        if (a.track.id > b.track.id)
                            return 1;
                        return 0;

                    });

                var results = [];
                for (var i = 0; i < tracks.length - 1; i++) {

                    var a = sorted[i + 1];
                    var b= sorted[i];

                    if (a.track != null && b.track != null) {
                        if (a.track.id == b.track.id) {
                            // Cannot compare local tracks because the track ID is null
                            if (!(a.is_local && b.is_local)) {
                                results.push(b);
                            }
                        }
                    }
                }
                return results;
            };

            $scope.getTracks = function (playlist_id) {
                return $q(function (resolve, reject) {
                    $scope.setTracks(playlist_id, null).then(function (tracks) {
                        var duplicates = $scope.findDuplicates(playlist_id, tracks);
                        $scope.duplicates[playlist_id] = duplicates;
                        console.log(playlist_id);
                        console.log(duplicates);
                        resolve(duplicates);
                    });
                });
            };

            $scope.getDuplicates = function (playlist_id) {
                //$scope.tracks = $scope.duplicates[playlist_id];
                $scope.getTracks(playlist_id).then(function (data) {
                    $scope.duplicate_tracks = data;
                });
            };

            $scope.setTracks = function (playlist_id, callback) {
                $scope.tracks = [];
                return $scope
                    .fetchTracks(playlist_id)
                    .then(function (data) {
                        return $scope.setPlaylistTracks(data);
                    });
            };

            $scope.fetchTracks = function (playlist_id) {

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
                    var t = [];
                    t.push.apply(t, tracks.items);
                    getAll(tracks);
                    function getAll(songs) {
                        if(songs.next) {
                            $http.get(songs.next, {
                                headers: {'Authorization': "Bearer " + $scope.token}
                            }).then(function (response) {
                                t.push.apply(t, response.data.items);
                                getAll(response.data);
                            }, function (error) {
                                console.log(error.data || "Request failed");
                            })
                        }
                        else {
                            resolve(t);
                        }
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
                        callback && callback($scope.playlists);
                    });
            };

            $scope.processAllPlaylists = function () {
                var prom = [];
                $scope.playlists.forEach(function (playlist) {
                    prom.push($scope.getTracks(playlist.id));
                });
                $q.all(prom).then(function () {
                    console.log($scope.duplicates);
                });
            };

        }]);

app.filter('startFrom', function () {
    return function (input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});