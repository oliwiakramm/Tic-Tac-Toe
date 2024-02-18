$(document).ready(function () {
  const $game = $(".game");
  const $main = $(".main");
  const $outcomeEl = $(".game__outcome");
  const $gameInfo = $(".game__info");

  let player1Mark = "X";
  let gameMode = undefined;
  let turn = "X";
  let moves = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ];
  let win = false;
  let winnersMark = "";
  let xScore = 0;
  let oScore = 0;
  let tie = false;
  let tieScore = 0;

  $(".markBtn").on("click", function () {
    $(".markBtn").removeClass("active");
    $(this).addClass("active");
    player1Mark = $(this).attr("data-mark");
  });

  $(".startBtn").on("click", function () {
    gameMode = $(this).attr("id");
    gameMode == "player" ? playersMode() : cpuMode();
  });

  //PLAYER VS CPU

  function cpuMode() {
    let cpuMove = false;
    showBoard();
    checkPlayer("(You)", "(Cpu)");
    player1Mark == "X" ? (cpuMove = false) : (cpuMove = true);
    if (cpuMove) {
      $(".game__board").css("pointer-events", "none");
      cpuMoveFn();
    }
  }

  function cpuMoveFn() {
    let indexMove = Math.floor(Math.random() * (8 - 0 + 1) + 0);
    if (moves.flat().at(indexMove) == "") {
      markMove(indexMove);
      setTimeout(() => {
        $(".game__tile").eq(indexMove).addClass(`turn${turn} marked`);
        $(".game__board").css("pointer-events", "all");
        checkResults();
        switchTurns();
      }, 800);
    } else {
      if (moves.flat().filter((el) => el == "").length == 0) return;
      cpuMoveFn();
    }
  }

  //PLAYER VS PLAYER MODE

  function playersMode() {
    checkPlayer("(P1)", "(P2)");
    showBoard();
  }

  function checkPlayer(play1, play2) {
    if (player1Mark == "X") {
      $(".game__results--x .game__player").text(play1);
      $(".game__results--o .game__player").text(play2);
    } else {
      $(".game__results--x .game__player").text(play2);
      $(".game__results--o .game__player").text(play1);
    }
  }

  function showBoard() {
    $(".start").fadeOut(500);
    setTimeout(function () {
      $game.css("display", "block");
      $game.animate({ opacity: 1 }, "slow");
    }, 500);
  }

  //MARKING TILES WITH X OR O AND SHOWING RESULTS
  $(".game__tile").on("click", function () {
    $(this).addClass(`turn${turn} marked`);
    const tileIndex = $(".game__tile").index(this);
    markMove(tileIndex);
    checkResults();
    switchTurns();

    if (gameMode == "cpu" && !win && !tie) {
      $(".game__board").css("pointer-events", "none");
      cpuMoveFn();
    }
  });

  function switchTurns() {
    $game.removeClass(`turn${turn}`);
    turn == "X" ? (turn = "O") : (turn = "X");
    $game.addClass(`turn${turn}`);
  }

  //MARK A MOVE IN ARRAY
  function markMove(index) {
    for (let i = 0; i < 3; i++) {
      if (index > 2 && index <= 5) {
        i++;
      } else if (index > 5) {
        i += 2;
      }
      moves[i][index % 3] = turn;
      break;
    }
  }

  function checkResults() {
    checkWin();
    checkTie();
    if (win) showResults();
    if (tie) showResults();
  }
  //CHECK WHO WON
  function checkWin() {
    win = false;
    tie = false;

    //check for horizontal win
    for (let i = 0; i < 3; i++) {
      if (
        moves[i][0] === moves[i][1] &&
        moves[i][0] === moves[i][2] &&
        moves[i][0] !== ""
      ) {
        win = true;
        winnersMark = moves[i][i];
        return;
      }
    }

    //check for vertical wins
    for (let i = 0; i < 3; i++) {
      if (
        moves[0][i] === moves[1][i] &&
        moves[0][i] === moves[2][i] &&
        moves[0][i] !== ""
      ) {
        win = true;
        winnersMark = moves[0][i];
        return;
      }
    }

    //check for diagonal wins
    if (
      moves[0][0] === moves[1][1] &&
      moves[0][0] === moves[2][2] &&
      moves[0][0] !== ""
    ) {
      win = true;
      winnersMark = moves[0][0];
    } else if (
      moves[0][2] === moves[1][1] &&
      moves[0][2] === moves[2][0] &&
      moves[0][2] != ""
    ) {
      win = true;
      winnersMark = moves[0][2];
    }

    return;
  }

  function checkTie() {
    const blankMoves = moves.flat().filter((el) => el == "");
    blankMoves.length == 0 && !win ? (tie = true) : (tie = false);
  }

  function showResults() {
    $outcomeEl.removeClass("won show");

    if (win) {
      $outcomeEl.addClass("won");

      if (winnersMark == "X") {
        xScore++;
        showWinnerResults(winnersMark, xScore, "#31c3bd");
      } else {
        oScore++;
        showWinnerResults(winnersMark, oScore, "#f2b137");
      }

      if (gameMode == "cpu") {
        let cpuMark;
        player1Mark == "X" ? (cpuMark = "O") : (cpuMark = "X");
        if (winnersMark == cpuMark) {
          $(".game__won").text("Cpu wins!");
        } else {
          $(".game__won").text("You win!");
        }
      } else {
        if (winnersMark == player1Mark) {
          $(".game__won").text("Player 1 wins!");
        } else {
          $(".game__won").text("Player 2 wins!");
        }
      }

      $main.addClass("showOutcome");
    }

    if (tie) {
      tieScore++;
      $(".game__results--ties .game__score").text(tieScore);
      $(".game__bigText").text("round tied");
      $main.addClass("showOutcome");
    }

    setTimeout(function () {
      $outcomeEl.addClass("show");
    }, 200);
  }

  function showWinnerResults(mark, score, color) {
    $(`.game__results--${mark.toLowerCase()} .game__score`).text(score);
    $gameInfo.css("color", color);
    $gameInfo.find(`.${mark.toLowerCase()}`).css("display", "block");
    mark == "X"
      ? $gameInfo.find(".o").css("display", "none")
      : $gameInfo.find(".x").css("display", "none");
  }

  //NEXT ROUND
  $(".btn--nextRound").on("click", function () {
    let finishGame = false;
    resetRound(finishGame);
  });

  function resetRound(gameState) {
    turn = "X";
    moves = moves.map((arr) => arr.map((el) => (el = "")));
    win = false;
    winnersMark = "";
    tie = false;

    $game.attr("class", "");
    $game.addClass(`game turn${turn}`);

    $outcomeEl.removeClass("show");
    setTimeout(() => {
      $main.removeClass("showOutcome");
    }, 500);

    $(".game__tile").each(function () {
      $(this).attr("class", "");
      $(this).addClass("game__tile");
    });

    if (gameMode == "cpu" && !gameState) {
      cpuMode();
    }
  }

  //QUIT BTN - SHOW BEGINNING
  $(".btn--quit").on("click", function () {
    let finishGame = true;
    resetRound(finishGame);
    resetScoreNshowStart();
  });

  //RESET ALL
  function resetScoreNshowStart() {
    xScore = 0;
    oScore = 0;
    tieScore = 0;
    gameMode = undefined;

    $game.fadeOut(700);

    setTimeout(function () {
      $(".start").css("display", "flex");
      $(".start").animate({ opacity: 1 }, "slow");
    }, 800);

    $(`.game__results--x .game__score`).text(xScore);
    $(`.game__results--o .game__score`).text(oScore);
    $(".game__results--ties .game__score").text(tieScore);

    $(".markBtn--X").addClass("active");
    $(".markBtn--O").removeClass("active");
  }

  $(".game__restartBtn").on("click", function () {
    $outcomeEl.removeClass("won show");
    $(".game__bigText").text("restart game ?");
    $(".btn--quit, .btn--nextRound").addClass("hide");
    $(".btn--cancel, .btn--restart").removeClass("hide");

    setTimeout(function () {
      $outcomeEl.addClass("show");
      $main.addClass("showOutcome");
    }, 200);
  });

  //RESTART ROUND - SHOW START
  $(".btn--restart").on("click", function () {
    let finishGame = true;
    resetRound(finishGame);
    resetScoreNshowStart();
    switchBtns();
  });

  //COME BACK TO GAME
  $(".btn--cancel").on("click", function () {
    $outcomeEl.removeClass("show");
    $main.removeClass("showOutcome");
    switchBtns();
  });

  function switchBtns() {
    setTimeout(() => {
      $(".btn--quit, .btn--nextRound").removeClass("hide");
      $(".btn--cancel, .btn--restart").addClass("hide");
    }, 300);
  }
});
