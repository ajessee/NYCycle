// Load all the channels within this directory and all subdirectories.
// Channel files must be named *_channel.js.

const application = require.context('.', true, /.js$/)
application.keys().forEach(application)

// Setup main JS object
window.NYCycle = {
    viewHeight: window.innerHeight * 0.01
};

document.documentElement.style.setProperty('--vh', `${window.NYCycle.viewHeight}px`);

// recalculate the --vh viewHeight CSS variable on window resize
window.addEventListener('resize', () => {
    window.NYCycle.viewHeight = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${window.NYCycle.viewHeight}px`);
});
