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
var maxPoints
var $intro
var $modal

function shuffle(categories) {
    for (let i = categories.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [categories[i - 1], categories[j]] = [categories[j], categories[i - 1]];
    }
    return categories.slice(0, 6)
}

function addNames(){
  $(`.player1-name`).text(player1.name)
  $(`.player2-name`).text(player2.name)
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
  addNames()
  createButtons()
  createEventListener()
}


function submit(){
  let categoryId = $('.cat-clicked')[0].dataset.catid
  difficulty = $('.diff-clicked')[0].dataset.diffid
  let link = `http://battleofwitshelper.herokuapp.com/trivia/${categoryId}x${difficulty.toLowerCase()}`
  $.ajax({
    url: link,
    method: 'GET',
    }).done(function(jsonp){
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
    timerEnd()
    endRound()
  }
}

function stopTimer(){
  clearInterval(intervalID)
}

/// End Timer ///

function timerEnd(){
  $('div.timer-div').append("<img src=images/trump.jpg></img>")
  setTimeout(function(){
    $('audio#wrong')[0].play()
  }, 300)
  setTimeout(function(){
    $('img').remove()
  }, 1000)
}

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
  if (currentPlayer.points >= maxPoints){
    endGame()
    return
  }
  switchPlayers()
  setTimeout(runner, 2000)
}

function endGame(){
  $('.timer-div').append(`<h1 class="scale-transition scale-out winner">${currentPlayer.name} wins!</h1>`)
  $('.winner').delay(2000).queue(function(){
    $('.winner').addClass('scale-in')
  })
  setTimeout(function(){
    $('.timer-div h1').remove()
    $intro.appendTo('.main-div')
    $modal.appendTo('body')
    player1.points = 0
    player2.points = 0
    $(`.player1-points`).text('0')
    $(`.player2-points`).text('0')
    currentPlayer = player1
  }, 5000)

}

function switchPlayers(){
  if (currentPlayer === player1) {
    currentPlayer = player2
  } else {
    currentPlayer = player1
  }
}

// function correctAnswer(){
//   currentPlayer.points += diffVal()
//   $(`.player${currentPlayer.id}-points`).text(currentPlayer.points)
//   $('div.timer-div').append("<img src=images/Satisfied.jpg></img>")
//   correctSound()
//   setTimeout(function(){
//     $('img').remove()
//   }, 1500)
// }
function correctAnswer(){
  currentPlayer.points += diffVal()
  $(`.player${currentPlayer.id}-points`).text(currentPlayer.points)
  $('div.timer-div').append("<h2 class='correct'>Correct!</h2>")
  $('audio#correct')[0].play()
  // correctSound()
  setTimeout(function(){
    $('.correct').remove()
  }, 2000)
}

function correctSound(){
  let sounds = shuffle(['educated', 'potential', 'words'])
  $(`audio#${sounds[0]}`)[0].play()
}

// function (){
//   $('div.timer-div').append("<img src=images/trump.jpg></img>")
//   setTimeout(function(){
//     $('audio#wrong')[0].play()
//   }, 300)
//   setTimeout(function(){
//     $('img').remove()
//   }, 1000)
// }
function wrongAnswer(){
  $('div.timer-div').append("<h2 class='correct-answer'>The correct answer was</h2>")
  $('audio#incorrect')[0].play()
  setTimeout(function(){
    $('div.timer-div').append(`<h2 class='correct-answer'>${question[0].correct_answer}</h2>`)
  }, 600)
  setTimeout(function(){
    $('.correct-answer').remove()
  }, 2000)
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

function ptsButtons(){
  $('.pointswin').on('click', function(){
    $('audio#pop')[0].play()
    $('.pointswin').removeClass("pts-clicked darken-4")
    $(this).addClass("pts-clicked darken-4")
  })
}

$(document).ready(function(){
  $(`audio#feud`)[0].play()
  $intro = $('.intro')
  $modal = $('.modal')
  ptsButtons()
  $('.modal-btn').on('click', function(){
    $('.modal').css("visibility", "")
  })

  $('.modal').modal({
     dismissible: false,
     opacity: .5,
     inDuration: 300,
     outDuration: 200,
     startingTop: '4%',
     endingTop: '10%',
     complete: function() {
       player1.name = $('#player1Name').val()
       player2.name = $('#player2Name').val()
       maxPoints = parseInt($('.pts-clicked').text())
       $('.intro').detach()
       $('.modal').detach()
       $(`audio#feud`)[0].pause()
       $(`audio#feud`)[0].currentTime = 0
       runner();
      }
    }
    )
  });




  var TxtType = function(el, toRotate, period) {
          this.toRotate = toRotate;
          this.el = el;
          this.loopNum = 0;
          this.period = parseInt(period, 10) || 2000;
          this.txt = '';
          this.tick();
          this.isDeleting = false;
      };

      TxtType.prototype.tick = function() {
          var i = this.loopNum % this.toRotate.length;
          var fullTxt = this.toRotate[i];

          if (this.isDeleting) {
          this.txt = fullTxt.substring(0, this.txt.length - 1);
          } else {
          this.txt = fullTxt.substring(0, this.txt.length + 1);
          }

          this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

          var that = this;
          var delta = 200 - Math.random() * 100;

          if (this.isDeleting) { delta /= 2; }

          if (!this.isDeleting && this.txt === fullTxt) {
          delta = this.period;
          this.isDeleting = true;
          } else if (this.isDeleting && this.txt === '') {
          this.isDeleting = false;
          this.loopNum++;
          delta = 500;
          }

          setTimeout(function() {
          that.tick();
          }, delta);
      };

      window.onload = function() {
          var elements = document.getElementsByClassName('typewrite');
          for (var i=0; i<elements.length; i++) {
              var toRotate = elements[i].getAttribute('data-type');
              var period = elements[i].getAttribute('data-period');
              if (toRotate) {
                new TxtType(elements[i], JSON.parse(toRotate), period);
              }
          }
      };
