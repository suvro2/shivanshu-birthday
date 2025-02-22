window.addEventListener('load', onWndLoad, false);

function onWndLoad() {
  var slider = document.querySelector('.slider');
  var sliders = Array.from(slider.children);
  var initX = null;
  var transX = 0;
  var rotZ = 0;
  var transY = 0;
  var curSlide = null;
  var Z_DIS = 50;
  var Y_DIS = 10;
  var TRANS_DUR = 3.5;

  // Array of audio files
  var audioFiles = [
    'audio/audio3.mp3', // Music for Slide 1
    'audio/audio2.mp3', // Music for Slide 2
    'audio/audio1.mp3', // Music for Slide 3
    'audio/audio5.mp3', // Music for Slide 4
    'audio/audio4.mp3' // Music for Slide 5
  ];

  var audioElements = audioFiles.map((file) => {
    let audio = new Audio(file);
    audio.loop = true;         // Enable looping
    audio.volume = 0.70;       // Set volume to 75%
    return audio;
  });

  var currentAudio = null; // Variable to track the currently playing audio

  function playAudioForSlide(index) {
    if (currentAudio) {
      currentAudio.pause();           // Pause the current audio if playing
      currentAudio.currentTime = 0;   // Reset to the beginning
    }
    currentAudio = audioElements[index]; // Set the new audio
    currentAudio.play();               // Play the new audio
  }

  var images = document.querySelectorAll('img');
  for (var i = 0; i < images.length; i++) {
    images[i].onmousemove = function (e) {
      e.preventDefault();
    };
    images[i].ondragstart = function (e) {
      return false;
    };
  }

  function init() {
    var z = 0, y = 0;

    for (var i = sliders.length - 1; i >= 0; i--) {
      sliders[i].style.transform =
        'translateZ(' + z + 'px) translateY(' + y + 'px)';
      z -= Z_DIS;
      y += Y_DIS;
    }
    // Add "Swipe the card" text under the first slide
    if (sliders.length > 0) {
      const swipeTextFirst = document.createElement('div');
      swipeTextFirst.classList.add('swipe-text', 'swipe-first');
      swipeTextFirst.innerText = 'Swipe the card';
      sliders[sliders.length - 1].appendChild(swipeTextFirst);
    }



    attachEvents(sliders[sliders.length - 1]);
    playAudioForSlide(0);
  }

  function attachEvents(elem) {
    curSlide = elem;
    curSlide.addEventListener('mousedown', slideMouseDown, false);
    curSlide.addEventListener('touchstart', slideMouseDown, false);
  }

  init();

  function slideMouseDown(e) {
    if (e.touches) {
      initX = e.touches[0].clientX;
    } else {
      initX = e.pageX;
    }

    document.addEventListener('mousemove', slideMouseMove, false);
    document.addEventListener('touchmove', slideMouseMove, false);

    document.addEventListener('mouseup', slideMouseUp, false);
    document.addEventListener('touchend', slideMouseUp, false);
  }

  function slideMouseMove(e) {
    var mouseX;

    if (e.touches) {
      mouseX = e.touches[0].clientX;
    } else {
      mouseX = e.pageX;
    }

    transX += mouseX - initX;
    rotZ = transX / 20;
    transY = -Math.abs(transX / 15);

    curSlide.style.transition = 'none';
    curSlide.style.transform =
      'translateX(' + transX + 'px) rotateZ(' + rotZ + 'deg) translateY(' + transY + 'px)';

    var j = 1;
    for (var i = sliders.length - 2; i >= 0; i--) {
      sliders[i].style.transform =
        'translateX(' +
        transX / (2 * j) +
        'px) rotateZ(' +
        rotZ / (2 * j) +
        'deg) translateY(' +
        Y_DIS * j +
        'px) translateZ(' +
        -Z_DIS * j +
        'px)';
      sliders[i].style.transition = 'none';
      j++;
    }

    initX = mouseX;
    e.preventDefault();



    // Check if we're on the last slide
    if (Math.abs(transX) >= curSlide.offsetWidth * 0.8) {
      document.removeEventListener('mousemove', slideMouseMove, false);
      document.removeEventListener('touchmove', slideMouseMove, false);

      curSlide.style.transition = 'ease 0.2s';
      curSlide.style.opacity = 0;



      // Check if it's the last slide
      if (sliders.length > 1) {
        curSlide.remove();
        sliders.pop();
        attachEvents(sliders[sliders.length - 1]);

        // Play the audio for the new current slide
        playAudioForSlide(sliders.length - 1);
      } else {

        // Redirect to the ending page on the last slide
        setTimeout(() => {
          window.location.href = "ending.html";
        }, 1000);
      }

      // Add "Swipe card for next page" text under the last slide
      if (sliders.length === 1) {
        const swipeTextLast = document.createElement('div');
        swipeTextLast.classList.add('swipe-text', 'swipe-last');
        swipeTextLast.innerText = 'Swipe last card for next page';
        sliders[0].appendChild(swipeTextLast);
      }

      slideMouseUp();
    }
  }

  function slideMouseUp() {
    transX = 0;
    rotZ = 0;
    transY = 0;

    curSlide.style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR + 's';
    curSlide.style.transform =
      'translateX(' + transX + 'px) rotateZ(' + rotZ + 'deg) translateY(' + transY + 'px)';

    var j = 1;
    for (var i = sliders.length - 2; i >= 0; i--) {
      sliders[i].style.transition = 'cubic-bezier(0,1.95,.49,.73) ' + TRANS_DUR / (j + 0.9) + 's';
      sliders[i].style.transform =
        'translateX(' +
        transX +
        'px) rotateZ(' +
        rotZ +
        'deg) translateY(' +
        Y_DIS * j +
        'px) translateZ(' +
        -Z_DIS * j +
        'px)';
      j++;
    }

    document.removeEventListener('mousemove', slideMouseMove, false);
    document.removeEventListener('touchmove', slideMouseMove, false);
  }
}