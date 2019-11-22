let date_today = new Date();
let storedDate;
if (localStorage.getItem('date')) {
  storedDate = new Date(localStorage.getItem('date'));
}

// 12시간 마다 한번씩 배경화면을 새로 불러온다.
if (!storedDate || storedDate < date_today) {
  localStorage.removeItem('date');
  localStorage.removeItem('songs');
  date_today.setHours(date_today.getHours() + 12);
  localStorage.setItem('date', date_today);
}

let songs = JSON.parse(localStorage.getItem('songs'));

function showBackgroundImage(path) {
  $('.body-wrapper').addClass('first-load');
  $('<img/>')
    .attr('src', path)
    .on('load', function() {
      $(this).remove();


      $('.body-wrapper.first-load').css(
        'background-image',
        'url(' + path + ')'
      );
      $('.body-wrapper.first-load').css(
        'background-size',
        'inherit'
      );
      $('.body-wrapper.first-load').css(
        'background-repeat',
        'no-repeat'
      );

  // background: #eb01a5;
  // background-image: url("IMAGE_URL"); /* fallback */
  // background-image: url("IMAGE_URL"), linear-gradient(#eb01a5, #d13531); /* W3C */

      $('.background-overlay').addClass('loaded');
      $('.info-block').addClass('loaded');
      $('.song-info-card').addClass('loaded');
    });
}

function showInfoCard(song) {
  $('.song-info-card')
    .find('.title')
    .html(song.title);
  $('.song-info-card')
    .find('.overview')
    .html(song.album);
  $('.song-info-card')
    .find('.score')
    .html(song.artist);
  /*
  $('.song-info-card')
    .find('.year')
    .html(movie.release_date.substring(0, 4));

  $('.song-info-card')
    .find('.show-trailer')
    .click(function() {
      showTrailerOnFirstPage(movie.id);
    });
  $('.song-info-card')
    .find('.buy-on-amazon')
    .attr(
      'href',
      `https://www.amazon.com/gp/search?ie=UTF8&tag=raterfox08-20&linkCode=ur2&linkId=365279f34ba1edc9f1cbfff1b42ae96c&camp=1789&creative=9325&index=instant-video&keywords=${
        song.title
      }`
    );
  // if (movie.imdb_id) {
  //   $('.movie-info-card .show-on-imdb').click(function () {
  //     window.open('https://www.imdb.com/title/' + movie.imdb_id, 'iMDB');
  //   });
  // };
  $('.song-info-card')
    .find('.show-on-raterfox')
    .click(function() {
      window.open('https://www.raterfox.com');
    });
  */
}


function getBgImage() {
  let songs = JSON.parse(localStorage.getItem('songs'));
  if (songs) {
    let randomSong = songs[Math.floor(Math.random() * songs.length)];
    background_image = randomSong.url
    console.log('getBgImage: ' + background_image)
    showBackgroundImage(background_image);
    showInfoCard(randomSong);
  }
}

function getNewSongs() {
  let songs = [];
  var url = 'https://cors-anywhere.herokuapp.com/https://www.melon.com/chart/index.htm';
  $.get(url, function(response) {
    listMusic = /<table[\s|\S]*?>[\s|\S]*?<\/table>/g.exec(response)[0].match(/<tr class="lst50"[\s|\S]*?>[\s|\S]*?<\/tr>/g);
    for (i in listMusic) {
      //console.log(listMusic[i]);
      var data = new Object();
      data.id = /<tr[\s|\S]*?data-song-no="([\s|\S]*?)">/g.exec(listMusic[i])[1];
      data.url = /src="([\S]*)\/melon/g.exec(listMusic[i])[1];
      data.title = /<div class="ellipsis rank01"><span>[\s|\S]*?>([\s|\S]*?)<\/a>/g.exec(listMusic[i])[1];
      data.artist = /<div class="ellipsis rank02">[\s|\S]*?>([\s|\S]*?)<\/a>/g.exec(listMusic[i])[1];
      data.album = /<div class="ellipsis rank03">[\s|\S]*?>([\s|\S]*?)<\/a>/g.exec(listMusic[i])[1];
      // console.log(data.url);
      // console.log(data.title);
      // console.log(data.artist);
      // console.log(data.album);
      // console.log('\n')
      songs.push(data);
      localStorage.setItem('songs', JSON.stringify(songs));
      getBgImage();
    }
  });
}


$(document).ready(function() {
  getBgImage();
  if (!songs || songs.length === 0) {
    // 배경화면 주소를 일괄적으로 20개 정도 가져옴.
    getNewSongs();
  }
});
