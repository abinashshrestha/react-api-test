import React, { useState, useEffect } from 'react';
import './App.scss';
import axios from 'axios';
import ReactHtmlParser from 'react-html-parser';

function WeatherInfo({ updateWeather, weather }) {

  function fetchWeather(latitude, longitude) {
    axios.get(`https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/ded906dca7bd00e48ae73d155ee8bf7d/${latitude},${longitude}`)
      .then((res) => {
        const data = res.data;
        console.log(data);
        updateWeather(data);
      });
  }

  function fetchLocation(cb) {
    let latitude = 37.8267;
    let longitude = -122.4233;

    console.log(navigator.geolocation.watchPosition);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          longitude = position.coords.longitude;
          latitude = position.coords.latitude;
          console.log(longitude, latitude);

          cb(latitude, longitude);
        },
        cb(latitude, longitude));
    }

    else {
      console.log('Location not found.')
    }
  }
  useEffect(() => {
    fetchLocation(fetchWeather);
  }, []);

  return (
    <div>
      <div className="temperature">
        {weather ? `${weather.currently.temperature} ${ReactHtmlParser('&deg;C')}` : 'Loading'}
      </div>
      <div>{weather.timezone}</div>
      <p style={{ fontStyle: 'italic', color: '#666' }}>{weather ? weather.daily.summary : ''}</p>
    </div>
  );
}

function News() {
  const [news, setNews] = useState();

  function fetchNews() {
    return axios.get('https://api.hnpwa.com/v0/newest/1.json');
  }

  async function newsData() {
    try {
      const newsData = await fetchNews();
      console.log(newsData);

      setNews(newsData.data);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    newsData();
  }, []);

  return (
    <div>
      {news ? news.map((value, index) => {
        return (
          <div className="news-item" key={index}>
            <a target="_blank" href={value.url}>{value.title}</a>
            <div style={{ fontSize: '.8rem', marginTop: '.3rem', textAlign: 'right', color: '#999' }}>{value.time_ago}</div>
          </div>
        );
      }) : 'Loading'}
    </div>
  );
}

function App() {
  const [weather, setWeather] = useState('');

  function updateWeather(data) {
    setWeather(data);
  }

  return (
    <div className="container">
      <div className="weather-container">
        <WeatherInfo
          updateWeather={updateWeather}
          weather={weather}
        />
      </div>
      <div className="news-container">
        <h2>HackerNews New Stories</h2>
        <News />
      </div>
    </div>
  );
}


export default App;
