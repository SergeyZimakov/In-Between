let firstCard = '';
let secondCard = '';

function gameStart() {
    $.ajax({
        type: 'Get',
        url: 'https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1',
        success: function (response) {
            console.log(response);
            const deck_id = response.deck_id;
            drawTwoCards(deck_id);
        },
        error: function (error) {
            console.log('error');
        },

    })
    $('#gameStart').hide();
    $('#gameData').fadeIn(3);
}

function drawTwoCards(deck_id) {
    $.ajax({
        type: 'Get',
        url: `https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=2`,
        success: function (response) {
            console.log(response);
            displayTwoCards(response.cards);
            $('#buttons').fadeIn(3);
        },
        error: function (error) {
            console.log('error');
        },

    })
}

function displayTwoCards(cards) {
    for (let index = 0; index < cards.length; index++) {
      let card = cards[index];
      $('#createdCards').append(createSingleCard(card));      
    }
    

}

function createSingleCard(card) {
    let el = $('<div></div>');
    el.append(`<img src="${card.image}">`);
    el.append('<br>');
    return el;
}