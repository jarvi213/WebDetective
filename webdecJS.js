'use strict'

//manages user views
function manageView() {
    $('.results-found').hide();
    $('.no-results-found').hide();

    let resultsFound = 0; //TODO

    if (resultsFound === 0) {
        $('.no-results-found').show();
    } else if (resultsFound > 0) {
        $('.results-found').show();
    };
};

//listens for user input to send with API request
function submitUserInput() {
    const caseName = $('#victimNameId').val(); 
    const resultsCount = $('#searchResultsCounts').val(); 
    $('#submit-button').on('click', function(event) {
        event.preventDefault();
        makeAPIRequest(caseName, resultsCount);
    });
};

//take all the functions and make it work!
function runPage() {
    manageView();
};

$(runPage);