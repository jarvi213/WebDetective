'use strict'

const searchURLpodcast = "https://listen-api.listennotes.com/api/v2/search";
const wikipediaURL = "";
const redditURL = "";

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
//makes API request for Listen
function makeListenAPIRequest() {
    //TODO here's where I'll list out all the stuff to make my query
}

//makes API request for Wikipedia
function makeWikiAPIRequest() {

}

//makes API Request for Reddit
function makeRedditAPIRequest() {

}

//listens for user input to send with API request
function submitUserInput() {
    const caseName = $('#victimNameId').val(); 
    const resultsCount = $('#searchResultsCounts').val(); 
    $('#submit-button').on('click', function(event) {
        event.preventDefault();
        makeListenAPIRequest(caseName, resultsCount);
        makeWikiAPIRequest(caseName, resultsCount);
        makeRedditAPIRequest(caseName, resultsCount);
    });
};

//take all the functions and run it!
function runPage() {
    manageView();
};

$(runPage);