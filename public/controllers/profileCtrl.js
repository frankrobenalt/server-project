angular.module('giftApp').controller('profileCtrl', function($scope, mainSrvc, $stateParams, user, $location){
    let today = moment().format('MMM D');    
    let todayidx;
    let todayMilli = moment(today).toDate().getTime();

    $scope.goalModal = false;
    $scope.goalModalWeight = false;
    $scope.modifyDay = false;

    if (user.data){
        $location.path('/')
    }
    console.log(user);
    $scope.currentUser = user.user;
    $scope.exerciseGoals = user.goals.exercise;
    $scope.savingsGoals = user.goals.savings;
    $scope.weightGoals = user.goals.weight;
    $scope.weightGoals.map(cur=>{
        if (cur.current_weight - cur.goal_weight > 0){
            cur.goal = "Lose Weight";
        } else {
            cur.goal = "Gain Weight";
        }
    })
    console.log($scope.weightGoals);
    if ($scope.exerciseGoals.length < 1){$scope.hideExGoals = true}
    if ($scope.savingsGoals.length < 1){$scope.hideSave = true}
    if ($scope.weightGoals.length < 1){$scope.hideWeight = true}
    $scope.exerciseGoals.map((cur, idx)=>{
        cur.progress=0;
        if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
        if (cur.logged_today === true){if (cur.log_value === true){cur.image = '../images/check.gif'} else {cur.image='../images/x.gif'}}
        mainSrvc.getLogs(cur.goalid).then(res=>{
            if (!res.data.log_data) {cur.log_data = ['../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif']} 
            else {cur.log_data=res.data.log_data}         
                $scope.dates = res.data.dates;
                $scope.dates.map((cur, idx)=>{
                    if (moment(cur).format('MMM D') === today){
                        $scope.dates[idx] = "Today";
                        todayidx = idx;
                    }}) 
                    cur.log_data.map((current, idx)=>{
                        if (current === true){
                            cur.log_data[idx] = '../images/check.gif';
                            cur.progress += 1;
                        }
                        else if (current === false){cur.log_data[idx] = '../images/x.gif'}
                        else {cur.log_data[idx] = '../images/questionmark.gif'}})
                        })
            // mainSrvc.getHistory(cur).then(respoonse=>{
            //     console.log(respoonse);
            //     cur.total = 
            // })
        
    })
        
    $scope.getGoals =  (id)=>{
        mainSrvc.getGoals(id)
        .then(response=>{
            if (response.data.exercise.length < 1){$scope.hideExGoals = true}
            else if (response.data.exercise.length > 0){$scope.hideExGoals = false}
            $scope.exerciseGoals=response.data.exercise;
 
            $scope.exerciseGoals.map((cur, idx)=>{
                cur.progress=0;
                if (cur.logged_today === false){cur.image = '../images/questionmark.gif'}
                if (cur.logged_today === true){if (cur.log_value === true){cur.image = '../images/check.gif'} else {cur.image='../images/x.gif'}}
                mainSrvc.getLogs(cur.goalid).then(res=>{
                    if (!res.data.log_data) {cur.log_data = ['../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif']} 
                    else {cur.log_data=res.data.log_data}               
                    $scope.dates = res.data.dates;
                    $scope.dates.map((cur, idx)=>{
                        if (moment(cur).format('MMM D') === today){$scope.dates[idx] = "Today"}
                    })
                    if (!cur.log_data) {cur.log_data = ['../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif','../images/questionmark.gif']} 
                    else {cur.log_data.map((current, idx)=>{
                            if (current === true){
                                cur.log_data[idx] = '../images/check.gif';
                                cur.progress += 1;
                            }
                            else if (current === false){cur.log_data[idx] = '../images/x.gif'}
                            else {cur.log_data[idx] = '../images/questionmark.gif'}
            })}})})
            if (response.data.savings.length < 1){$scope.hideSave = true}
            else if (response.data.savings.length > 0){$scope.hideSave = false}
            $scope.savingsGoals = response.data.savings;
            $scope.amount = ''
            $scope.weightGoals = response.data.weight;
            if (response.data.weight.length < 1){$scope.hideWeight = true}            
            $scope.weightGoals.map(cur=>{
                if (cur.current_weight - cur.goalWeight > 0){
                    cur.goal = "Lose Weight";
                } else {
                    cur.goal = "Gain Weight";
                }
            })
        });
            
    }

    $scope.thisWeek = (goal)=>{
        var stats = document.getElementById("stats" + goal.goalid);
        stats.classList.remove("goalInfoShow");
        stats.classList.remove("inline");
        var showWeek = document.getElementById("cal" + goal.goalid);
        showWeek.classList.remove("goalInfo");
        var hideCal = document.getElementById("bigCal" + goal.goalid);
        hideCal.classList.add("goalInfo");
        var bigTitle = document.getElementById("showHistory" + goal.goalid);
        bigTitle.classList.remove("title");
        bigTitle.classList.add("smaller");
        var smallTitle = document.getElementById("thisWeek" + goal.goalid);
        smallTitle.classList.add("title");
        smallTitle.classList.remove("smaller");
        var smallTitleDos = document.getElementById("info" + goal.goalid);
        smallTitleDos.classList.remove("title");
        smallTitleDos.classList.add("smaller");
    }

    $scope.stats = (goal)=>{
        var showWeek = document.getElementById("cal" + goal.goalid);
        showWeek.classList.add("goalInfo");
        var hideCal = document.getElementById("bigCal" + goal.goalid);
        hideCal.classList.add("goalInfo");
        var stats = document.getElementById("stats" + goal.goalid);
        stats.classList.add("goalInfoShow");
        stats.classList.add("inline");
        var bigTitle = document.getElementById("showHistory" + goal.goalid);
        bigTitle.classList.remove("title");
        bigTitle.classList.add("smaller");
        var smallTitle = document.getElementById("thisWeek" + goal.goalid);
        smallTitle.classList.remove("title");
        smallTitle.classList.add("smaller");
        var smallTitleDos = document.getElementById("info" + goal.goalid);
        smallTitleDos.classList.add("title");
        smallTitleDos.classList.remove("smaller");
    }

    $scope.getHistory = (goal)=>{
        var bigTitle = document.getElementById("showHistory" + goal.goalid);
        bigTitle.classList.add("title");
        bigTitle.classList.remove("smaller");
        var smallTitle = document.getElementById("thisWeek" + goal.goalid);
        smallTitle.classList.remove("title");
        smallTitle.classList.add("smaller");
        var smallTitleDos = document.getElementById("info" + goal.goalid);
        smallTitleDos.classList.remove("title");
        smallTitleDos.classList.add("smaller");
        var table = document.getElementById("bigCal" + goal.goalid);
        var hideTable = document.getElementById("cal" + goal.goalid);
        hideTable.classList.add("goalInfo");        
        if (table.classList[1]==="goalInfo"){
            table.classList.remove("goalInfo");
            return;
        }        
        mainSrvc.getHistory(goal).then(response=>{
            var numrows = (response.data.history.sundays.length)*2;
            var day = moment(response.data.history.sundays[0]).toDate();
            var dow = moment(response.data.history.startDate).toDate().getDay();

            var start = moment(response.data.history.startDate).format('MMM D');
            start = moment(start).toDate().getTime();
            var end = moment(response.data.history.endDate).format('MMM D');
            end = moment(end).toDate().getTime();

            var numDays = response.data.history.sundays.length * 7;
            var calendar = [moment(day).format('MMM D')];
            var history = [];

            for (var p=1;p<=numDays;p++){
                var days = moment(day).add(p, 'days');
                calendar.push(moment(days).format('MMM D'));
                var now = moment(days).format('MMM D');
            }
            let log_dates = [];
            let values = [];
            let logImages = [];
            var trueCount = 0;
            var totalCount = 0;
            response.data.log_history.map(cur=>{
                log_dates.push(moment(cur.log_date).format('MMM D'));
                values.push(cur.log_value);
            });
            calendar.map(cur=>{
                if (moment(cur).toDate().getTime() - start < 0 || moment(cur).toDate().getTime() - end >= 0){logImages.push('../images/null.svg')} 
                else if (log_dates.indexOf(cur) > -1){
                    if (values[log_dates.indexOf(cur)] === true){
                        logImages.push('../images/check.gif');
                        trueCount++;
                        totalCount++;
                    } else {
                        logImages.push('../images/x.gif');
                        totalCount++;    
                    }}
                    else if (moment(cur).toDate().getTime() - end === 0) {
                        logImages.push
                    }
                    else {
                        logImages.push('../images/questionmark.gif');
                        totalCount++;
                }
            })
            console.log(trueCount, totalCount)
            
            
            for (var i=0; i<numrows; i++){
                var row = table.insertRow();
                for (var j = 0; j<=6; j++){
                    if (i === 0 || i%2===0){
                        // if (j === 7){
                        //     var header = document.createElement('th');
                        //     header.innerHTML = `This Weeks &#10004;'s`;
                        //     header.style.width = '130px';
                        //     row.appendChild(header);
                        //     break;
                        // }
                        var header = document.createElement('th');
                        header.style.width = '80px';  
                        header.style.height = "60px";                        
                        if (moment(calendar[0]).toDate().getTime() - start < 0 || moment(calendar[0]).toDate().getTime() - end > 0){
                            header.style.backgroundColor = "#787878";
                            header.innerHTML = calendar[0];
                            row.appendChild(header);
                            calendar.splice(0, 1);
                        } else if (moment(calendar[0]).toDate().getTime() - end === 0) {
                            header.innerHTML = "End Date<br>"+calendar[0];
                            header.style.backgroundColor = "#90EE90";
                            row.appendChild(header);
                            calendar.splice(0, 1);
                        } else if (moment(calendar[0]).toDate().getTime() - start === 0) {
                            header.innerHTML = "Start Date<br>" + calendar[0];
                            header.style.backgroundColor = "#90EE90";                            
                            row.appendChild(header);
                            calendar.splice(0, 1);
                        } else if (moment(calendar[0]).toDate().getTime() - start > 0 || moment(calendar[0]).toDate().getTime() - end < 0) {                                            
                        header.innerHTML = calendar[0];
                        header.style.backgroundColor = "#87CEFA";
                        row.appendChild(header);
                        calendar.splice(0, 1);
                        }                        
                    }
                    else {
                        // if (j === 7){
                        //     break;
                        // }
                        var cell = document.createElement('td')
                        var data = document.createElement('a');
                        var img = document.createElement('img');
                        img.src = logImages[0];
                        data.appendChild(img);
                        cell.appendChild(data);
                        row.appendChild(cell);
                        logImages.splice(0, 1);
                    }
            }
        }
        });
    }


    $scope.deleteGoal = id=>mainSrvc.deleteGoal(id).then(res=>$scope.getGoals($scope.currentUser.id));          
               
    $scope.deleteSavingsGoal = id=>mainSrvc.deleteSavingsGoal(id).then(res=>$scope.getGoals($scope.currentUser.id));            

    $scope.updateProgress = progress=>mainSrvc.updateProgress(progress).then(res => $scope.getGoals($scope.currentUser.id));

    $scope.updateWeight = update=>{mainSrvc.updateWeight(update).then(res=>$scope.getGoals($scope.currentUser.id))}

    $scope.goalMod = function(info){
        let newMom = moment($scope.dates[info.index]).format('MMM D');
        if ($scope.dates[info.index] === "Today"){
            $scope.modifyDay = true;
            $scope.curId = info.goal.goalid;
            mainSrvc.getLogs(info.goal.goalid)
            .then(response=>{
                $scope.clickedDate = response.data.dates[info.index];
                response.data.log_data.map((current, idx)=>{
                    if (current === true){response.data.log_data[idx] = '../images/check.gif';}
                    else if (current === false){response.data.log_data[idx] = '../images/x.gif';}
                    else {response.data.log_data[idx] = '../images/questionmark.gif'}})
                    $scope.curImg = response.data.log_data[info.index]})
            return}
        if (moment(newMom).toDate().getTime()-todayMilli > 0){return}
        $scope.modifyDay = true;
        $scope.curId = info.goal.goalid;
        mainSrvc.getLogs(info.goal.goalid)
        .then(response=>{
            $scope.clickedDate = response.data.dates[info.index];
            response.data.log_data.map((current, idx)=>{
                if (current === true){response.data.log_data[idx] = '../images/check.gif'}
                else if (current === false){response.data.log_data[idx] = '../images/x.gif'}
                else {response.data.log_data[idx] = '../images/questionmark.gif'}})
            $scope.curImg = response.data.log_data[info.index]})
    }
    $scope.updateDate = (update)=>{mainSrvc.updateDate(update).then(response=>$scope.getGoals($scope.currentUser.id))}

    $scope.addSavings = (addition)=>{
        $scope.amount = '';
        mainSrvc.addSavings(addition).then(res=>$scope.getGoals($scope.currentUser.id));
    }
    $scope.showInfo = (id, $event) => {
        var info = document.getElementById("goalInfo" + id);
        if ($event.target.classList[0]==="statusImg"){return}
        info.classList.toggle("goalInfoShow");
        // if (info.classList.length > 1){info.classList.remove("goalInfoShow")} else {info.classList.add("goalInfoShow")}
    }

    $scope.dropdown=()=>{document.getElementById("myDropdown").classList.toggle("show")}

    $scope.logOut = ()=>{mainSrvc.logOut().then(res=>$location.path('/'))}

    angular.element(document).ready(function(){
        let goalClass = document.getElementsByClassName('goalWrapper');
        let goalInfoBox = document.getElementsByClassName('goalInfo');
        let goal = document.getElementsByClassName('goal');
        for(let i=0; i<goalClass.length;i++){
            goalClass[i].addEventListener("mouseover", ()=>{
            goalClass[i].style.boxShadow = "0 0 31px rgba(33,33,33,.2)";
            goalClass[i].style.marginBottom = "2px";
        });
            goalClass[i].addEventListener("mouseleave", ()=>{
            goalClass[i].style.boxShadow = "0 0 15px rgba(33,33,33,.2)";
            goalClass[i].style.marginBottom = "0px";
            });
        }});
});


function allowDrop(ev) {ev.preventDefault()}

function drag(ev) {
    ev.dataTransfer.setData("goaldelete", ev.target.id);
    var trash = document.getElementById("delete");
    trash.src="../images/trash-hover.svg";
}

function drop(ev) {
    ev.preventDefault();
    console.log(ev);
    var data = ev.dataTransfer.getData("goaldelete");
    console.log(data);
    var goalq = document.getElementById(data);
    goalq.classList.add("goalInfo");
    data = Number(data.replace(/goal/, ''));
    $.ajax('/api/deleteGoal', {
        type: 'POST',
        data: JSON.stringify([{id: data}]),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function() { console.log('success');},
        error  : function() { console.log('error');}
})
var trash = document.getElementById("delete");
trash.src="../images/trash.svg";
}




