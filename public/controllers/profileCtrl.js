angular.module('giftApp').controller('profileCtrl', function($scope, mainSrvc, $stateParams, user, $location){
console.log(user);
    if (user.data){
        $location.path('/')
    }

    $scope.currentUser = user;

    mainSrvc.getGoals(user.id)
    .then(response=>{
        $scope.goals=response.data.reverse();
    })
    
    //ng-show initial values
    $scope.showProfile = true;
    $scope.hideCategories = true;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;

    $scope.addGoal = (goal) =>{
        console.log(goal);
            goal.id=user.id;
            mainSrvc.addGoal(goal)
            .then(res=>{
                console.log(res);
                $scope.goals = res.reverse();
        })
        $scope.hideCategories = true;
        $scope.hideExercise = true;
        $scope.hideSaveMoney = true;
        $scope.showProfile = true;

        $scope.goal='';
    }

    $scope.showExercise = () => {
        $scope.hideCategories = true;
        $scope.hideExercise = false;
        $scope.goal = {category: 'exercise'};
    }

    $scope.showSaveMoney = () => {
        $scope.hideCategories = true;
        $scope.hideSaveMoney = false;
        $scope.goal = {category: 'save money'};
    }
   
});