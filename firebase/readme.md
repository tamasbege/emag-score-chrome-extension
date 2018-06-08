This part contains all the Firebase related files of the tracker. The actual implementations can be found in the functions/index.js.

To deploy the functions follow the steps:

1. install the Firebase CLI with npm

    npm install -g firebase-tools
    
2. open a console/terminal/cmd and write

    firebase login
    
2. change the URL in the .firebaserc to match your project name

3. open a terminal/console/cmd and write

    firebase deploy --only functions
    
    
If you did everything right, you should see a success message and some URLs for accessing your freshly deployed functions.
