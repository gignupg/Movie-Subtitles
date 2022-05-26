# Contributing Guide
Thx for wanting to contribute! Ideas, suggestions, or code contributions are always welcome!
Before building a new feature, please open a pull request to discuss your contribution!

## Installation
To get up and running, these are the steps:
1. Clone the repo
2. `npm install`
3. `npm start`
4. Open `chrome://extensions` in a new tab
5. Click on `Load unpacked`
6. Select the `build` folder in Movie Subtitle's root directory

## Getting Started
Making changes to the code and testing them:
1. Deactivate the real Movie Subtitles extension
2. Activate the unpacked Movie Subtitles extension
3. Make some changes to the code
4. Reload the extension for the changes to take effect
5. Open a video and verify that you can see your changes
7. That's it. Happy coding!

## Building for Production
At the moment this is just a personal note for myself since I'm the only person who can publish a new version to the Chrome Web Store:
1. Update the version number in `src/manifest.json`
2. Remove the root-level `build` folder
3. `NODE_ENV=production npm run build`
4. Zip the newly created `build` folder
5. Upload the zipped `build` folder to the Chrome Web Store
