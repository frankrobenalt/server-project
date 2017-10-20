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
    this.getHistory = (goal) =>{
        return $http.post('/api/getHistory', goal);
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
    this.addSavings = (addition)=>{
        return $http.post('/api/addSavings', addition).then(res=>{
            return res;
        });
    }

    this.deleteGoal = (id)=>{
        return $http.post('/api/deleteGoal', {id: id})
        .then(res=>{
            return res;
        });
    }
    this.deleteSavingsGoal = (id)=>{
        return $http.post('/api/deleteSavingsGoal', {id: id})
        .then(res=>{
            return res;
        });
    }

    this.updateProgress = (progress)=>{
        return $http.post('/api/updateProgress', progress).then(res=>res);
    }
    this.updateDate = (update)=>{
        return $http.post('/api/updateDate', update)
        .then(response=>{
            return response;
        });
    }
    this.updateWeight = (update)=>{
        return $http.post('/api/updateWeight', update);
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