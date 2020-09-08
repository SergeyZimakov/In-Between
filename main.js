// let firstCard = '';
// let secondCard = '';
// let userChoose = '';

const state = {
    lowestCard: 0,
    highestCard: 0,
    fletchedCard: 0,
    userChoose: '',
    deck_id: '',
    hits: 0,
    misses: 0,
    remaining: 0
}

function gameStart() {
    $.ajax({
        type: 'Get',
        url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
        success: function (response) {
            console.log(response);
            state.deck_id = response.deck_id;
            state.remaining = response.remaining;
            displayResult();
            $('#gameStart').hide();
            $('#gameData').fadeIn(3);
            pickTwoCards();
        },
        error: function (error) {
            console.log('error');
        },

    })
    // $('#gameStart').hide();
    // $('#gameData').fadeIn(3);
}

function pickTwoCards() {
    $.ajax({
        type: 'Get',
        url: `https://deckofcardsapi.com/api/deck/${state.deck_id}/draw/?count=2`,
        success: function (response) {
            console.log(response);
            state.remaining = response.remaining;
            displayResult();
            pushTwoCardsToState(response.cards);
            displayTwoCards(response.cards);
            $('#buttons').fadeIn(3);
        },
        error: function (error) {
            console.log('error');
        },

    })
}

function pushTwoCardsToState(card) {
    cardValueToNumber(card[0]);
    cardValueToNumber(card[1]);
    if (card[0].value < card[1].value) {
        state.lowestCard = card[0].value;
        state.highestCard = card[1].value;
    }
    else {
        state.lowestCard = card[1].value;
        state.highestCard = card[0].value;
    }

}

function cardValueToNumber(card) {
    if (card.value === 'ACE') {
        card.value = 14;
    }
    else if (card.value === 'KING') {
        card.value = 13;
    }
    else if (card.value === 'QEEN') {
        card.value = 12;
    }
    else if (card.value === 'JACK') {
        card.value = 11;
    }
    else if (card.value === '0') {
        card.value = 10;
    }
    else {
        card.value = parseInt(card.value);
    }

}


function displayTwoCards(cards) { 
    $('#cards').append(`<div style="order: 1;"><img src="${cards[0].image}"></div>`); 
    $('#cards').append(`<div style="order: 3;"><img src="${cards[1].image}"></div>`); 
}


function pressIn() {
    state.userChoose = 'in';
    flethCard();

}

function pressOut() {
    state.userChoose = 'out';
    flethCard();

}

function flethCard() {
    $.ajax({
        type: 'Get',
        url: `https://deckofcardsapi.com/api/deck/${state.deck_id}/draw/?count=1`,
        success: function (response) {
            console.log(response);
            state.remaining = response.remaining;
            cardValueToNumber(response.cards[0]);
            $('.fletchedCard').empty();
            $('#cards').append(`<div style="order: 2;"><img src="${response.cards[0].image}"></div>`);
            if (checkResult(response.cards[0].value)) {
                state.hits ++; 
            }
            else {
                state.misses ++;
            }
            displayResult();
            $('#buttons').fadeOut(3);
            setTimeout(() => {
                if (state.remaining >= 3) {
                    newRound();
                }
                else {
                    if (state.hits > state.misses) {
                        alert('You win !!!');
                    }
                    else {
                        alert('You lose');
                    }
                }
            }, 3000);
        },
        error: function (error) {
            console.log('error');
        },

    })

}

function checkResult(value) {
    if ((value >= state.lowestCard) && (value <= state.highestCard)) {
        if (state.userChoose === 'in') {
            return true;
        }
        else {
            return false;
        }
    }
    else {
        if (state.userChoose === 'out') {
            return true;
        }
        else {
            return false;
        }
    }
}

function displayResult() {
    $('#hits').html(state.hits);
    $('#misses').html(state.misses);
    $('#remaining').html(state.remaining);
}

function newRound() {
    $('#cards').empty();
    pickTwoCards();

}