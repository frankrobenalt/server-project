angular.module('giftApp').service('mainSrvc', function($http, $rootScope) {
    // you can use this function for every request to get user.
    // don't write new versions of this in every service, keep it DRY
    this.getUser = () => $http.get('/auth/me');
    
    this.createProfile = (user) => {
        console.log(user);
        $http.post('/api/users/create', user)
        .then(response=>response);
}
    this.getGoals = (id) => {
        return $http.post('/api/goals', {id: id})
        .then(res=>{
            return res;
        })
    }
    this.getLogs = (id) =>{
        return $http.post('/api/getLogs', {id: id})
        .then(res=>{
            return res;
        })
    } 
    this.getHabitLogs = (id) =>{
        return $http.post('/api/getHabitLogs', {id: id})
        .then(res=>{
            return res;
        })
    } 
    this.getHistory = (goal) =>{
        return $http.post('/api/getHistory', goal);
    }
    this.getHabitHistory = (goal) =>{
        return $http.post('/api/getHabitHistory', goal);
    }
    this.addGoal = (goal) => {
        return $http.post('/api/addExerciseGoal', goal)
        .then(res=>{
            return res.data;
        });
    }
    this.addWeightGoal = (goal)=>{
        return $http.post('/api/addWeightGoal', goal).then(res=>res);
    }
    this.addSavingsGoal = (goal)=>{
        return $http.post('/api/addSavingsGoal', goal)
        .then(res=>{
            return res.data;
        });
    }
    this.addSchoolGoal = (goal)=>{
        return $http.post('/api/addSchoolGoal', goal).then(res=>res);
    }
    this.addQuitHabitGoal = (goal)=>{
        return $http.post('/api/addQuitHabitGoal', goal).then(res=>res);        
    }
    this.addSavings = (addition)=>{
        $http.post('/api/addSavings', addition);
    }

    this.deleteGoal = (id)=>{
        $http.post('/api/deleteGoal', {id: id});
    }
    this.deleteSavingsGoal = (id)=>{
        $http.post('/api/deleteSavingsGoal', {id: id});
    }

    this.updateProgress = (progress)=>{
        $http.post('/api/updateProgress', progress);
    }
    this.updateBadHabitProgress = (progress)=>{
        $http.post('/api/updateBadHabit', progress);
    }
    this.updateDate = (update)=>$http.post('/api/updateDate', update);
    this.updateWeight = (update)=>{
        $http.post('/api/updateWeight', update);
    }

    this.findUser = (user)=>{
        
        return $http.post('/api/login', user)
            .then((res)=>{
            if (res.data.reason){
                return res.data.reason;
            } else {
              return res.data.user;   
            }             
            });
    }

    this.logOut = ()=>{
        return $http.get('/logout');
    }

});