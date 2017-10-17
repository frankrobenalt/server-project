angular.module('giftApp').controller('addGoalCtrl', function($scope, mainSrvc, user, $location){
    if (user.data){
        $location.path('/')
    }
    var user = user.user;
    $scope.user = user;

    $scope.hideCategories = false;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;

    $scope.addGoal = (goal) =>{
        $scope.hideExercise = true;
        
            goal.id = user.id;
            mainSrvc.addGoal(goal)
            .then(res=>{
                $location.path('/profile/' + user.username);;
            })
    }

    $scope.addSavingsGoal = (goal)=>{
        $scope.hideSaveMoney = true;
        $scope.showProfile = true;
        goal.user_id = user.id;
        mainSrvc.addSavingsGoal(goal)
        .then(res=>{
            $scope.getGoals(user.id);
        })
    }

    $scope.showExercise = () => {
        $scope.hideCategories = true;
        $scope.hideExercise = false;
    }

    $scope.showSaveMoney = () => {
        $scope.hideCategories = true;
        $scope.hideSaveMoney = false;
    }

    $scope.dropdown=()=>{
        document.getElementById("myDropdown").classList.toggle("show");
    }
    $scope.logOut = ()=>{
        mainSrvc.logOut().then(res=>{
            $location.path('/');            
        });
    }
});