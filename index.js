var categories = [[9, "General Knowledge"], [10, "Books"], [11, "Film"], [12, "Music"], [13, "Musical Theater"], [14, "Television"], [15, "Video Games"], [16, "Board Games"], [17, "Nature"], [18, "Computers"], [19, "Math"], [20, "Mythology"], [21, "Sports"], [22, "Geography"], [23, "History"], [24, "Politics"], [25, "Art"], [26, "Celebrities"], [27, "Animals"], [28, "Vehicles"], [29, "Comics"], [30, "Gadgets"], [32, "Cartoons"]]
var difficulties = ["Easy", "Medium", "Hard"]
var question
var choices
var seconds
var intervalID

function shuffle(categories) {
    for (let i = categories.length; i; i--) {
        let j = Math.floor(Math.random() * i);
        [categories[i - 1], categories[j]] = [categories[j], categories[i - 1]];
    }
    return categories.slice(0, 6)
}

function createButtons(){
  let sixCategories = shuffle(categories)
  let firstRow = sixCategories.slice(0, 3)
  let secondRow = sixCategories.slice(3, 6)
  firstRow.forEach(function(e){
    $('div.firstRow').append(`<button class="waves-effect waves-light btn blue lighten-2 category" data-catid=${e[0]}>${e[1]}</button>`)
  })
  secondRow.forEach(function(e){
    $('div.secondRow').append(`<button class="waves-effect waves-light btn blue lighten-2 category" data-catid=${e[0]}>${e[1]}</button>`)
  })
  difficulties.forEach(function(e){
    $('div.difficultyRow').append(`<button class="waves-effect waves-light btn blue lighten-2 difficulty" data-diffid=${e.toLowerCase()}>${e}</button>`)
  })
  $('div.submitRow').append(`<button class="waves-effect waves-light btn blue lighten-2 submit">Go!</button>`)
}

function createEventListener(){
  $(".category").on('click', function(){
    $(".category").removeClass("cat-clicked")
    $(this).addClass("cat-clicked")
  })
  $(".difficulty").on('click', function(){
    $(".difficulty").removeClass("diff-clicked")
    $(this).addClass("diff-clicked")
  })
  $(".submit").on('click', function(){
    //search for clicked classes or else do not proceed
    submit()
  })
}

function runner(){
  createButtons()
  createEventListener()
}

function submit(){
  let categoryId = $('.cat-clicked')[0].dataset.catid
  let difficulty = $('.diff-clicked')[0].dataset.diffid
  let link = `http://www.opentdb.com/api.php?amount=1&category=${categoryId}&difficulty=${difficulty}&type=multiple`
  $.ajax({
    url: link,
    method: 'GET'}).done(function(jsonp){
      question = jsonp.results
      randomChoices()
    }).fail(function(err) {
      throw err
    })

  // clearPage()
  startTimer()
    //show question / choices, countdown timer, etc

}

function clearPage(){
  $('btn.category').hide()
}

function randomChoices() {
  choices = [question[0].correct_answer,...question[0].incorrect_answers]
  shuffle(choices)
}

/// Start Timer ///

function startTimer() {
  seconds = 30
  $('div.timer').append(`<p class="timer">:${seconds}</p>`)
  intervalID = setInterval(countDown, 1000)
}

function countDown() {
  seconds--
  $('p.timer').replaceWith(`<p class="timer">:${seconds}</p>`)
  if (seconds < 1) {
    stopTimer(intervalID)
  }
}

function stopTimer(){
  clearInterval(intervalID)
}

/// End Timer ///


$(document).ready(runner)
