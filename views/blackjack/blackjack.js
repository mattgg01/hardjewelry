var dealerSum = 0;
var yourSum = 0;

var dealerCardCount = 0;

var dealerShownSum = 0;

var dealerAceCount = 0;
var yourAceCount = 0; 

var hidden;
var deck;

var canHit = true; //allows the player (you) to draw while yourSum <= 21

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

//Hide hit and stay buttons when game has ended, make "new game" button visible
const playAgain = () =>{
    const newGame = () =>{
        location.reload()
    }
    let button = document.getElementById("newGame")
    button.addEventListener("click", newGame)
    document.getElementById("newGame").hidden = false
    document.getElementById("hit").hidden = true
    document.getElementById("stay").hidden = true
}

function startGame() {
    let hitBtn = document.getElementById("hit")
    let stayBtn = document.getElementById("stay")
    
    //first dealer card is hidden from player
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerCardCount += 1
    dealerAceCount += checkAce(hidden);

    //deal to house until has 2 cards
    while (dealerCardCount < 2) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        //get value of the card shown, exclude hidden card
        dealerShownSum += getValue(card);
        document.getElementById("dealer-sum").innerText = dealerShownSum + " + ?";
        cardImg.src = "/assets/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerCardCount += 1
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);

    }
    console.log(dealerSum);

    //deal to the player until has 2 cards
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "/assets/cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    //if your initial two card draws sum up to 21, player automatically stands, sums are compared and house draws until 17
    if(yourSum === 21){
        //draw for dealer until at least 17
            while(dealerSum < 17){
            let cardImg = document.createElement("img");
            //get card at end of deck
            let card = deck.pop();
            //get value of the card shown, exclude hidden card
            dealerShownSum += getValue(card);
            document.getElementById("dealer-sum").innerText = dealerShownSum + " + ?";
            cardImg.src = "/assets/cards/" + card + ".png";
            dealerSum += getValue(card);
            dealerCardCount += 1
            dealerAceCount += checkAce(card);
            document.getElementById("dealer-cards").append(cardImg);
            }
        //new sums after checking & reducing aces
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        document.getElementById("hidden").src = "/assets/cards/" + hidden + ".png";
        canHit = false;

        //after dealer has drawn to >= 17 and player has hit a blackjack at initial 2 card draw, compare sums to see who won
        if (yourSum == dealerSum) {
            document.getElementById("dealer-sum").innerText = dealerSum;
            message = "You drew a Blackjack! And it's a tie!";
            canHit = false;
            playAgain()
        }
        else if (yourSum > dealerSum) {
            document.getElementById("dealer-sum").innerText = dealerSum;
            message = "You drew a Blackjack! And you won!";
            canHit = false;
            playAgain()
        }
        else if (dealerSum > 21){
            document.getElementById("dealer-sum").innerText = dealerSum;
            message = `You drew a Blackjack! You won! Dealer drew until 17 but busted at ${dealerSum}!`;
            canHit = false;
            playAgain()
        }
        document.getElementById("results").innerText = message
    }
    
    document.getElementById("your-sum").innerText = yourSum;

    console.log(yourSum);
    hitBtn.addEventListener("click", hit);
    stayBtn.addEventListener("click", stay);
}

function hit() {
    //exit function if game rules make player hit prohibited
    if (!canHit) {
        return;
    }

    //draw card
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/assets/cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount)

    //after card draw, check to see if bust
    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
        document.getElementById("hidden").src = "../../../assets/cards/" + hidden + ".png";
        document.getElementById("dealer-sum").innerText = dealerSum;
        message = "Bust! You lost!"
        playAgain()
    //if your sum is 21, player cannot hit and dealer draws to >= 17
    }else if(yourSum === 21){
        //dealer draws to >= 17
        while(dealerSum < 17){
            let cardImg = document.createElement("img");
            //get card at end of deck
            let card = deck.pop();
            //get value of the card shown, exclude hidden card
            dealerShownSum += getValue(card);
            document.getElementById("dealer-sum").innerText = dealerShownSum + " + ?";
            cardImg.src = "/assets/cards/" + card + ".png";
            dealerSum += getValue(card);
            dealerCardCount += 1
            dealerAceCount += checkAce(card);
            document.getElementById("dealer-cards").append(cardImg);
            }
        //reduce aces if sum exceeds 21 & aceCount > 0
        dealerSum = reduceAce(dealerSum, dealerAceCount);
        document.getElementById("hidden").src = "/assets/cards/" + hidden + ".png";
        canHit = false;
        //after dealer has drawn to >= 17 & player hits blackjack, compare sums
        if (yourSum == dealerSum) {
            document.getElementById("dealer-sum").innerText = dealerSum;
            message = "You drew a Blackjack! And it's a tie!";
            canHit = false;
            playAgain()
        }
        else if (yourSum > dealerSum) {
            document.getElementById("dealer-sum").innerText = dealerSum;
            message = "You drew a Blackjack! And you won!";
            canHit = false;
            playAgain()
        }
        else{
            document.getElementById("dealer-sum").innerText = dealerSum;
            message = "You drew a Blackjack! And dealer bust!";
            canHit = false;
            playAgain()
        }
    }
    document.getElementById("results").innerText = message
}

function stay() {
    //reduce ace from sum if sum > 21 & aceCount > 0
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "/assets/cards/" + hidden + ".png";

    let message = "";
    //player stays, dealer draws to >= 17
    if (dealerSum < 17){
        while(dealerSum < 17){
        let cardImg = document.createElement("img");
        //get card at end of deck
        let card = deck.pop();
        //get value of the card shown, exclude hidden card
        dealerShownSum += getValue(card);
        document.getElementById("dealer-sum").innerText = dealerShownSum + " + ?";
        cardImg.src = "/assets/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerCardCount += 1
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
        }
    }
    if (yourSum > 21) {
        document.getElementById("dealer-sum").innerText = dealerSum
        message = "Bust! You Lost!";
        canHit = false;
        playAgain();
    }
    else if (dealerSum > 21) {
        document.getElementById("dealer-sum").innerText = dealerSum
        message = "Dealer bust! You win!";
        canHit = false;
        playAgain();
    }
    //both you and house <= 21
    else if (yourSum == dealerSum) {
        document.getElementById("dealer-sum").innerText = dealerSum
        message = `You both drew ${yourSum}! Tie!`;
        playAgain();
    }
    else if (yourSum > dealerSum) {
        message = `You Win! Your sum was greater by ${yourSum - dealerSum}!`;
        canHit = false;
        playAgain();
    }
    else if (yourSum < dealerSum) {
        document.getElementById("dealer-sum").innerText = dealerSum
        message = `Dealer's sum is greater by ${dealerSum - yourSum}, you lost!`;
        canHit = false;
        playAgain();
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = reduceAce(yourSum, yourAceCount);
    document.getElementById("results").innerText = message;
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    //Suite type is not needed so we ignore 'C' in card data array
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

//ensure all cards are checked for aces
function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

//ensure if the player has a soft card count that exceeds 21, reduce 10 * ace count from player/dealer's sum
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}