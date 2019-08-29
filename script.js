const myApp = {};
myApp.triviaUrl = 'https://opentdb.com/api.php?amount=10&type=multiple&category=9';

myApp.getTriviaQuestions = function(){
    $.ajax({
        url: myApp.triviaUrl,
        method: 'GET',
        datatype: 'json',
    }).then(function(result){
        // Note: ajax returns an object that holds 10 arrays
        // Call the function to display the trivia questions in the ui. Pass the "results" array (instead of the parent object) since the 10 arrays are what we care about
        myApp.displayTriviaQuestionsAndChoices(result.results);
        console.log(result.results);
    })
}

myApp.correctAnswerArray = [];

/* Function to display trivia questions */
myApp.displayTriviaQuestionsAndChoices = (arrayOfQuestionObjects) => {
    // TODO: We need to display each result object in the ui
    const multipleChoice = myApp.getChoices(arrayOfQuestionObjects);
    // console.log("this is the thing" , ;
    
    arrayOfQuestionObjects.forEach((questionBlock, index) => {
        myApp.correctAnswerArray.push(questionBlock.correct_answer);

        const displayHTML = `
        <div class="triviaQuestion">
            <h2>${questionBlock.question}</h2>
            <fieldset>
                <input type="radio" name=${[index]} id=${[index]}>
                <label for=${[index]}>${multipleChoice[index][0]}</label>
                
                <input type="radio" name=${[index]} id=${[index]}>
                <label for=${[index]}>${multipleChoice[index][1]}</label>
                <input type="radio" name=${[index]} id=${[index]}>
                <label for=${[index]}>${multipleChoice[index][2]}</label>
                <input type="radio" name=${[index]} id=${[index]}>
                <label for=${[index]}>${multipleChoice[index][3]}</label>
            </fieldset>
        </div>`;
        // console.log(questionBlock.question);
        $('#mainTriviaContainer form').append(displayHTML);
    }); 

    console.log(myApp.correctAnswerArray);
    $('#mainTriviaContainer form').append(`<input type="submit" value="Submit">`);
    
    
    // Call the function to display the choices
    // myApp.displayChoices(arrayOfQuestionObjects);
    console.log(arrayOfQuestionObjects);
}

$('form').on('submit', function(event) {
    event.preventDefault();
    // MO'S CODE THAT WORKS YO
    // const correctAnswers = ["test", "otherTest", "finalTest"];
    // const userAnswers = ["test", "dumbTest", "finalTest"];
    // const finalizedAnswers = [];
    // correctAnswers.forEach((answer, index) => {
    //     if (userAnswers[index] === answer) {
    //         finalizedAnswers.push(userAnswers[index]);
    //         console.log("Holy shit");
    //     }
    // });
    // console.log(finalizedAnswers);
});

/* Function to display the choices */
// myApp.displayChoices = (arrayOfQuestionObjects) => {
    // Store the correct and incorrect answers to an array first. function getChoices will take care of this.
    // console.log("Multiple choice", multipleChoice)

    
    // TODO: Render the choices in the ui
// }

/*
Function to get the choices.
Logic:
1. We have 10 questions.  Each question is stored in an object.
2. Create a multi-dimensional array - an array that will hold the array of choices for each question
3. Randomize the an index where we can insert the correct answer
4. Insert the correct answer to each array
*/
myApp.getChoices = (arrayOfQuestionObjects) => {    
    const choicesArray = [];

    arrayOfQuestionObjects.forEach( (question, index) => {
        // Note: incorrect_answers property data type is an array.  Push the incrrect_answers array to the choicesArray
        choicesArray.push(question.incorrect_answers);

        // Randomize the index position to insert correct answer
        // It appears that incorrect_answers length is always be three. Add 1 since we need to insert the correct answer too.  In the future we can make this dynamic by doing question.incorrect_answers.length + 1
        const randomIndex = Math.floor(Math.random() * 4);

        // Insert the correct answer using the index position generated
        choicesArray[index].splice(randomIndex, 0, question.correct_answer);
        console.log("correct_answer", question.correct_answer, "random index", randomIndex);


        // Call getCorrectAnswers
        // myApp.getCorrectAnswers(question.correct_answer);
    });

    return choicesArray;
}

/*TODO: Store the correct answers to an array for score evaluation later*/
myApp.getCorrectAnswers = (correctAnswer) => {
    
}

myApp.init = function(){
    myApp.getTriviaQuestions();
    
}

$(document).ready(function(){
    myApp.init();
});