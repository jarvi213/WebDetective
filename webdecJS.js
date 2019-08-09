'use strict'

const searchURLpodcast = "https://listen-api.listennotes.com/api/v2/search";
const newsURLbase = "https://newsapi.org/v2/everything";
const redditURLbase = "https://www.reddit.com/r/TrueCrime/search.json";

//make Listen URL
function createListenURL(params) {
    const queryParams = Object.keys(params).map(function(key){ 
        const value = params[key]
        return `${key}=${value}`
    }).join("&")
    const listenURL = `${searchURLpodcast}?${queryParams}`
    return listenURL;
};

//makes API request for Listen
function makeListenAPIRequest(caseName, resultsCount) {
    const listenQuery = {
        q: caseName,
        offset: resultsCount //TODO this might need to be changed since theirs returns 10 by default
    };

    const listenURL = createListenURL(listenQuery); 

    fetch('https://cors-anywhere.herokuapp.com/'+listenURL, {
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
            displayListenResults(responseJson)
        })
        .catch(function(error){
            console.log("hey something Listen broke", error)
        })
} 

//pull necessary info from Listen results
function displayListenResults(responseData) {
    const items = responseData.results
    const listenItemHTML = items.map(function(item){
        const title = (item.podcast_title_highlighted) 
        const description = (item.description_highlighted)
        const thumbnail = (item.image)

        return createListenHTML(title, description, thumbnail)
    }).join("")
    $('.listen-results').html(listenItemHTML)
}

//render Listen results to the DOM
function createListenHTML(title, description, thumbnailURL) {
    return `
        <div class="podcast-results">
            <img class="podcast-thumbnail" src="${thumbnailURL}" />
            <div class="podcast-title">${title}</div>
            <div class="podcast-description">${description}</div>
        </div>
    `
}
//make news URL
function createNewsURL(params) {
    const queryParams = Object.keys(params).map(function(key){ 
        const value = params[key]
        return `${key}=${value}`
    }).join("&")
    const newsURL = `${newsURLbase}?${queryParams}`
    return newsURL;
} 

//makes API request for news
function makeNewsAPIRequest(caseName, resultsCount) {
    const newsQuery = {
        q: caseName,
        pageSize: resultsCount,
        apiKey: '78e5524de7e647c48276b4f7608d0987'
    };
    
    const newsURL = createNewsURL(newsQuery);

    fetch('https://cors-anywhere.herokuapp.com/'+newsURL)
        .then(function(response){
            if (response.ok === true) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function(responseJson){
            displayNewsResults(responseJson)
        })
        .catch(function(error){
            console.log("hey something newsy broke", error)
        })
}

//pull necessary info from News results
function displayNewsResults(responseData) {
    const items = responseData.articles
    const newsItemHTML = items.map(function(item){
        const title = (item.title)
        const description = (item.description)
        const thumbnail = (item.urlToImage)

        return createNewsHTML(title, description, thumbnail)
    }).join("")

    $('.news-results').html(newsItemHTML)
}

//render News results to the DOM
function createNewsHTML(title, description, thumbnailURL) {
    return `
        <div class="news-articles">
            <img class="news-thumbnail" src="${thumbnailURL}" />
            <div class="news-title">${title}</div>
            <div class="news-description">${description}</div>
        </div>
    `
}

//make Reddit URL
function createRedditURL(params) {
    const queryParams = Object.keys(params).map(function(key){ 
        const value = params[key]
        return `${key}=${value}`
    }).join("&")
    const redditURL = `${redditURLbase}?${queryParams}`
    return redditURL;
}

//makes API Request for Reddit
function makeRedditAPIRequest(caseName, resultsCount, top) {
    const redditQuery = {
        q: caseName,
        limit: resultsCount,
        sort: top
    };
    
    const redditURL = createRedditURL(redditQuery);

    fetch('https://cors-anywhere.herokuapp.com/'+redditURL)
        .then(function(response){
            if (response.ok === true) {
                return response.json()
            }
            throw new Error(response.statusText)
        })
        .then(function(responseJson){
            displayRedditResults(responseJson)
        })
        .catch(function(error){
            console.log("hey something reddit-y broke", error)
        })
}

//pull necessary info from Reddit results
function displayRedditResults(responseData) {
    const items = responseData.data.children
    console.log(items)
    const redditItemHTML = items.map(function(item){
        const title = (item.data.title)
        const thumbnail = (item.data.thumbnail)
        const link = (item.data.permalink)
        return createRedditHTML(title, thumbnail, link)
        
    }).join("")

    $('.reddit-results').html(redditItemHTML)
}

//render Reddit results to the DOM
function createRedditHTML(title, thumbnailURL, link) {
    return `
        <div class="reddit-article">
            <img class="reddit-thumbnail" src="${thumbnailURL}" />
            <div class="reddit-title">${title}</div>
            <div class="reddit-link">${link}</div>
        </div>
    `
}

//manages user views
function manageView(resultsFound) {
    $('.results-found').hide();
    $('.no-results-found').hide();

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
        manageView(resultsFound); //double check during mentor session
    } else if (maxResults < actualResults) {
        resultsFound = maxResults;
        manageView(resultsFound); //double check during mentor session
    };
    return resultsFound;
}

//listens for user input to send with API request
function submitUserInput() {
    $('#submit-button').on('click', function(event) {
        event.preventDefault();
        const caseName = $('#victimNameId').val(); 
        const resultsCount = $('#searchResultsCounts').val(); 
        makeListenAPIRequest(caseName, resultsCount);
        makeNewsAPIRequest(caseName, resultsCount);
        makeRedditAPIRequest(caseName, resultsCount);
        manageResultsFound(resultsCount);
    });
};

//take all the functions and run it!
function runPage() {
    manageView();
    submitUserInput();
};

$(runPage);