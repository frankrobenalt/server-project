angular.module('giftApp').controller('createProfileCtrl', function($scope, mainSrvc){
    $scope.test = "yoyoy";
    $scope.createProfile = (user)=>{
        console.log('got here');
    mainSrvc.createProfile(user);
    };
});