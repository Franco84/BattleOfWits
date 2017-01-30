var categories = [[9, "General Knowledge"], [10, "Books"], [11, "Film"], [12, "Music"], [13, "Musical Theater"], [14, "Television"], [15, "Video Games"], [16, "Board Games"], [17, "Nature"], [18, "Computers"], [19, "Math"], [20, "Mythology"], [21, "Sports"], [22, "Geography"], [23, "History"], [24, "Politics"], [25, "Art"], [26, "Celebrities"], [27, "Animals"], [28, "Vehicles"], [29, "Comics"], [30, "Gadgets"], [32, "Cartoons"]]
var difficulties = ["Easy", "Medium", "Hard"]
var question
var choices
var seconds
var intervalID
var player1 = {"points": 0, "name": "Player 1", "id": 1}
var player2 = {"points": 0, "name": "Player 2", "id": 2}
var currentPlayer = player1
var difficulty
var submitted = false

function shuffle(categories) {
    for (let i = categories.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [categories[i - 1], categories[j]] = [categories[j], categories[i - 1]];
    }
    return categories.slice(0, 6)
}

function createButtons(){
  $('div.timer-div').append(`<p style="color: #ffffff">${currentPlayer.name}</p>`).hide()
  let sixCategories = shuffle(categories)
  let firstRow = sixCategories.slice(0, 3)
  let secondRow = sixCategories.slice(3, 6)
  firstRow.forEach(function(e){
    $('div.firstRow').append(`<button class="btn-large blue lighten-2 category" data-catid=${e[0]}>${e[1]}</button>`).hide()
  })
  secondRow.forEach(function(e){
    $('div.secondRow').append(`<button class="btn-large blue lighten-2 category" data-catid=${e[0]}>${e[1]}</button>`).hide()
  })
  difficulties.forEach(function(e){
    $('div.difficultyRow').append(`<button class="btn-large blue lighten-2 difficulty" data-diffid=${e}>${e}</button>`).hide()
  })
  $('div.submitRow').append(`<button class="waves-effect waves-light btn-large blue lighten-2 submit">Go!</button>`).hide()
  $('div').fadeIn(750)
}

function createEventListener(){

  $("div.row").on('click', '.category, .difficulty, .answer', function(){
    $('audio#pop')[0].play()
  })
  $("div.row").on('click', '.submit', function(){
    $('audio#chime')[0].play()
  })

  $(".category").on('click', function(){
    $(".category").removeClass("cat-clicked darken-4")
    $(this).addClass("cat-clicked darken-4")
  })
  $(".difficulty").on('click', function(){
    $(".difficulty").removeClass("diff-clicked darken-4")
    $(this).addClass("diff-clicked darken-4")
  })
  $(".submit").on('click', function(){
    //search for clicked classes or else do not proceed
    difficulty = $(".diff-clicked").textContent
    if (submitted === false){
      submitted = true
      submit()
    }
  })
}

function runner(){
  createButtons()
  createEventListener()
}

function submit(){
  let categoryId = $('.cat-clicked')[0].dataset.catid
  difficulty = $('.diff-clicked')[0].dataset.diffid
  let link = `http://www.opentdb.com/api.php?amount=1&category=${categoryId}&difficulty=${difficulty.toLowerCase()}&type=multiple`
  $.ajax({
    url: link,
    method: 'GET'}).done(function(jsonp){
      question = jsonp.results
      randomChoices()
      clearPage()
      setTimeout(showQuestion, 750)
      setTimeout(startTimer, 750)
      setTimeout(createAnswerListener, 751)
    }).fail(function(err) {
      throw err
    })
    // show question / choices, countdown timer, etc
}

function randomChoices() {
  choices = [question[0].correct_answer,...question[0].incorrect_answers]
  shuffle(choices)
}

function clearPage(){
  $('button, p').fadeOut(750)
  setTimeout(function(){
    $('button, p').remove()
  }, 750)
}

function clearQuestionPage(){
  // $('button.answer, button.submit, h3.timer, p').fadeOut(750)
  // setTimeout(function(){
    $('button.answer, .button-div, button.submit, h3.timer, p').remove()
  // }, 750)
}


