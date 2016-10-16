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
        self = {};   
    
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
    function placeBotMarker(place) {
        field[ place] = currentMarker;
        $("#cell"+ place).find(".content").html(currentMarker);
        $("#cell"+ place).removeClass("emptyCell").addClass(currentPlayer);
    }
    function botTurn() {
        var place;
        field.disable();
        
        // Determine bots turn
        for (var i=0; i<field.length; i += 1){
            if (field[i] === ""){
                place = i;
                placeBotMarker(place);
                break;
            }
        }
        field.enable();
        setMarker(place);
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
        var winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
                             [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
            winState = undefined;
        winConditions.some(function (state) { // Test if all places on a field for a certain win condition occupied with the same element            
            if (state.every(isMarkerInPlace)) {
                winState = state;
                return true;
            }
        });
        if (field.every(function (elem) {return elem !== ""; })) { //If every cell is occupied call a tie
            setTimeout(self.newGame, celebrationLength);
        }
        return winState;
    }
    function setMarker(place) {
        $("#"+currentPlayer).removeClass(currentPlayer+"Active");
        field[place] = currentMarker;
        winState = testWinner();
        if (winState) {
            celebrate(winState);
            
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
        
        if (players.botMarker === currentMarker){
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
    $(".startScreen").fadeOut(600, function () {
            $(".optionsScreen").fadeIn();
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
        if ($(this).html() === "1") {
            $(this).html("2");
        } else $(this).html("1");
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
        
        $(".menuScreen").fadeOut();
        game = tictactoe(players);
        game.newGame();
    });
    
    $(".content").css("font-size", $("#playField").width() * 0.3 + "px");
});