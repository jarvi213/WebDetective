'use strict'

const searchURLpodcast = "https://listen-api.listennotes.com/api/v2/search";
const wikipediaURL = "";
const redditURL = "";

//make Listen URL
function createListenURL() {
    const queryParams = Object.keys(params).map(function(key){ //go over during mentor session
        const value = params[key]
        return `${key}=${value}`
    }).join("&")
    const listenURL = `${searchURLpodcast}?${queryParams}`
    return listenURL;
};

//manages user views
function manageView() {
    $('.results-found').hide();
    $('.no-results-found').hide();

    let resultsFound = undefined;

    if (resultsFound === 0) {
        $('.no-results-found').show();
    } else if (resultsFound > 0) {
        $('.results-found').show();
    };
};

//compares search results to max allowed to determine what to display
function manageResultsFound() {
    const maxResults = $('#searchResultsCounts').val();
    const actualResults = makeListenAPIRequest(resultsCount);
    if (maxResults > actualResults) {
        resultsFound = actualResults;
    } else if (maxResults < actualResults) {
        resultsFound = maxResults;
    };
    return resultsFound;
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

//makes API request for Listen
function makeListenAPIRequest(caseName, resultsCount) {
    const listenQuery = {
        q: caseName,
        offset: resultsCount //TODO this might need to be changed since theirs returns 10 by default
    };

    const listenURL = createListenURL(listenQuery); 

    fetch(listenURL, {
        method: 'GET',
        headers: {
            'X-ListenAPI-Key': 'ff4a5a99e28e403181a8607ca2254322',
            'App': 'WebDetective'
        }
    })
        .then(function(response){
            if (response.ok === true) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function(responseJson){
            console.log(responseJson)
        })
        .catch(function(error){
            console.log("hey something broke", error)
        })
} 

//makes API request for Wikipedia
function makeWikiAPIRequest() {

}

//makes API Request for Reddit
function makeRedditAPIRequest() {

}

//take all the functions and run it!
function runPage() {
    manageView();
};

$(runPage);