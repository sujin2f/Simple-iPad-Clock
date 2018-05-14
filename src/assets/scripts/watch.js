/* eslint-disable no-undef */

jQuery(document).ready(($) => {
  let flickrTimer;
  let flickrPhotos;
  const flickrPhotosKeep = [];
  let weatherTimer;

  const toTitleCase = str => str.replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  const fillZero = (num) => {
    if (num < 10) {
      return `0${num}`;
    }

    return num;
  };

  const getFlickrPhoto = () => {
    const apiKey = Cookies.get('flickr-appid');

    if (!flickrPhotos || !apiKey) {
      return;
    }

    const photoId = flickrPhotos[Math.floor(Math.random() * flickrPhotos.length)];

    if (flickrPhotosKeep[photoId.id]) {
      $('#flickr-foreground').attr('style', `background-image: url(${flickrPhotosKeep[photoId.id]})`);
      flickrTimer = setTimeout(getFlickrPhoto, 1000 * 60 * 30);
      return;
    }

    // now call the flickr API and get the picture with a nice size
    $.getJSON(
      'https://api.flickr.com/services/rest/',
      {
        method: 'flickr.photos.getSizes',
        api_key: apiKey,
        photo_id: photoId.id,
        format: 'json',
        nojsoncallback: 1,
      },
    ).done((response) => {
      if (response.stat === 'ok') {
        const theUrl = response.sizes.size[5].source;
        $('#flickr-foreground').attr('style', `background-image: url(${theUrl})`);
        flickrPhotosKeep[photoId.id] = theUrl;

        flickrTimer = setTimeout(getFlickrPhoto, 1000 * 60 * 30);
      }
    });
  };

  const getFlickr = () => {
    const apiKey = Cookies.get('flickr-appid');
    const userId = Cookies.get('flickr-userid');

    if (!apiKey || !userId) {
      return;
    }

    // get an array of random photos
    $.getJSON(
      'https://api.flickr.com/services/rest/',
      {
        method: 'flickr.people.getPublicPhotos',
        api_key: apiKey,
        user_id: userId,
        format: 'json',
        nojsoncallback: 1,
        per_page: 100,
      },
    ).done((data) => {
      // if everything went good
      if (data.stat === 'ok') {
        // get a random id from the array
        flickrPhotos = data.photos.photo;
        getFlickrPhoto();
      }
    });
  };

  const getWeather = () => {
    const appkey = Cookies.get('weather-appkey');
    const city = Cookies.get('weather-city');
    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&APPID=${appkey}&units=metric`;

    if (!appkey) {
      return;
    }

    $.getJSON(url).done((response) => {
      if (response.cod === '200') {
        $('#weather-description').html(toTitleCase(response.list[0].weather[0].description));
        $('#weather-current').html(`${parseInt(response.list[0].main.temp, 10)}&deg;C`);
        $('#weather-minmax').html(`${parseInt(response.list[0].main.temp_min, 10)}&deg;C - ${parseInt(response.list[0].main.temp_max, 10)}&deg;C`);
      }
    });

    weatherTimer = setTimeout(getWeather, 1000 * 60 * 60);
  };

  const timerTick = () => {
    const date = new Date();
    const h = 30 * ((date.getHours() % 12) + (date.getMinutes() / 60));
    const m = 6 * date.getMinutes();
    const s = 6 * date.getSeconds();

    document.getElementById('h-pointer').setAttribute('transform', `rotate(${h}, 50, 50)`);
    document.getElementById('m-pointer').setAttribute('transform', `rotate(${m}, 50, 50)`);
    document.getElementById('s-pointer').setAttribute('transform', `rotate(${s}, 50, 50)`);

    document.getElementById('digital-h-pointer').setAttribute('transform', `rotate(${h}, 50, 50)`);
    document.getElementById('digital-m-pointer').setAttribute('transform', `rotate(${m}, 50, 50)`);


    document.getElementById('digital').textContent = `${fillZero(date.getHours())}:${fillZero(date.getMinutes())}:${fillZero(date.getSeconds())}`;

    setTimeout(timerTick, 1000);
  };

  const drawClock = () => {
    for (let i = 1; i <= 60; i += 1) {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      const type = i % 5 ? 'min' : 'hour';

      el.setAttribute('x1', '50');
      el.setAttribute('y1', '5');
      el.setAttribute('x2', '50');
      el.setAttribute('y2', type === 'min' ? '6' : '7');
      el.setAttribute('transform', `rotate(${(i * 360) / 60} 50 50)`);
      el.setAttribute('class', type === 'min' ? 'grad-min' : 'grad-hour');
      document.getElementById('clock').insertBefore(el, document.getElementById('clock').firstChild);
    }

    $('#clock-container #clock').width($(document).height());
    $('#clock-container #clock').height($(document).height());
  };

  const setWifi = () => {
    const wifiName = Cookies.get('wifi-name');
    const wifiPassword = Cookies.get('wifi-password');

    $('#wifi-name').html(wifiName);
    $('#wifi-password').html(wifiPassword);
  };

  drawClock();
  timerTick();
  getFlickr();
  getWeather();
  setWifi();

  $('#btn-analog').click(() => {
    $('#clock').removeClass('hidden');
    $('#clock #pointers').removeClass('hidden');
    $('#clock #digital').addClass('hidden');
    $('#weather').removeClass('hidden');
    $('#wifi').addClass('hidden');
    $('#d-pointers').addClass('hidden');
  });

  $('#btn-digital').click(() => {
    $('#clock').removeClass('hidden');
    $('#clock #pointers').addClass('hidden');
    $('#clock #digital').removeClass('hidden');
    $('#weather').removeClass('hidden');
    $('#wifi').addClass('hidden');
    $('#d-pointers').removeClass('hidden');
  });

  $('#btn-wifi').click(() => {
    $('#clock').addClass('hidden');
    $('#weather').addClass('hidden');
    $('#wifi').removeClass('hidden');
    $('#d-pointers').addClass('hidden');
  });

  $('#settings-container svg').click(() => {
    $('#settings-container svg').addClass('hidden');
    $('#settings-container #settings-pane').removeClass('hidden');

    $('#inp-flickr-appid').val(Cookies.get('flickr-appid'));
    $('#inp-flickr-userid').val(Cookies.get('flickr-userid'));
    $('#inp-weather-appkey').val(Cookies.get('weather-appkey'));
    $('#inp-weather-city').val(Cookies.get('weather-city'));
    $('#inp-wifi-name').val(Cookies.get('wifi-name'));
    $('#inp-wifi-password').val(Cookies.get('wifi-password'));
  });

  $('#inp-submit').click((e) => {
    e.preventDefault();

    Cookies.set('flickr-appid', $('#inp-flickr-appid').val(), { expires: 365 * 50 });
    Cookies.set('flickr-userid', $('#inp-flickr-userid').val(), { expires: 365 * 50 });
    Cookies.set('weather-appkey', $('#inp-weather-appkey').val(), { expires: 365 * 50 });
    Cookies.set('weather-city', $('#inp-weather-city').val(), { expires: 365 * 50 });
    Cookies.set('wifi-name', $('#inp-wifi-name').val(), { expires: 365 * 50 });
    Cookies.set('wifi-password', $('#inp-wifi-password').val(), { expires: 365 * 50 });

    clearTimeout(flickrTimer);
    clearTimeout(weatherTimer);

    getFlickr();
    getWeather();
    setWifi();

    $('#settings-container svg').removeClass('hidden');
    $('#settings-container #settings-pane').addClass('hidden');
  });
});
