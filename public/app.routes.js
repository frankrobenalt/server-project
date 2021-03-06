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
            .state('addGoal', {
                url: '/addGoal',
                templateUrl: './views/addGoalTmpl.html',
                controller: 'addGoalCtrl',
                resolve: {
                    user: mainSrvc => mainSrvc.getUser()
                        .then(response => {
                            var user = response.data;
                            console.log(user);
                            return mainSrvc.getGoals(response.data.id)
                            .then(response=> {
                                console.log(response.data);
                                return {user: user, goals: response.data};
                            })
                        }).catch(err => err)
                }
            })
            .state('profile', {
                url: '/profile/:username',
                templateUrl: './views/profileTmpl.html',
                controller: 'profileCtrl',
                resolve: {
                    user: mainSrvc => mainSrvc.getUser()
                        .then(response => {
                            var user = response.data;
                            return mainSrvc.getGoals(response.data.id)
                            .then(response=> {
                                return {user: user, goals: response.data};
                            })
                        }).catch(err => err)
                }
            })
    });