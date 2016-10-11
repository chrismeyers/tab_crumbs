function updateUrlList(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
        // NOTE: Local storage is a collection of Key-Value pairs. The "Value" 
        // can only be of type string.
        var id = tabs[0].id;
        var urls = [];
        
        if(localStorage.getItem(id) !== null) {
            // If a URL list exists, convert the stringified value to JSON.
            urls = JSON.parse(localStorage.getItem(id));
        }

        var url = tabs[0].url;

        // Prevent sequential duplicate entries.
        if(urls[urls.length - 1] !== url) {
            urls.push(url);
        }
        
        // Convert the JSON structure to a string.
        localStorage.setItem(id, JSON.stringify(urls));

        callback(url, id);
    });
}

function getCurrentTabId(callback) {
    var queryInfo = {
        active: true,
        currentWindow: true
    };
    chrome.tabs.query(queryInfo, function(tabs) {
        var id = tabs[0].id;
        callback(id);
    });
}

function displayUrls(id) {
    var formattedUrls = '';
    var list = JSON.parse(localStorage.getItem(id));
    
    // Create a link for each item in the URL history list.
    for(i = 0; i < Object.keys(list).length; i++) {
        formattedUrls += '<span>' + (i + 1) + ': </span>';
        formattedUrls += '<a target="_blank" href="' + list[i] + '">'
        formattedUrls +=        list[i] + '</a> <br />';
    }

    document.getElementById('history').innerHTML = formattedUrls;
}

// Browser action callback
document.addEventListener('DOMContentLoaded', function() {
    updateUrlList(function(url, id) {
        displayUrls(id);
    });

    // Clear button callback
    var clearBtn = document.getElementById('clearButton');
    clearBtn.addEventListener('click', function(){
        getCurrentTabId(function(id) {
            localStorage.removeItem(id);
        });
        
        document.getElementById('history').textContent = '';
    });

});
