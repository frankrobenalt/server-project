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
    this.addGoal = (goal) => {
        return $http.post('/api/addGoal', goal)
        .then(res=>{
            console.log(res);
            return res.data;
        });
    }

    this.deleteGoal = (id)=>{
        return $http.post('/api/deleteGoal', {id: id})
        .then(res=>{
            return res;
        });
    }

    this.updateProgress = (progress)=>{
        return $http.post('/api/updateProgress', progress).then(res=>res);
    }

    this.findUser = (user)=>{
        
        return $http.post('/api/login', user)
            .then((res)=>{
            if (!res.data.user){
                return 'nonono';
            }
              return res.data.user;                
            });
    }

    this.logOut = ()=>{
        return $http.get('/logout');
    }

});