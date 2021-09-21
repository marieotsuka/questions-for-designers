//get playlist 
let player;

$.getJSON( "/apis/tracklist.json", function( data ) {
  
  // Setup our new audio player class and pass it the playlist.
  player = new Player(data);

});

// Cache references to DOM elements.
var elms = ['navtrack', 'navtimer','track', 'artist', 'timer', 'duration', 'trackui', 'playBtn', 'pauseBtn', 'prevBtn', 'nextBtn', 'progress', 'trackinfo'];
elms.forEach(function(elm) {
  window[elm] = document.getElementById(elm);
});

/**
 * Player class containing the state of our playlist and where we are in it.
 * Includes all methods for playing, skipping, updating the display, etc.
 * @param {Array} playlist Array of objects with playlist song details ({title, file, howl}).
 */
var Player = function(playlist) {
  this.playlist = playlist;
  this.index = 0;

  // Display the title of the first track.
  if( playlist[this.index].title ){
    track.innerHTML = '1. ' + playlist[this.index].title;
    navtrack.innerHTML = playlist[this.index].title;
    //activate track info
    trackinfo.setAttribute('data-active-track', 1);

  }

  $('.track-item.on').on('click',function(){
    let list_index = parseInt($(this).attr('data-track-number')) - 1;
    console.log(list_index);
    player.skipTo(list_index);
    $('main').attr('data-displaymode', 'player');
  });

};
Player.prototype = {
  /**
   * Play a song in the playlist.
   * @param  {Number} index Index of the song in the playlist (leave empty to play the first or current).
   */
  play: function(index) {

    var self = this;
    var sound;

    index = typeof index === 'number' ? index : self.index;
    var data = self.playlist[index];

    // If we already loaded this track, use the current one.
    // Otherwise, setup and load a new Howl.
    if (data.howl) {
      sound = data.howl;
    } else {
      sound = data.howl = new Howl({
        src: ['/assets/audio/' + data.file + '.mp3'],
        html5: true, // Force to HTML5 so that the audio can stream in (best for large files).
        onload: function(){
          // Display the duration.
          console.log(sound.duration());
          duration.innerHTML = self.formatTime( Math.round(sound.duration() ));
        },
        onplay: function() {    
          // Start updating the progress of the track.
          requestAnimationFrame(self.step.bind(self));
        },
        onend: function() {
          self.skip('next');
        }
      });
    }

    // Begin playing the sound.
    sound.play();
    trackui.setAttribute('data-playing', 'true');

    // Update the track display.
    track.innerHTML = (index + 1) + '. ' + data.title;
    navtrack.innerHTML = data.title;
    artist.innerHTML = data.artist;
    trackinfo.setAttribute('data-active-track', index + 1);

    // Keep track of the index we are currently playing.
    self.index = index;

    $('#moon::after, #amnion' ).addClass('animate');
  },

  /**
   * Pause the currently playing track.
   */
  pause: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Puase the sound.
    sound.pause();

    // Show the play button.
    trackui.setAttribute('data-playing', 'false');

    $('#moon::after, #amnion' ).css('animation-play-state', 'paused');

  },

  /**
   * Skip to the next or previous track.
   * @param  {String} direction 'next' or 'prev'.
   */
  skip: function(direction) {
    var self = this;

    // Get the next track based on the direction of the track.
    var index = 0;
    if (direction === 'prev') {
      index = self.index - 1;
      if (index < 0) {
        index = self.playlist.length - 1;
      }
    } else {
      index = self.index + 1;
      if (index >= self.playlist.length) {
        index = 0;
      }
    }

    self.skipTo(index);
  },

  /**
   * Skip to a specific track based on its playlist index.
   * @param  {Number} index Index in the playlist.
   */
  skipTo: function(index) {
    var self = this;

    // Stop the current track.
    if (self.playlist[self.index].howl) {
      self.playlist[self.index].howl.stop();
    }

    // Reset progress.
    progress.style.width = '0%';

    // Play the new track.
    self.play(index);
  },

  /**
   * The step called within requestAnimationFrame to update the playback position.
   */
  step: function() {
    var self = this;

    // Get the Howl we want to manipulate.
    var sound = self.playlist[self.index].howl;

    // Determine our current seek position.
    var seek = sound.seek() || 0;
    timer.innerHTML = self.formatTime(Math.round(seek));
    navtimer.innerHTML = self.formatTime(Math.round(seek));
    progress.style.width = (((seek / sound.duration()) * 100) || 0) + '%';

    // If the sound is still playing, continue stepping.
    if (sound.playing()) {
      requestAnimationFrame(self.step.bind(self));
    }
  },

  /**
   * Format the time from seconds to M:SS.
   * @param  {Number} secs Seconds to format.
   * @return {String}      Formatted time.
   */
  formatTime: function(secs) {
    var minutes = Math.floor(secs / 60) || 0;
    var seconds = (secs - minutes * 60) || 0;

    return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
  }
};

// Bind our player controls.
trackui.addEventListener('click', function() {
  if( trackui.getAttribute('data-playing') == 'true' ){
    player.pause();
  }else{
    player.play();
  } 
});

prevBtn.addEventListener('click', function() {
  player.skip('prev');
});
nextBtn.addEventListener('click', function() {
  player.skip('next');
});



/*-----------------------------------------
    INFO REVEAL
-----------------------------------------*/

$(document).ready(function(){
  $('main').attr('data-displaymode', 'player');

  $('#track-info-menu').click(function(){
    // fade in track info
    $('main').attr('data-displaymode', 'info');
    $('#moon').removeClass('phasein').addClass('phaseout')     
  });

  $('#navtrack-link, #back-to-player').on('click', function(){
    $("html, body").animate({scrollTop: 0}, 300); //scroll back to top

    // fade in moon player
    $('main').attr('data-displaymode', 'player');
    $('#moon').removeClass('phaseout').addClass('phasein');
  });

  $('#transmissions-link').on('click', function(){
    $("html, body").animate({scrollTop: 0}, 300); //scroll back to top

    // fade in transmission
    $('main').attr('data-displaymode', 'list');
    $('#moon').removeClass('phaseout').addClass('phasein');
  });


});


