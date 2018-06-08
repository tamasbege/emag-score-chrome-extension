This part contains all the extension related files. To be able to use the extension, you have to have npm installed and then just execute

npm run build

which will package the app into a more compact format with some help from webpack and create a folder dist, whcih is basically where your extension "lives".

Now, you only have to add the unpacked extension folder to Chrome and you're good to go.

P.S. Don't forget about the Firebase part ;)
