angular.module('giftApp').controller('profileCtrl', function($scope, $moment, mainSrvc, $stateParams, user, $location){
    let now = $moment().format();

    if (user.data){
        $location.path('/')
    }
    $scope.currentUser = user;

    mainSrvc.getGoals(user.id)
    .then(response=>{
        console.log({Goals: response});
        $scope.goals=response.data.reverse();
        $scope.goals.map((cur, idx)=>{
            cur.yes = 'yes';
            cur.no = 'no';
            if (cur.category === "save money" || cur.last_log){
                cur.yes = null;
                cur.no = null;
            }
            if (cur.timesperweek){cur.currentStatus = cur.progress + "/7"}
            else {
                
            }
        });
    })
    
    //ng-show initial values
    $scope.showProfile = true;
    $scope.hideCategories = true;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;
    $scope.hideDetail = true;

    $scope.addGoal = (goal) =>{
        console.log(goal);
            goal.id = user.id;
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
        $scope.currentGoal;
        $scope.goals.map((cur, idx)=>{
            if (cur.goalid === id){
                $scope.currentGoal = cur;
            }
        });
        if ($scope.currentGoal.category === "exercise"){
            $scope.currentGoal.wagerInfo = "You wagered $" + $scope.currentGoal.wager + " per " + $scope.currentGoal.wager_option + " on this goal.";
        } else if ($scope.currentGoal.category === "save money"){
            $scope.currentGoal.wagerInfo = "You pledged to save $" + $scope.currentGoal.wager + " per " + $scope.currentGoal.wager_option;
        }
    }

    $scope.hideDetails = (id)=>{
        $scope.hideDetail = true;
        $scope.showDetail = false;
        $scope.currentGoal;
        $scope.goals.map((cur, idx)=>{
            if (cur.goalid === id){
                $scope.currentGoal = cur;
            }
        });
        $scope.currentGoal.wagerInfo = null;
    }

    $scope.updateProgress = (progress)=>{
        mainSrvc.updateProgress(progress)
        .then(res => {
            mainSrvc.getGoals(user.id)
            .then(response=>{
                console.log({Goals: response});
                $scope.goals=response.data;
                $scope.goals.map((cur, idx)=>{
                    cur.yes = 'yes';
                    cur.no = 'no';
                    if (progress.goalid === cur.goalid || cur.category === "save money"){
                        cur.yes = null;
                        cur.no = null;
                    }
                    if (cur.timesperweek){cur.currentStatus = cur.progress + "/7"}
                
                });
            })
              
            })  
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

    $scope.logOut = ()=>{
        $location.path('/');
    }
   
});