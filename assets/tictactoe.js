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
        self = {};
    $("#"+currentPlayer).addClass(currentPlayer+"Active");
    
    function isMarkerInPlace(place) {
        return field[place] === currentMarker;
    }
    function testWinner() {
        var winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
                             [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        winConditions.forEach(function (state) { // Test if all places on a field for a certain win condition occupied with the same element            
            if (state.every(isMarkerInPlace)) {
                var winner = currentPlayer;
                players.score[winner] += 1;
                console.log(currentPlayer);
                // Highlight the winner
                $("#" + winner).addClass(winner+"Wins");
                // Hightlight winning combination
                state.forEach(function(cellId) {
                   $("#cell"+cellId).removeClass(winner).addClass(winner+"Marker");
                });
                // Take some time for celebration and remove highlights
                setTimeout(function () {
                    $("#" + winner).removeClass(winner+"Wins");
                    state.forEach(function(cellId) {
                       $("#cell"+cellId).removeClass(winner+"Marker");
                    });
                    self.newGame();                    
                }, celebrationLength);
            }
        });
        if (field.every(function (elem) {return elem !== ""; })) { //If every cell is occupied call a tie
            setTimeout(self.newGame, celebrationLength);
        }
    }
    function setMarker(place) {
        $("#"+currentPlayer).removeClass(currentPlayer+"Active");
        field[place] = currentMarker;
        testWinner();
        currentMarker = nextMarker[currentMarker];
        currentPlayer = players.markerToPlayer[currentMarker];
        $("#"+currentPlayer).addClass(currentPlayer+"Active");
    }
    self.newGame = function () {
        
        // Update score
        $("#redPlayer").html(players.score.redPlayer);
        $("#bluePlayer").html(players.score.bluePlayer);
        
        // Setup playing field
        field.fill("").forEach(function (_, i) {
            var cellId = "#cell" + i;
            $(cellId).off("click").addClass("emptyCell"); //Clear previous clicks
            $(cellId).find(".content").html(""); //Empty all cells
            $(cellId).removeClass("bluePlayer redPlayer"); // Remove color markers
            
            // Add brand new clicks
            $(cellId).on("click", function () {
                $(this).find(".content").html(currentMarker);
                $(this).addClass(currentPlayer);
                $(this).off("click").removeClass("emptyCell");
                setMarker($(this).attr("id").slice(-1)); // Set value to a chosen cell on a field
            });
        });
    };
    self.resetScore = function () {
        players.score.redPlayer = players.score.bluePlayer = 0;
        $("#redPlayer").html(players.score.redPlayer);
        $("#bluePlayer").html(players.score.bluePlayer);
    };
    return self;
};
$(document).ready(function () {
   var players = {score: {"redPlayer": 0, "bluePlayer": 0}, markerToPlayer: {}, numberOfPlayers: 1},
       game;
    $("#startBtn").on("click", function () {
        $(".startScreen").hide();
        $(".optionsScreen").show();
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
        if ($(this).html() === "1 Player") {
            $(this).html("2 Players");
        } else $(this).html("1 Player");
    });
    $("#startGameBtn").on("click", function () {
        var marker = $("#pickMarkerBtn").html(),
            playerColor = $("#pickColorBtn").html(),
            numPlayers = $("#pickOpponentBtn").html(),
            nextMarker = {"X": "O", "O": "X"};
        
        players.numberOfPlayers = parseInt(numPlayers[0], 10);
        if (playerColor === "Red") {
            players.markerToPlayer[nextMarker[marker]] = "bluePlayer";
        } else players.markerToPlayer[nextMarker[marker]] = "redPlayer";
        players.markerToPlayer[marker] = playerColor.toLowerCase() + "Player";
        
        $(".menuScreen").hide();
        game = tictactoe(players);
        game.newGame();
    });
    
    $(".content").css("font-size", $("#playField").width() * 0.3 + "px");
});