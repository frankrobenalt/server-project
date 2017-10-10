angular.module('giftApp').controller('homeCtrl', function($scope, mainSrvc, $location, user, $timeout) {
    
    //if there is a user, pass them along to their profile page
    // if (!user.data){
    //     $location.path('/profile/' + user.username);
    // }

    

    $scope.showCreateProfile = ()=>{
        $scope.showCreate = true;
        $scope.showLogin = false;
    }

    $scope.login = (user)=>{
        mainSrvc.findUser(user)
            .then(response=>{
            if (response === 'nonono'){

            } else {
                $location.path('/profile/' + response.username);
            }
            });
    }

    $scope.createProfile = (user)=>{
        mainSrvc.createProfile(user);
        $timeout(()=>{
        $scope.login({username: user.username, password: user.password });
        }, 500)
    };
   
})
