angular.module('giftApp').controller('addGoalCtrl', function($scope, mainSrvc, user, $location){
    if (user.data){
        $location.path('/')
    }
    var user = user.user;
    $scope.user = user;

    $scope.hideCategories = false;
    $scope.hideExercise = true;
    $scope.hideSaveMoney = true;
    $scope.hideDiet = true;
    $scope.hideWeight = true;
    $scope.charities = charities;


    $scope.addGoal = (goal) =>{
        $scope.hideExercise = true;
            goal.wager_option = 'weeks';
            goal.id = user.id;
            mainSrvc.addGoal(goal)
            .then(res=>{
                $location.path('/profile/' + user.username);;
            })
    }

    $scope.addSavingsGoal = (goal)=>{
        $scope.hideSaveMoney = true;
        
        goal.user_id = user.id;
        goal.installment_value = goal.savings_goal/(goal.endNum*2);
        console.log(goal.installment_value);
        mainSrvc.addSavingsGoal(goal)
        .then(res=>{
            $location.path('/profile/' + user.username);
        })
    }

    $scope.addWeightGoal = (goal)=>{
        $scope.hideWeight=true;
        console.log(goal);
        goal.user_id = user.id;
        mainSrvc.addWeightGoal(goal).then(res=>{
            $location.path('/profile/' + user.username);
        })
    }

    $scope.showDiet = ()=>{
        $scope.hideCategories = true;
        $scope.hideDiet = false;
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
    $scope.fillCharity = (charity)=>{
        var char = document.getElementById("charity");
        char.classList.add("goalInfo");
        $scope.goal.recipient = charity;
    }
    angular.element(document).ready(function(){
        $('#charitySearch').keyup(function(){
            $("#charity").removeClass("goalInfo");
        })
    })
});

var charities = [
    'St. Judes Research Hospital',
    'American Humane Society',
    'Wildlife Conservation Society',
    'Breast Cancer Research Foundation',
    'Cancer Research Institute',
    'Leukemia and Lymphoma Society',
    'Prostate Cancer Foundation',
    'Prevent Child Abuse America',
    'Toys for Tots Foundation',
    'Ronald Mcdonald House',
    'American Civil Liberties Union (ACLU)',
    'Action on Smoking and Health',
    'Environmental Defense Fund',
    'Sierra Club Foundation',
    'Water.org',
    'ALS Association',
    'American Kidney Fund',
    'American Liver Foundation',
    'American Red Cross',
    'Huntingtons Disease Society of America',
    'National Kidney Foundation',
    'Cystic Fibrosis Foundation',
    "Parkinson's Foundation",
    'Habitat for Humanity',
    'Human Rights First',
    'The YMCA',
    'City Harvest',
    'Feeding America',
    'Meals on Wheels America',
    "Alzheimer's Association",
    'American Foundation for Suicide Prevention',
    'International Peace Institute',
    'Brookings Institution',
    'Semper Fi Fund',
    'Wounded Warriors Family Support',
    'Global Fund for Women',
    'Big Brothers/Big Sisters of America',
    'Boy Scouts of America',
    'Boys & Girls Clubs of America',
    'Scholarship America'
]