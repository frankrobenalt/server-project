angular.module('giftApp').controller('profileCtrl', function($scope, mainSrvc, $stateParams, $timeout, $rootScope){

    $scope.showLogin = true;
    $scope.showProfile = false;
    $scope.showCreate = false;
    $scope.showAddGoal = false;
   
    $rootScope.$on('userId', function(event, curId){

        $scope.addGoal = (goal) =>{
           console.log('here');
            goal.id=curId;
            mainSrvc.addGoal(goal)
            .then(res=>{
                console.log(res);
                $scope.goals = res.reverse();
        })

        $scope.goal='';

    }


    
    });
    $scope.findUser = (user)=>{
        const username = user.username;
        mainSrvc.findUser(user)
        .then(res=>{
           if (res.validUser === true){
            mainSrvc.getUsers()
            .then(response=> {
                $scope.currentUser = response.data.filter(cur=>cur.username === username)[0];
                let id = $scope.currentUser.id;

                $rootScope.$emit('userId', id);
                $scope.showLogin = false;
            $scope.showProfile = true;
         
           mainSrvc.getGoals(id)
           .then(response=>{
               $scope.goals=response.data.reverse();
           })
        })
        }
    })
};



    $scope.showCreateProfile = ()=>{
        $scope.showCreate = true;
        $scope.showLogin = false;
    }

    $scope.createProfile = (user)=>{
        console.log(user);
        $scope.showLogin = false;
        $scope.showCreate = false;
        $scope.showProfile = true;
        $scope.showAddGoal = true;
        const username = user.username;
        mainSrvc.createProfile(user);
       
        mainSrvc.findUser(user)
        .then(res=>{
          $timeout(()=>{
            mainSrvc.getUsers()
            .then(response=> {
                console.log(response);
                $scope.currentUser = response.data.filter(cur=>cur.username === username)[0];
                let id = $scope.currentUser.id;
                $rootScope.$emit('userId', id);
                
                console.log($scope.currentUser);
                $scope.showLogin = false;
            $scope.showProfile = true;
         
           mainSrvc.getGoals(id)
           .then(response=>{
            console.log(response);
               $scope.goals=response.data.reverse();
           })
        })
    }, 1000);
        
    })
    };

   
   
});