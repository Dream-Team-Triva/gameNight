const myApp = {};
myApp.triviaUrl = 'https://opentdb.com/api.php?amount=10&type=multiple&category=9';
myApp.getTriviaQuestions = function(){
    $.ajax({
        url: myApp.triviaUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(result){
        console.log(result);
    })
}

myApp.init = function(){
    myApp.getTriviaQuestions();
}

$(document).ready(function(){
    myApp.init();
});