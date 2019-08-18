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
        offset: resultsCount 
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
        const description = (item.description_original)
        const thumbnail = (item.image)
        const podcastURLclick = (item.listennotes_url)

        return createListenHTML(title, description, thumbnail, podcastURLclick)
    }).join("")
    $('.listen-results').html(listenItemHTML);
    $('.results-found').show();
}

//render Listen results to the DOM
function createListenHTML(title, description, thumbnailURL, podcastURLclick) {
    return `
        <a href="${podcastURLclick}" target="_blank">
            <div class="podcast-results">
                <img class="podcast-thumbnail" src="${thumbnailURL}">
                <div class="podcast-info">
                <h3 class="podcast-title">${title}</h3><br>
                <p class="podcast-description">${description}</p>
                </div>
            </div>
        </a>
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
        const newsResultURL = (item.url)

        return createNewsHTML(title, description, thumbnail, newsResultURL)
    }).join("")

    $('.news-results').html(newsItemHTML)
    $('.results-found').show();
}

//render News results to the DOM
function createNewsHTML(title, description, thumbnailURL, newsResultURL) {
    return `
        <a href="${newsResultURL}" target="_blank">
            <div class="news-articles">
                <img class="news-thumbnail" src="${thumbnailURL}">
                <div class="news-content">
                <h3 class="news-title">${title}</h3>
                <p class="news-description">${description}</p>
                </div>
            </div>
        </a>
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
    const redditItemHTML = items.map(function(item){
        const title = (item.data.title)
        const link = (item.data.permalink)
        return createRedditHTML(title, link)
        
    }).join("")

    $('.reddit-results').html(redditItemHTML)
    $('.results-found').show();
}

//render Reddit results to the DOM
function createRedditHTML(title, link) { 
    return `
        <a href="https://www.reddit.com${link}" target="_blank">
            <div class="reddit-article">
                <div class="reddit-logo">
                <img src="https://i.postimg.cc/tCGYGhRG/reddit-icon-25878.jpg" alt="Reddit logo">
                </div>
                <h3 class="reddit-title">${title}</h3>
            </div>
        </a>
    `
}
//default view
function initializeView() {
    $('.results-found').hide();
    $('.no-results-found').hide();
}

//manages user views
function manageView(listenResults, newsResults, redditResults) {
    if (listenResults === 0 && newsResults === 0 && redditResults === 0) {
        $('.no-results-found').show();
        $('.results-found').hide();
    } else if (listenResults > 0 || newsResults > 0 || redditResults > 0) {
        console.log('displaying results');
        displayListenResults(listenResults);
        displayNewsResults(newsResults);
        displayRedditResults(redditResults);
        $('.results-found').show();
        $('.no-results-found').hide();
    };
};

//listens for user input to send with API request
function submitUserInput() {
    $('#submit-button').on('click', function(event) {
        event.preventDefault();
        initializeView();
        const caseName = $('#victimNameId').val(); 
        const resultsCount = $('#searchResultsCounts').val(); 
        makeListenAPIRequest(caseName, resultsCount);
        makeNewsAPIRequest(caseName, resultsCount);
        makeRedditAPIRequest(caseName, resultsCount);
        //manageView(listenResults, newsResults, redditResults);
    });
};

//take all the functions and run it!
function runPage() {
    initializeView();
    submitUserInput();
};

$(runPage);