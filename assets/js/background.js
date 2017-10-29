const debug = true;
const manifest = chrome.runtime.getManifest();
const settings = {
  client_id: manifest.oauth2.client_id,
  client_secret: 'usq5dT6yGdw6sjdlE65XWHp5',
  redirect_uri: chrome.identity.getRedirectURL('provider_cb')
}

const apiUrl = {
  webAuth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://www.googleapis.com/oauth2/v3/token',
  tokenInfo: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
  calendar: 'https://www.googleapis.com/calendar/v3/calendars',
  calendarList: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
}

const logDebug = function() {
  if (debug && console && console.log) {
    console.log.apply(console, arguments);
  }
}

/**
 * @return {Date}
 */
const getActualDate = function() {
  return new Date();
}

/**
 * @param {Date} dateFrom
 * @param {number} expiration time in minutes
 * @return {number}
 */
const getExpirationDate = function(dateFrom, expiration) {
  dateFrom.setMinutes(dateFrom.getMinutes() + expiration);

  return dateFrom.getTime();
}

/* ----------------------------------------------------- */

function initialize() {
  let params = `?client_id=${settings.client_id}`;
  params += `&scope=${manifest.oauth2.scopes.join(' ')}`;
  params += `&redirect_uri=${settings.redirect_uri}`;
  params += '&response_type=code'; // code - to get refresh and offline token?
  params += '&access_type=offline'; // offline not working with 'token' response type
  params += '&prompt=consent';

  chrome.identity.launchWebAuthFlow({
      url: apiUrl.webAuth + params,
      interactive: true
    }, function (responseUrl) {
      if (responseUrl) {
        // Get code from redirect url
        if(responseUrl.indexOf('=') >= 0) { // For chrome
          code = responseUrl.split('=')[1];
        }

        code = code.replace(/[#]/g, '');
        getTokens(code);
      } else {
        logDebug(chrome.runtime.lastError);
      }
    }
  );
}

function validateTokens() {
  let params = `?access_token=${localStorage['access_token']}`;

  fetch(apiUrl.tokenInfo + params, {
    method: 'GET'
  }).then(function(response) {
    if (response.status != 200) {
      revokeTokens();
    }
  }).catch(function(error) {
    logDebug(error);
  });
}

function revokeTokens() {
  let params = `?refresh_token=${localStorage['refresh_token']}`;
  params += `&client_id=${settings.client_id}`;
  params += `&client_secret=${settings.client_secret}`;
  params += '&grant_type=refresh_token';

  fetch(apiUrl.token + params, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    localStorage['access_token'] = data.access_token;
    localStorage['expiration'] = getExpirationDate(getActualDate(), 45);
  }).catch(function(error) {
    logDebug(error);
  });
}

function getTokens(code) {
  let params = `?code=${code}`;
  params += `&client_id=${settings.client_id}`;
  params += `&client_secret=${settings.client_secret}`;
  params += `&redirect_uri=${settings.redirect_uri}`;
  params += '&grant_type=authorization_code';

  fetch(apiUrl.token + params, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(function(response) {
    return response.json();
  }).then(function(data) {
    localStorage['access_token'] = data.access_token;
    localStorage['refresh_token'] = data.refresh_token;
    localStorage['expiration'] = getExpirationDate(getActualDate(), 45);
  }).catch(function(error) {
    logDebug(error);
  });
}

/* ----------------------------------------------------- */

/**
 * Fetches event's data from Google Calendar API.
 * @param {string} calendarId
 * @param {string} eventId
 * @returns {Promise.<Object>} event
 */
function getEventData(calendarId, eventId) {
  // Filter out default calendars, ie. Week number, Holidays
  if (!calendarId || calendarId.indexOf('#') > -1) {
    return Promise.reject(`Event '${eventId}' doesn't have proper calendar '${calendarId}'.`);
  }

  let params = `/${calendarId}/events/${eventId}`;

  return fetch(apiUrl.calendar + params, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer  ${localStorage['access_token']}`
    }
  }).then(function(response) {
    return response.json();
  }).catch(function(error) {
    logDebug(error);
  });
}

/**
 * Sends event data back to calendar page.
 * @param {Object} event
 * @param {string} message to be added to request
 */
function sendEvent(event, message) {
  // Do not send event without description
  if (!event.hasOwnProperty('description')) {
    return false;
  }

  chrome.tabs.query({
    url: 'https://calendar.google.com/calendar*'
  }, function (tabs) {
    for (let i = 0, len = tabs.length; i < len; i++) {
      chrome.tabs.sendMessage(tabs[i].id, {
        msg: message,
        event: event
      });
    }
  });
}

/* ----------------------------------------------------- */

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason === 'install') {
    initialize();
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === 'events') {
    if (typeof localStorage['expiration'] === 'undefined' || localStorage['expiration'] < new Date().getTime()) {
      revokeTokens();
    }

    const events = request.events;
    const calendars = JSON.parse(localStorage['calendars']);


    for (let i = 0, len = events.length; i < len; i++) {
      const calendar = calendars[events[i].calendarName];

      getEventData(calendar, events[i].id)
        .then(function(event) {
          sendEvent(event, 'show');
        }).catch(function(error) {
          logDebug(error);
        });
    }
  }
});

const foo = {"journal":"tqis1rps45rv6fn4im711u1be8@group.calendar.google.com",
"my calendar":"crazko@gmail.com",
"Via Cassa Events":"hk7h9pyjyi@gmail.com",
"ness":"8pabtsvrhq2flt3krqdacm505c@group.calendar.google.com",
"trainings":"71dkv7jucnfhe2ti1vi1dqa7ho@group.calendar.google.com",
"Slovenské mená":"innova.sk_t584jl5ialdo9ou36jqa9lt0lk@group.calendar.google.com",
"work":"bi3m1jd5a6s7ulbl2hoffc8svo@group.calendar.google.com",
"Team Omega Ω":"kr388d703grv2ouqj17gp8ua3g@group.calendar.google.com",
"Ness KDC Internal Devs":"vt4g9ldh8265c8qn0dh7gadea8@group.calendar.google.com",
"Contacts":"#contacts@group.v.calendar.google.com",
"Sviatky na Slovensku":"sk.slovak#holiday@group.v.calendar.google.com",
"Week Numbers":"p#weeknum@group.v.calendar.google.com"};

const parseCalendarList = calendarList => {
  return calendarList.reduce((list, calendar) => {
    list[calendar.summary] = calendar.id;
    return list;
  }, {});
};

const getCalendarList = () => {
    fetch(apiUrl.calendarList, {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer  ' + localStorage['access_token']
      }
    }).then(function(response) {
      return response.json();
    }).then(function(data) {
      return parseCalendarList(data.items);
    }).then(function(parsedData) {
      localStorage['calendars'] = JSON.stringify(parsedData);
    }).catch(function(error) {
      logDebug(error);
    });
};

getCalendarList();