/// Start Timer ///

function startTimer() {
  seconds = 30
  $('div.timer-div').append(`<h3 class="timer">${seconds}</h3>`)
  intervalID = setInterval(countDown, 1000)
}

function countDown() {
  seconds--
  $('h3.timer').replaceWith(`<h3 class="timer">${seconds}</h3>`)
  if (seconds <= 5) {
    $("h3.timer").addClass('redtimer')
  }
  if (seconds < 1) {
    stopTimer(intervalID)
  }
}

function stopTimer(){
  clearInterval(intervalID)
}

/// End Timer ///

function showQuestion(){
  $('div.firstRow').append(`<p>${question[0].question}</p>`)
  $('div.difficultyRow').append(`<button class="waves-effect waves-light btn blue lighten-2 scale-transition scale-out submit">Final Answer!</button>`)
  $('div.firstRow')
  choices.forEach(function(e, index){
    $('div.secondRow').append(`<div class="buttonid${index} scale-transition scale-out button-div"></div>`)
    $(`.buttonid${index}`).append(`<button class="btn-large blue lighten-2 answer" id=${index}>${e}</button>`)
    scaleIn(index)
  })
  $('.submit').delay(2500).queue(function(){
    $(this).addClass('scale-in')
    $('audio#woosh')[0].play()
  })
}

function scaleIn(index){
  $(`.buttonid${index}`).delay(500*(index+1)).queue(function(){
    $(this).addClass('scale-in')
    $('audio#woosh')[0].play()
  })
}

function createAnswerListener(){
  $(".answer").on('click', function(){
    $(".answer").removeClass("answer-clicked darken-4")
    $(this).addClass("answer-clicked darken-4")
  })
  $(".submit").on('click', function(){
    //search for clicked classes or else do not proceed
    submitAnswer()
  })
}

function submitAnswer(){
  if ($(".answer-clicked")[0].textContent === question[0].correct_answer){
    correctAnswer()
  } else {
    wrongAnswer()
  }
  endRound()
}

function endRound() {
  clearQuestionPage()
  stopTimer()
  submitted = false
  checkEndGame()
  switchPlayers()
  setTimeout(runner, 1500)
}

function checkEndGame(){
  // if (currentPlayer.points >= final)
}

function switchPlayers(){
  if (currentPlayer === player1) {
    currentPlayer = player2
  } else {
    currentPlayer = player1
  }
}

function correctAnswer(){
  currentPlayer.points += diffVal()
  $(`.player${currentPlayer.id}-points`).text(currentPlayer.points)
  $('div.timer-div').append("<img src=images/Satisfied.jpg></img>")
  correctSound()
  setTimeout(function(){
    $('img').remove()
  }, 1500)
}

function correctSound(){
  let sounds = shuffle(['educated', 'potential', 'words'])
  $(`audio#${sounds[0]}`)[0].play()
}

function wrongAnswer(){
  $('div.timer-div').append("<img src=images/trump.jpg></img>")
  setTimeout(function(){
    $('audio#wrong')[0].play()
  }, 300)
  setTimeout(function(){
    $('img').remove()
  }, 1000)
}

function diffVal(){
  if (difficulty === "Easy"){
    return 1
  } else if (difficulty === "Medium") {
    return 2
  } else if (difficulty === "Hard") {
    return 3
  }
}

// $(document).ready(function(){
//   $('.modal-trigger').leanModal()
// }

$(document).ready(function(){
  // the "href" attribute of .modal-trigger must specify the modal ID that wants to be triggered
  $('.modal').modal({
     dismissible: false, // Modal can be dismissed by clicking outside of the modal
     opacity: .5, // Opacity of modal background
     inDuration: 300, // Transition in duration
     outDuration: 200, // Transition out duration
     startingTop: '4%', // Starting top style attribute
     endingTop: '10%', // Ending top style attribute
     ready: function(modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.
      //  alert("Ready");
       console.log(modal, trigger);
     },
    //  complete: function() { alert('Closed'); } // Callback for Modal close
   }
 );
  $('.modal-btn').on('click', function(){
    $('.modal').css("visibility", "")
  })
});


$(document).ready(runner)
