// Global teardown function
module.exports = async function globalTeardown() {
  console.log('Global teardown - started');
  
  // Import the server only during teardown to avoid issues
  const { server } = require('../../index');
  
  // Create a promise for server shutdown
  await new Promise((resolve) => {
    if (server && server.close) {
      console.log('Closing server in global teardown');
      server.close(() => {
        console.log('Server successfully closed in global teardown');
        resolve();
      });
    } else {
      console.log('No server to close in global teardown');
      resolve();
    }
  });
  
  console.log('Global teardown - complete');
}; 