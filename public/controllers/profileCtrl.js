angular.module('giftApp').controller('profileCtrl', function($scope, $moment, mainSrvc, $stateParams, user, $location){
    
    angular.element(document).ready(function(){

   
    });
    
    let now = $moment().format();
    $scope.goalDropdown = false;

    if (user.data){
        $location.path('/')
    }
    $scope.currentUser = user;

    mainSrvc.getGoals(user.id)
    .then(response=>{
        $scope.exerciseGoals=response.data;
        $scope.exerciseGoals.map((cur, idx)=>{
            if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
            if (cur.logged_today === true){
                if (cur.log_value === true){
                    cur.image = '../images/check.gif';
                } else {
                    cur.image='../images/x.gif'
                }
            }    
            if (cur.category === "save money"){
              cur.logged_today = true;
              cur.no_cal = true;
            }
            if (cur.timesperweek){cur.currentStatus = cur.progress + "/7"}
            mainSrvc.getLogs(cur.goalid).then(res=>{
                cur.log_data=res.data;
                cur.log_data.map((current, idx)=>{
                    if (current === true){
                        cur.log_data[idx] = '../images/check.gif';
                    }
                    else if (current === false){
                        cur.log_data[idx] = '../images/x.gif';
                    }
                    else {cur.log_data[idx] = '../images/questionmark.gif'}
                })
                })
            })
            console.log($scope.exerciseGoals);
            
        });
    
    //ng-show initial values
    $scope.showProfile = true;
    $scope.hideCategories = true;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;
    $scope.hideDetail = true;

    $scope.addGoal = (goal) =>{
        //console.log(goal);
            goal.id = user.id;
            mainSrvc.addGoal(goal)
            .then(res=>{
                mainSrvc.getGoals(user.id)
                .then(response=>{
                    console.log({Goals: response});
                    $scope.exerciseGoals=response.data;
                    $scope.exerciseGoals.map((cur, idx)=>{
                        if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
                        if (cur.logged_today === true){
                            if (cur.log_value === true){
                                cur.image = '../images/check.gif';
                            } else {
                                cur.image='../images/x.gif'
                            }
                        }    
                        if (cur.category === "save money"){
                            cur.logged_today = true;
                        }
                        if (cur.timesperweek){cur.currentStatus = cur.progress + "/7"}
                        mainSrvc.getLogs(cur.goalid).then(res=>{
                            cur.log_data=res.data;
                            cur.log_data.map((current, idx)=>{
                                console.log(current);
                                if (current === true){
                                    cur.log_data[idx] = '../images/check.gif';
                                }
                                else if (current === false){
                                    cur.log_data[idx] = '../images/x.gif';
                                }
                                else {cur.log_data[idx] = '../images/questionmark.gif'}
                            })
                            })
                    });
                })
        })
        $scope.hideCategories = true;
        $scope.hideExercise = true;
        $scope.hideSaveMoney = true;
        $scope.showProfile = true;

        $scope.goal='';
    }

    $scope.deleteGoal = (id)=>{
       // console.log(id);
        mainSrvc.deleteGoal(id)
            .then((res)=>{                
                mainSrvc.getGoals(user.id)
                .then(response=>{
                    $scope.exerciseGoals=response.data;
                    $scope.exerciseGoals.map((cur, idx)=>{
                        if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
                        if (cur.logged_today === true){
                            if (cur.log_value === true){
                                cur.image = '../images/check.gif';
                            } else {
                                cur.image='../images/x.gif'
                            }
                        }    
                        if (cur.category === "save money"){
                          cur.logged_today = true;
                          cur.no_cal = true;
                        }
                        if (cur.timesperweek){cur.currentStatus = cur.progress + "/7"}
                        mainSrvc.getLogs(cur.goalid).then(res=>{
                            cur.log_data=res.data;
                            cur.log_data.map((current, idx)=>{
                                if (current === true){
                                    cur.log_data[idx] = '../images/check.gif';
                                }
                                else if (current === false){
                                    cur.log_data[idx] = '../images/x.gif';
                                }
                                else {cur.log_data[idx] = '../images/questionmark.gif'}
                            })
                            })
                        })
                       // console.log($scope.goals);
                        
                    });
            })
    }

    $scope.updateProgress = (progress)=>{
        mainSrvc.updateProgress(progress)
        .then(res => {
            mainSrvc.getGoals(user.id)
            .then(response=>{
                console.log({Goals: response.data});
                $scope.exerciseGoals=response.data;
                $scope.goals.map((cur, idx)=>{
                    if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
                    if (cur.logged_today === true){
                        if (cur.log_value === true){
                            cur.image = '../images/check.gif';
                        } else {
                            cur.image='../images/x.gif'
                        }
                    }    
                    if (cur.category === "save money"){
                        cur.logged_today = true;
                      }
                    if (cur.timesperweek){cur.currentStatus = cur.progress + "/7"}
                    mainSrvc.getLogs(cur.goalid).then(res=>{
                        cur.log_data=res.data;
                        cur.log_data.map((current, idx)=>{
                            //console.log(current);
                            if (current === true){
                                cur.log_data[idx] = '../images/check.gif';
                            }
                            else if (current === false){
                                cur.log_data[idx] = '../images/x.gif';
                            }
                            else {cur.log_data[idx] = '../images/questionmark.gif'}
                        })
                        })
                
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

    $scope.dropdown=()=>{
        document.getElementById("myDropdown").classList.toggle("show");
    }
    $scope.logOut = ()=>{
        mainSrvc.logOut().then(res=>{
            $location.path('/');            
        });
    }
   
});