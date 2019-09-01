const myApp = {};
myApp.triviaUrl = 'https://opentdb.com/api.php?amount=10&type=multiple';

myApp.getTriviaQuestions = function (choice) {
    $.ajax({
        url: myApp.triviaUrl,
        method: 'GET',
        datatype: 'json',
        data: {
            category: choice
        },
        beforeSend: function() {
            $('.lds-roller').show();
        },
        complete: function() {
            $('.lds-roller').hide();
        }
    }).then(function (result) {
        // Note: ajax returns an object that holds 10 arrays
        // Call the function to display the trivia questions in the ui. Pass the "results" array (instead of the parent object) since the 10 arrays are what we care about
        myApp.displayTriviaQuestionsAndChoices(result.results);
        console.log("result.results", result.results);
    }).fail(function (error) {
        // TODO: Display message in the UI
    })
}

myApp.userAnswers = [];
myApp.correctAnswerArray = [];
myApp.finalizedAnswers = [];

myApp.changeCategory = function () {
    $('select').on('change', function () {
        chosenCategory = $('option:selected').val();
        console.log("Chosen category", chosenCategory);

        $('.questionsForm').empty();

        myApp.getTriviaQuestions(chosenCategory);

        myApp.correctAnswerArray = [];
    })
}

/* A function to decode the characters returned by the API i.e. #&039; for single quote into ' */
myApp.htmlDecode = function (value) {
    return $("<textarea/>").html(value).text();
}
/* Function to display trivia questions */
myApp.displayTriviaQuestionsAndChoices = (arrayOfQuestionObjects) => {
    //Display each result object in the ui
    const multipleChoice = myApp.getChoices(arrayOfQuestionObjects);

    arrayOfQuestionObjects.forEach((questionBlock, index) => {
        myApp.correctAnswerArray.push(myApp.htmlDecode(questionBlock.correct_answer));

        const displayHTML = `
        <div class="triviaQuestion">
            <h2>${index + 1}.  ${questionBlock.question}</h2>
            <div class="fieldContainer" role="group">
                <div class='optGroup1'>
                    <label class='labelRadioContainer'>
                        <input type="radio" name='ans${[index]}' id='a${[index]}' class='radioButton' value="${multipleChoice[index][0]}"> 
                        <span class="checkMark"></span>
                        ${multipleChoice[index][0]}
                    </label>
                
                    <label class='labelRadioContainer'>
                        <input type="radio" name='ans${[index]}' id='b${[index]}' class='radioButton' value="${multipleChoice[index][1]}"> 
                        <span class="checkMark"></span>
                        ${multipleChoice[index][1]}
                    </label>
                </div>

                <div class='optGroup2'>
                    <label class='labelRadioContainer'>
                        <input type="radio" name='ans${[index]}' id='a${[index]}' class='radioButton' value="${multipleChoice[index][2]}"> 
                        <span class="checkMark"></span>
                        ${multipleChoice[index][2]}
                    </label>
        
                    <label class='labelRadioContainer'>
                        <input type="radio" name='ans${[index]}' id='b${[index]}' class='radioButton' value="${multipleChoice[index][3]}"> 
                        <span class="checkMark"></span>
                        ${multipleChoice[index][3]}
                    </label>
                </div>
            </div>
        </div>`;

        $('#mainTriviaContainer form').append(displayHTML);
    });

    // Add Submit Button
    $('#mainTriviaContainer form').append(`<input type="submit" value="Submit" class="finalSubmit">`);

    console.log("myApp.correctAnswerArray", myApp.correctAnswerArray);
    console.log("arrayOfQuestionsObjects", arrayOfQuestionObjects);
}

$('form').on('submit', function (event) {
    event.preventDefault();

    $("input:checked").each(function () {
        let userChoice = this.value;
        myApp.userAnswers.push(userChoice);
        console.log("myApp.userAnswers", myApp.userAnswers);
    })

    myApp.correctAnswerArray.forEach((answer, index) => {
        if (myApp.userAnswers[index] === answer) {
            myApp.finalizedAnswers.push(myApp.userAnswers[index]);
        }
    });

    console.log("finalizedAnswer", myApp.finalizedAnswers);

    if (myApp.userAnswers.length !== myApp.correctAnswerArray.length) {
        $('.resultMessage').html(`<h2>Please answer all the questions before submitting.`);
        myApp.userAnswers = [];
    } else {
        $('.resultMessage').html(`
    <h2>You got ${myApp.finalizedAnswers.length} questions out of 10 correct!</h2>`);
        $('form').off('submit');
        $('form input[type=submit]').val("Reset Quiz");
    };
});

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

    arrayOfQuestionObjects.forEach((question, index) => {
        // Note: incorrect_answers property data type is an array.  Push the incrrect_answers array to the choicesArray
        choicesArray.push(question.incorrect_answers);

        // Randomize the index position to insert correct answer
        // It appears that incorrect_answers length is always be three. Add 1 since we need to insert the correct answer too.  In the future we can make this dynamic by doing question.incorrect_answers.length + 1
        const randomIndex = Math.floor(Math.random() * 4);

        // Insert the correct answer using the index position generated
        choicesArray[index].splice(randomIndex, 0, question.correct_answer);

        console.log("correct_answer", question.correct_answer, "random index", randomIndex);
    });

    return choicesArray;
}

myApp.init = function () {
    // By default this will display General Knowledge category
    myApp.getTriviaQuestions(9);

    // Start listening if the user changes the Trivia category
    myApp.changeCategory();
}

$(document).ready(function () {
    myApp.init();
});