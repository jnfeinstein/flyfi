# FlyFi status

## Installation

### From a cloned repo
1. Clone the repo to your device.
2. In Chrome, navigate to "chrome://extensions".
3. Click "Load unpacked extension...".
4. Select the cloned repo folder.
5. Engage.

### From the .crx file
1. In Chrome, navigate to "chrome://extensions".
2. Drag the .crx file onto the window and drop it where asked.
3. Click "Add".
3. Engage.

## Usage
This extension will create a colored square in your toolbar representing the status
of FlyFi on your plane.
* Red means FlyFi is disconnected
* Yellow means FlyFi will disconnect soon
* Green means FlyFi is connected
* Gray means FlyFi is in an unknown state
The extension operates by polling the FlyFi server once a minute.  If you want to
stop this or are not on a JetBlue flight with FlyFi, you can disable (and later enable)
the extension on by clicking the square and toggling "Enabled".
