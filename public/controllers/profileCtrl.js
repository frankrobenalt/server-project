angular.module('giftApp').controller('profileCtrl', function($scope, mainSrvc, $stateParams, user, $location){
console.log(user);
    if (user.data){
        $location.path('/')
    }

    $scope.currentUser = user;

    mainSrvc.getGoals(user.id)
    .then(response=>{
        console.log({Goals: response});
        $scope.goals=response.data.reverse();
    })
    
    //ng-show initial values
    $scope.showProfile = true;
    $scope.hideCategories = true;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;
    $scope.hideDetail = true;

    $scope.addGoal = (goal) =>{
        console.log(goal);
            goal.id=user.id;
            goal.date = new Date();
            mainSrvc.addGoal(goal)
            .then(res=>{
                mainSrvc.getGoals(user.id)
                .then(response=>{
                    $scope.goals=response.data.reverse();
                })
        })
        $scope.hideCategories = true;
        $scope.hideExercise = true;
        $scope.hideSaveMoney = true;
        $scope.showProfile = true;

        $scope.goal='';
    }

    $scope.showDetails = (id)=>{
        $scope.hideDetail = false;
        $scope.showDetail = true;
        let goalidx = 0;
        $scope.goals.map((cur, idx)=>{
            if (cur.goalid === id){
                goalidx = idx;
            }
        });
        $scope.goals[goalidx].status = 'on pace';
    }

    $scope.hideDetails = (id)=>{
        $scope.hideDetail = true;
        $scope.showDetail = false;
        let goalidx = 0;
        $scope.goals.map((cur, idx)=>{
            if (cur.goalid === id){
                goalidx = idx;
            }
        });
        $scope.goals[goalidx].status = null;
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