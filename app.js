const path = require('path');

// Change working directory to backend so all relative paths work correctly
process.chdir(path.join(__dirname, 'backend'));

// Require the actual backend entry point
require('./app.js');
