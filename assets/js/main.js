let date_today = new Date();
let storedDate;
if (localStorage.getItem('date')) {
  storedDate = new Date(localStorage.getItem('date'));
}

// 12시간 마다 한번씩 배경화면을 새로 불러온다.
if (!storedDate || storedDate < today) {
  localStorage.removeItem('date');
  localStorage.removeItem('wallpapers');
  today.setHours(today.getHours() + 12);
  localStorage.setItem('date', today);
}

let wallpapers = JSON.parse(localStorage.getItem('wallpapers'));

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
      $('.background-overlay').addClass('loaded');
      $('.info-block').addClass('loaded');
    });
}

function getBgImage() {
  let wallpapers = JSON.parse(localStorage.getItem('wallpapers'));
  if (wallpapers) {
    let randomWallpaper = wallpapers[Math.floor(Math.random() * wallpapers.length)];
    background_image = randomWallpaper.urls.regular
    
    console.log('getBgImage: ' + background_image)
    showBackgroundImage(background_image);
  }
}

function getNewWallpapers() {
  var accessKey = '69fa36678b8cff77ff1c92f90d7e7ba7a42f412bbabc69e25e21940c474f742f'
  let url = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=20&`;
  let wallpapers = [];
  $.getJSON(url, function(results) {
    results.forEach(function(wallpaper) {
      wallpapers.push(wallpaper);
    });
    localStorage.setItem('wallpapers', JSON.stringify(wallpapers));
    getBgImage();
  });
}

$(document).ready(function() {
  getBgImage();
  if (!wallpapers || wallpapers.length === 0) {
    // 배경화면 주소를 일괄적으로 20개 정도 가져옴.
    getNewWallpapers();
  }
});
