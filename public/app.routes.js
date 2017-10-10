angular.module('giftApp').config(($urlRouterProvider, $stateProvider, $momentProvider) => {
        
        $momentProvider
        .asyncLoading(false)
        .scriptUrl('//cdnjs.cloudflare.com/ajax/libs/moment.js/2.5.1/moment.min.js');
        

        $urlRouterProvider.otherwise('/');
    
        // in the resolve, request the user, if no user, catcth the error (401, 404, etc.);
        // the user method gives access to a user prop in the homeCtrl
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: './views/homeTmpl.html',
                controller: 'homeCtrl',
                resolve: {
                    user: mainSrvc => mainSrvc.getUser()
                        .then(response => response.data)
                        .catch(err => err)
                }
            })
            .state('createProfile', {
                url: '/createProfile',
                templateUrl: './views/createProfileTmpl.html',
                controller: 'createProfileCtrl'
            })
            .state('profile', {
                url: '/profile/:username',
                templateUrl: './views/profileTmpl.html',
                controller: 'profileCtrl',
                resolve: {
                    user: mainSrvc => mainSrvc.getUser()
                        .then(response => {
                            return response.data;
                        })
                        .catch(err => err)              
                }
            })
    });