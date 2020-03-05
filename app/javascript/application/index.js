// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

const application = require.context('.', true, /.js$/)
application.keys().forEach(application)


// Setup main JS object
window.NYCycle = {
  resizeScreen: function(){
    this.viewHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${this.viewHeight}px`);
    return this.viewHeight;
  }
};

// recalculate the --vh viewHeight CSS variable on window resize
window.addEventListener('resize', () => {
  window.NYCycle.resizeScreen();
});

document.documentElement.style.setProperty('--vh', `${window.NYCycle.viewHeight}px`);