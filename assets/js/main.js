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
    });
}

function getBgImage() {
  let songs = JSON.parse(localStorage.getItem('songs'));
  if (songs) {
    let randomSong = songs[Math.floor(Math.random() * songs.length)];
    background_image = randomSong.url
    console.log('getBgImage: ' + background_image)
    showBackgroundImage(background_image);
  }
}

function getNewSongs() {
  let songs = [];
  var url = 'https://cors-anywhere.herokuapp.com/www.melon.com/chart/index.htm';
  $.get(url, function(response) {
    listMusic = /<table[\s|\S]*?>[\s|\S]*?<\/table>/g.exec(response)[0].match(/<tr class="lst50"[\s|\S]*?>[\s|\S]*?<\/tr>/g);
    for (i in listMusic) {
      var data = new Object();
      data.url = /src="([\S]*)\/melon/g.exec(listMusic[i])[1]
      data.title = /<div class="ellipsis rank01"><span>[\s|\S]*?>([\s|\S]*?)<\/a>/g.exec(listMusic[i])[1]
      data.artist = /<div class="ellipsis rank02">[\s|\S]*?>([\s|\S]*?)<\/a>/g.exec(listMusic[i])[1]
      data.album = /<div class="ellipsis rank03">[\s|\S]*?>([\s|\S]*?)<\/a>/g.exec(listMusic[i])[1]
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
