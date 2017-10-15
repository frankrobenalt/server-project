angular.module('giftApp').controller('homeCtrl', function($scope, mainSrvc, $location, user, $timeout) {
    $scope.goalDropdown = false;
    $scope.dropdown=()=>{
        document.getElementById("myDropdown").classList.toggle("show");
    }
    //if there is a user, pass them along to their profile page
    if (!user.data){
        $location.path('/profile/' + user.username);
    }
    $scope.showLogin = true;
    

    $scope.showCreateProfile = ()=>{
        $scope.showCreate = true;
        $scope.showLogin = false;
    }

    $scope.login = (user)=>{
        mainSrvc.findUser(user)
            .then(response=>{
            if (response === 'no user'){
                document.getElementById('username').style.borderColor = 'red';
            } else if (response === 'wrong password'){
                document.getElementById('password').style.borderColor = 'red';
            } 
            else {
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
