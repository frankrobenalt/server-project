angular.module('giftApp').controller('profileCtrl', function($scope, $moment, mainSrvc, $stateParams, user, $location){
    
    angular.element(document).ready(function(){

   
    });
    
    let now = $moment().format();
    $scope.goalDropdown = false;
    $scope.goalModal = false;
    $scope.modifyDay = false;

    if (user.data){
        $location.path('/')
    }
    $scope.currentUser = user;

    mainSrvc.getGoals(user.id)
    .then(response=>{
        if (response.data.exercise.length < 1){$scope.hideExGoals = true}
        $scope.exerciseGoals=response.data.exercise;
        $scope.exerciseGoals.map((cur, idx)=>{
            cur.progress=0;
            if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
            if (cur.logged_today === true){
                if (cur.log_value === true){
                    cur.image = '../images/check.gif';
                } else {
                    cur.image='../images/x.gif'
                }
            }
            mainSrvc.getLogs(cur.goalid).then(res=>{
                cur.log_data=res.data.log_data;
                $scope.dates = res.data.dates;
                cur.log_data.map((current, idx)=>{
                    if (current === true){
                        cur.log_data[idx] = '../images/check.gif';
                        cur.progress += 1;
                    }
                    else if (current === false){
                        cur.log_data[idx] = '../images/x.gif';
                    }
                    else {cur.log_data[idx] = '../images/questionmark.gif'}
                })
                })
            })
            
        if (response.data.savings.length < 1){$scope.hideSave = true;}
            $scope.savingsGoals = response.data.savings;
        $scope.amount = '';
            
        });

    $scope.getGoals =  (id)=>{
        mainSrvc.getGoals(id)
        .then(response=>{
            if (response.data.exercise.length < 1){$scope.hideExGoals = true}
            else if (response.data.exercise.length > 0){$scope.hideExGoals = false}
            $scope.exerciseGoals=response.data.exercise;
            $scope.exerciseGoals.map((cur, idx)=>{
                cur.progress=0;
                if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
                if (cur.logged_today === true){
                    if (cur.log_value === true){
                        cur.image = '../images/check.gif';
                    } else {
                        cur.image='../images/x.gif'
                    }
                }    
                mainSrvc.getLogs(cur.goalid).then(res=>{
                    cur.log_data=res.data.log_data;
                    $scope.dates = res.data.dates;
                    cur.log_data.map((current, idx)=>{
                        if (current === true){
                            cur.log_data[idx] = '../images/check.gif';
                            cur.progress += 1;
                            
                        }
                        else if (current === false){
                            cur.log_data[idx] = '../images/x.gif';
                        }
                        else {cur.log_data[idx] = '../images/questionmark.gif'}
                    })
                    })
                })
                //console.log($scope.exerciseGoals);
            if (response.data.savings.length < 1){$scope.hideSave = true}
            else if (response.data.savings.length > 0){$scope.hideSave = false}
                $scope.savingsGoals = response.data.savings;
            $scope.amount = '';
                
            });
        }
    
    //ng-show initial values
    $scope.showProfile = true;
    $scope.hideCategories = true;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;
    $scope.hideDetail = true;

    $scope.addGoal = (goal) =>{
        //console.log(goal);
        $scope.hideExercise = true;
        $scope.showProfile = true;
        
            goal.id = user.id;
            mainSrvc.addGoal(goal)
            .then(res=>{
                $scope.getGoals(user.id);
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

    $scope.deleteGoal = (id)=>{
       // console.log(id);
        mainSrvc.deleteGoal(id)
            .then((res)=>{
                $scope.getGoals(user.id);
            });
        }            
               
    $scope.deleteSavingsGoal = (id)=>{
        mainSrvc.deleteSavingsGoal(id)
        .then(res=>{
            $scope.getGoals(user.id);
        })
    }
                

    $scope.updateProgress = (progress)=>{
        mainSrvc.updateProgress(progress)
        .then(res => {
            $scope.getGoals(user.id);
        })
    }

    $scope.updateDate = (update)=>{
        $scope.modifyDay = false;
        mainSrvc.updateDate(update).then(response=>{
            $scope.getGoals(user.id);
        });
    }
           

    $scope.addSavings = (addition)=>{
        $scope.amount = '';
        mainSrvc.addSavings(addition).then(res=>{
            $scope.getGoals(user.id);
        })
    }

    $scope.goalMod = function(info){
        $scope.modifyDay = true;
        $scope.curId = info.goal.goalid;
        mainSrvc.getLogs(info.goal.goalid)
        .then(response=>{
            $scope.clickedDate = response.data.dates[info.index];
            response.data.log_data.map((current, idx)=>{
                if (current === true){
                    response.data.log_data[idx] = '../images/check.gif';
                }
                else if (current === false){
                    response.data.log_data[idx] = '../images/x.gif';
                }
                else {response.data.log_data[idx] = '../images/questionmark.gif'}
            })
            $scope.curImg = response.data.log_data[info.index];
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