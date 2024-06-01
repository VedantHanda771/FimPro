const apiKey = 'f7f711d4c31496b8610f0f879286dc67';
    const searchInput = document.getElementById('searchInput');
    const searchMovieContainer = document.getElementById('searchMovieContainer');
    const homeMovieContainer = document.getElementById('homeMovieContainer');
    const topRatedMovieContainer = document.getElementById('topRatedMovieContainer');
    const genreContainer = document.getElementById('genreContainer');
    const homePage = document.getElementById('homePage');
    const searchPage = document.getElementById('searchPage');
    const topRatedPage = document.getElementById('topRatedPage');
    const homeLink = document.querySelector('.navbar-brand');
    const homeNavItem = document.getElementById('homeNavItem');
    const searchNavItem = document.getElementById('searchNavItem');
    const topRatedNavItem = document.getElementById('topRatedNavItem');
    const searchPageHeading = document.getElementById('searchPageHeading');
    const homePageHeading = document.getElementById('homePageHeading');
    const homePageGenre = document.getElementById('homePageGenre');
    let selectedGenre = '';

    async function searchMovies() {
      const query = searchInput.value;
      const url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        displayMovies(movies, searchMovieContainer);
      } catch (error) {
        console.error('Error fetching movies: ', error);
      }
    }

    async function fetchMoviesByGenre(genreId, genreName) {
      console.log("Selected genre:", genreName);
      selectedGenre = genreName;
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        displayMovies(movies, homeMovieContainer);
        homePageHeading.innerText = `Movies - ${genreName}`;
        homePageGenre.innerText = `Genre: ${genreName}`;
      } catch (error) {
        console.error('Error fetching genre movies: ', error);
      }
    }

    async function fetchTopRatedMovies() {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=vote_average.desc`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        displayMovies(movies, topRatedMovieContainer);
      } catch (error) {
        console.error('Error fetching top rated movies: ', error);
      }
    }

    async function fetchRecommendedMovies() {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=popularity.desc`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const movies = data.results;
        displayMovies(movies, homeMovieContainer);
        homePageHeading.innerText = "Recommended Movies";
        homePageGenre.innerText = "";
      } catch (error) {
        console.error('Error fetching recommended movies: ', error);
      }
    }

    async function fetchTrailer(movieId) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        const trailers = data.results;
        // Assuming the first trailer is the official trailer
        if (trailers.length > 0) {
          const trailerKey = trailers[0].key;
          window.location.href = `https://www.youtube.com/watch?v=${trailerKey}`;
        } else {
          console.log('No trailer available for this movie');
        }
      } catch (error) {
        console.error('Error fetching trailer: ', error);
      }
    }

    function displayMovies(movies, container) {
      container.innerHTML = '';
      movies.forEach(movie => {
        const movieCard = `
          <div class="col-md-4 col-sm-6 mb-4">
            <div class="card" data-toggle="popover" title="${movie.title}" data-content="${movie.overview}" onclick="fetchTrailer(${movie.id})">
              <img src="https://image.tmdb.org/t/p/w500/${movie.poster_path}" class="card-img-top" alt="${movie.title}">
              <div class="card-body">
                <h5 class="card-title">${movie.title}</h5>
                <p class="card-text">Rating: ${movie.vote_average}/10</p>
              </div>
            </div>
          </div>
        `;
        container.innerHTML += movieCard;
      });
      $(function () {
        $('[data-toggle="popover"]').popover({
          trigger: 'hover'
        });
      });
    }

    function openSearchPage() {
      homePage.style.display = 'none';
      searchPage.style.display = 'block';
      topRatedPage.style.display = 'none';
      searchInput.focus();
      homeNavItem.querySelector('.nav-link').classList.remove('active');
      topRatedNavItem.querySelector('.nav-link').classList.remove('active');
      searchNavItem.querySelector('.nav-link').classList.add('active');
    }

    function openTopRatedPage() {
      homePage.style.display = 'none';
      searchPage.style.display = 'none';
      topRatedPage.style.display = 'block';
      fetchTopRatedMovies();
      homeNavItem.querySelector('.nav-link').classList.remove('active');
      searchNavItem.querySelector('.nav-link').classList.remove('active');
      topRatedNavItem.querySelector('.nav-link').classList.add('active');
    }

    function goToHomePage() {
      homePage.style.display = 'block';
      searchPage.style.display = 'none';
      topRatedPage.style.display = 'none';
      fetchRecommendedMovies();
      searchNavItem.querySelector('.nav-link').classList.remove('active');
      topRatedNavItem.querySelector('.nav-link').classList.remove('active');
      homeNavItem.querySelector('.nav-link').classList.add('active');
      if (selectedGenre) {
        homePageHeading.innerText = `Movies - ${selectedGenre}`;
        homePageGenre.innerText = `Genre: ${selectedGenre}`;
      } else {
        homePageHeading.innerText = "Recommended Movies";
        homePageGenre.innerText = "";
      }
    }

    window.onload = function() {
      fetchRecommendedMovies();
    };