$(document).ready(function () {
    game = tictactoe("X");
    game.newGame();
});
var tictactoe = function (firstTurn) {
    var nextTurn = {"X": "O", "O": "X"},
        score = {"redPlayer": 0, "bluePlayer": 0},
        valueToPlayer = {},
        field = Array(9),
        currentTurn = firstTurn,
        self = {};
    // Setting up chosen values for the players ES5 way
    valueToPlayer[firstTurn] = "redPlayer";
    valueToPlayer[nextTurn[firstTurn]] = "bluePlayer";
    function testWinner() {
        var winConditions = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        winConditions.forEach(function(state) { // Test if all places on a field for a certain win condition occupied with the same element            
            if (state.every(isTurnInPlace)) {
                var winner = valueToPlayer[currentTurn];
                alert("Winner is " + winner);
                score[winner] += 1;
                self.newGame();
            }
        });
        if (field.every(function(elem) {return elem !==""})){ //If every cell is occupied call a tie
            alert("Tie");
            self.newGame();
        }
    }    
    function isTurnInPlace(place) {
        return field[place] === currentTurn;
    }
    function setValue(place) {
        field[place] = currentTurn;
        testWinner();
        currentTurn = nextTurn[currentTurn];
    }
    self.newGame = function () {
        var i;
        for (i = 0; i < 9; i++) {
            $("#cell"+i).off("click"); //Clear clicks;
            $("#cell"+i).addClass("activeCell");
            $("#cell"+i).find(".content").html("");
        }
        field.fill(""); // Empty playing field
        $("#redPlayer").html(score.redPlayer);
        $("#bluePlayer").html(score.bluePlayer);
        for (i = 0; i < 9; i++) {
            $("#cell"+i).on("click", function () {
                $(this).find(".content").html(currentTurn);
                $(this).off("click");
                $(this).removeClass("activeCell");
                setValue($(this).attr("id").slice(-1)); // Set value to a chosen place on a field
            });
        }
    }
    self.resetScore = function () {
        score.redPlayer = score.bluePlayer = 0;
        $("#redPlayer").html(score.redPlayer);
        $("#bluePlayer").html(score.bluePlayer);
    }    
    return self;    
}