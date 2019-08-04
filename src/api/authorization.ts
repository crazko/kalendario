const manifest = chrome.runtime.getManifest();

const settings = {
  client_id: manifest.oauth2!.client_id,
  client_secret: __CLIENT_SECRET__,
  redirect_uri: chrome.identity.getRedirectURL('provider_cb'),
};

export const apiUrl = {
  webAuth: 'https://accounts.google.com/o/oauth2/v2/auth',
  token: 'https://www.googleapis.com/oauth2/v3/token',
  tokenInfo: 'https://www.googleapis.com/oauth2/v3/tokeninfo',
  calendar: 'https://www.googleapis.com/calendar/v3/calendars',
  calendarList: 'https://www.googleapis.com/calendar/v3/users/me/calendarList',
};

const getExpirationDate = (dateFrom: Date, expireInMinutes: number): number => {
  dateFrom.setMinutes(dateFrom.getMinutes() + expireInMinutes);

  return dateFrom.getTime();
};

const getTokens = (code: string) => {
  let params = `?code=${code}`;
  params += `&client_id=${settings.client_id}`;
  params += `&client_secret=${settings.client_secret}`;
  params += `&redirect_uri=${settings.redirect_uri}`;
  params += '&grant_type=authorization_code';

  fetch(`${apiUrl.token}${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => response.json())
    .then(data => {
      localStorage['access_token'] = data.access_token;
      localStorage['refresh_token'] = data.refresh_token;
      localStorage['expiration'] = getExpirationDate(new Date(), 45);
    })
    .catch(error => {
      console.log(error);
    });
};

export const initialize = () => {
  let params = `?client_id=${settings.client_id}`;
  params += `&scope=${manifest.oauth2!.scopes!.join(' ')}`;
  params += `&redirect_uri=${settings.redirect_uri}`;
  params += '&response_type=code'; // code - to get refresh and offline token?
  params += '&access_type=offline'; // offline not working with 'token' response type
  params += '&prompt=consent';

  chrome.identity.launchWebAuthFlow(
    {
      url: apiUrl.webAuth + params,
      interactive: true,
    },
    responseUrl => {
      if (responseUrl) {
        let code = '';

        // Get code from redirect url
        if (responseUrl.indexOf('=') >= 0) {
          // For chrome
          code = responseUrl.split('=')[1];
        }

        code = code.replace(/[#]/g, '');

        getTokens(code);
      } else {
        console.log(chrome.runtime.lastError);
      }
    },
  );
};

const validateTokens = () => {
  fetch(`${apiUrl.tokenInfo}?access_token=${localStorage['access_token']}`, {
    method: 'GET',
  })
    .then(response => {
      if (response.status != 200) {
        revokeTokens();
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const revokeTokens = () => {
  let params = `?refresh_token=${localStorage['refresh_token']}`;
  params += `&client_id=${settings.client_id}`;
  params += `&client_secret=${settings.client_secret}`;
  params += '&grant_type=refresh_token';

  fetch(`${apiUrl.token}${params}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
    .then(response => response.json())
    .then(data => {
      localStorage['access_token'] = data.access_token;
      localStorage['expiration'] = getExpirationDate(new Date(), 45);
    })
    .catch(error => {
      console.log(error);
    });
};

export const invalidTokens = () =>
  typeof localStorage['expiration'] === undefined ||
  localStorage['expiration'] < new Date().getTime();
