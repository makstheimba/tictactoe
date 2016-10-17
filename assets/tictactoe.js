$(window).resize(function () {
    var fontSize = $("#playField").width() * 0.3 + "px";
    $(".content").css("font-size", fontSize);
});

var tictactoe = function (players) {
    var nextMarker = {"X": "O", "O": "X"},
        field = Array(9),
        currentMarker = "X",
        currentPlayer = players.markerToPlayer[currentMarker],
        celebrationLength = 2000,
        winState,
        ultimateChoice,
        winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
        self = {};    
    minimax.fieldCache = {};
    
    field.disable = function () {
        field.forEach(function (cell, i){
            if (!cell){
                $("#cell"+i).off("click");
            }
        });
    }
    field.enable = function () {
        field.forEach(function (cell, i){
            if (!cell){                
                $("#cell"+i).on("click", function () {
                    $(this).find(".content").html(currentMarker);
                    $(this).addClass(currentPlayer);
                    $(this).off("click").removeClass("emptyCell");
                    setMarker($(this).attr("id").slice(-1)); // Set value to a chosen cell on a field
                });
            }
        });
    }
    field.clear = function () {
        field.fill("").forEach(function (_, i) {
            var cellId = "#cell" + i;
            $(cellId).off("click").addClass("emptyCell"); //Clear previous clicks
            $(cellId).find(".content").html(""); //Empty all cells
            $(cellId).removeClass("bluePlayer redPlayer"); // Remove color markers
        });
    }
    
    function isMarkerInPlace(place) {
        return field[place] === currentMarker;
    }
    
    function score(field, isWin, winMarker){
      if (isWin) {
        if (winMarker === players.botMarker){
            return 1;
        } else {
            return -1;
        }
      } else { // Tie
        return 0;
      }
    }
    
    function minimax(field, currentMarker) {
        var scores = [],
            moves = [],
            newField,
            prevMarker = nextMarker[currentMarker],
            isWin = winConditions.some(function(state) {
                return state.every(i=>field[i] === prevMarker);
            });

        if (isWin || field.every(cell => cell !== "")) {
            return score(field, isWin, prevMarker);
        }        
        // Trace all available moves
        field.forEach(function(cell, i) {
            if (cell === ""){
                newField = field.slice();
                newField[i] = currentMarker;
                scores.push(minimax(newField, nextMarker[currentMarker]));
                moves.push(i);
            }
        });
        if (currentMarker === players.botMarker) {
            ultimateChoice = moves[scores.indexOf(Math.max(...scores))];
            return Math.max.apply(null, scores);
        } else {
            ultimateChoice = moves[scores.indexOf(Math.min(...scores))];
            return Math.min.apply(null, scores);
        }

    }
    
    function botTurn() {
        field.disable();
        if (field.every(e => e === "")) {
            ultimateChoice = 2;
        } else if (minimax.fieldCache.hasOwnProperty(field)) {
            console.log("Time saved");
            ultimateChoice = minimax.fieldCache[field];
        } else {            
            minimax(field, currentMarker);
        }
        // Memoization for field with more then 7 empty cells
        if (!minimax.fieldCache.hasOwnProperty(field) && field.filter(e => e === "").length > 7) {
            minimax.fieldCache[field] = ultimateChoice;
        }
        console.log(minimax.fieldCache);
        field.enable();
        $("#cell"+ultimateChoice).trigger("click");
    }
    
    function celebrate(winState) {
        var winner = currentPlayer;
        players.score[winner] += 1;
        // Highlight the winner
        $("#" + winner).addClass(winner+"Wins");
        // Highlight winning combination
        winState.forEach(function(i) {
           $("#cell"+i).removeClass(winner).addClass(winner+"Marker");
        });
        // Take some time for celebration and remove highlights after
        setTimeout(function () {
            $("#" + winner).removeClass(winner+"Wins");
            winState.forEach(function(cellId) {
               $("#cell"+cellId).removeClass(winner+"Marker");
            });
            self.newGame();                    
        }, celebrationLength);
        field.disable();
        
    }
    function testWinner() {
        var winState = undefined;
        winConditions.some(function (state) { // Test if all places on a field for a certain win condition occupied with the same element            
            if (state.every(i=>field[i] === currentMarker)) {
                winState = state;
                return true;
            }
        });
        return winState;
    }
    function setMarker(place) {
        field[place] = currentMarker;
        winState = testWinner(field);
        $("#"+currentPlayer).removeClass(currentPlayer+"Active");
        if (winState) {
            celebrate(winState);            
        } else if (field.every(function (elem) {return elem !== ""; })){ // Tie
            setTimeout(self.newGame, celebrationLength);
        } else {
            currentMarker = nextMarker[currentMarker];
            currentPlayer = players.markerToPlayer[currentMarker];
            $("#"+currentPlayer).addClass(currentPlayer+"Active");
            if (players.botMarker === currentMarker){
                botTurn();
            }
        }
    }
    
    self.newGame = function () {
        winState = undefined;
        // Update score
        $("#redPlayer").html(players.score.redPlayer);
        $("#bluePlayer").html(players.score.bluePlayer);
        $("#"+currentPlayer).addClass(currentPlayer+"Active");
        
        field.clear();
        field.enable();
        
        if (players.botMarker === currentMarker) {
            botTurn();
        }
    };
    self.resetScore = function () {
        players.score.redPlayer = players.score.bluePlayer = 0;
        $("#redPlayer").html(players.score.redPlayer);
        $("#bluePlayer").html(players.score.bluePlayer);
    };
    return self;
};

$(document).ready(function () {
   var players = {score: {"redPlayer": 0, "bluePlayer": 0}, markerToPlayer: {}, botMarker: ""},
       game;
    $(".startScreen").on("click", function () {
        $(this).fadeOut(600, function () {
            $(".optionsScreen").fadeIn();
        });
    });
    $("#startBtn").on("click", function () {
        $(".startScreen").fadeOut(600, function () {
            $(".optionsScreen").fadeIn();
        });
    });
    $("#pickColorBtn").on("click", function () {
        if ($(this).html() === "Red") {
            $(this).html("Blue");
        } else $(this).html("Red");
    });
    $("#pickMarkerBtn").on("click", function () {
        if ($(this).html() === "X") {
            $(this).html("O");
        } else $(this).html("X");
    });
    $("#pickOpponentBtn").on("click", function () {
        if ($(this).html() === "1P") {
            $(this).html("2P");
        } else $(this).html("1P");
    });
    $("#startGameBtn").on("click", function () {
        var marker = $("#pickMarkerBtn").html(),
            playerColor = $("#pickColorBtn").html(),
            numPlayers = parseInt($("#pickOpponentBtn").html(), 10),
            nextMarker = {"X": "O", "O": "X"};
        if (numPlayers === 1) {
            players.botMarker = nextMarker[marker];
        }
        if (playerColor === "Red") {
            players.markerToPlayer[nextMarker[marker]] = "bluePlayer";
        } else players.markerToPlayer[nextMarker[marker]] = "redPlayer";
        players.markerToPlayer[marker] = playerColor.toLowerCase() + "Player";
        $(".field").fadeOut(600, function () {
            $(".menuScreen").hide();
            $(".field").fadeIn();
        });
        game = tictactoe(players);
        game.newGame();
    });
    
    $(".content").css("font-size", $("#playField").width() * 0.3 + "px");
});
