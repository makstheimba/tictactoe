$(document).ready(function () {
    game = tictactoe("X");
    game.newGame();
});
var tictactoe = function (firstTurn) {
    var nextTurn = {"X": "O", "O": "X"},
        score = {"P1": 0, "P2": 0},
        valueToPlayer = {},
        field = Array(9).fill("none"),
        currentTurn = firstTurn,
        self = {};
    // Setting up chosen values for the players ES5 way
    valueToPlayer[firstTurn] = "P1";
    valueToPlayer[nextTurn[firstTurn]] = "P2";
    function testWinner() {
        var winConditions = [[0,1,2], [3,4,5], [6,7,8],
                             [0,3,6], [1,4,7], [2,5,8],
                             [0,4,8], [2,4,6]]
        winConditions.forEach(function(state) { // Test if all places on a field for a certain win condition occupied with the same element            
            if (state.every(isTurnInPlace)) {
                var winner = valueToPlayer[currentTurn];
                alert("Winner is " + winner);
                score[winner] += 1;
                console.log("1");
                self.newGame();
                return; // Crutch to make tie check work
            }
        });
        if (field.indexOf("none") === -1) { // Tie check, implementation could be better
                alert("Tie");
                self.newGame();
        }
    }
    function isTurnInPlace(place) {
        return field[place] === currentTurn;
    }
    function setValue(place) {
        field[place] = currentTurn;
        testWinner(place);
        currentTurn = nextTurn[currentTurn];
    }
    self.newGame = function () {
        var i;
        for (i = 0; i < 9; i++) {
            $("#"+i).off("click"); //Clear cliks;
        }
        field.fill("none");
        $("#P1").html(score.P1);
        $("#P2").html(score.P2);
        for (i = 0; i < 9; i++) {
            $("#"+i).html("++");
            $("#"+i).on("click", function () {
                $(this).html(currentTurn);
                $(this).off("click");
                setValue($(this).attr("id")); // Set value to a chosen place on a field
            });
        }
    }
    self.resetScore = function () {
        score.P1 = score.P2 = 0;
        $("#P1").html(score.P1);
        $("#P2").html(score.P2);
    }
    
    return self;    
}