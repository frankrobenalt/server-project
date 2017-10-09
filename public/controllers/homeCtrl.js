angular.module('giftApp').controller('homeCtrl', function($scope, mainSrvc, $location, user, $timeout) {
    
    //if there is a user, pass them along to their profile page
    if (!user.data){
        $location.path('/profile/' + user.username);
    }

    

    $scope.showCreateProfile = ()=>{
        $scope.showCreate = true;
        $scope.showLogin = false;
    }

    $scope.login = (user)=>{
        mainSrvc.findUser(user)
            .then(response=>{
                console.log(response);
            if (response === 'nonono'){

            } else {
                console.log('/profile/');
                $location.path('/profile/' + response.username);
            }
            });
    }

    $scope.createProfile = (user)=>{
        console.log(user);
        mainSrvc.createProfile(user);
        $timeout(()=>{
        $scope.login({username: user.username, password: user.password });
        }, 500)
    };
   
})
