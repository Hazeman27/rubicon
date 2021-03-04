import {
  calcAverageColorFromImageData,
  calcColorDifference
} from '../base-components/rwp-colors.js';


function getImageData(imageSource, imageStyle = '', canvasOptions = {}, callback) {
  const {
    width = 512,
    height = 512,
    selectRectangleX = 0,
    selectRectangleY = 0,
    selectRectangleWidth = 0,
    selectRectangleHeight = 0
  } = canvasOptions;

  const image = new Image(width, height);
  const canvas = document.createElement('canvas');
  const canvasContext = canvas.getContext('2d');

  canvas.width = width;
  canvas.height = height;

  image.src = imageSource;
  image.crossOrigin = 'Anonymous';

  image.style.cssText = imageStyle;

  image.onload = () => {
    canvasContext.drawImage(image, 0, 0);
    callback(canvasContext.getImageData(
      selectRectangleX,
      selectRectangleY,
      selectRectangleWidth,
      selectRectangleHeight
    ));
  };
}

function extractBackgroundImageURL(backgroundImagePropertyValue) {
  return backgroundImagePropertyValue.match(/(?<=url\(").*(?="\))/)[0];
}

export function RWPProfile({ shadowRoot }) {
  const header = shadowRoot.querySelector('#header');
  const userInfo = shadowRoot.querySelector('#user-info');

  const setUserInfoTextColor = () => {
    const headerRect = header.getBoundingClientRect();
    const userInfoRect = userInfo.getBoundingClientRect();
    
    let top = userInfoRect.top - headerRect.top;
    let left = userInfoRect.left - headerRect.left;

    if (top === 0) top = userInfoRect.top;
    if (left === 0) left = userInfoRect.left;

    const headerStyle = self.getComputedStyle(header);
    const imageSource = extractBackgroundImageURL(headerStyle.backgroundImage);

    getImageData(imageSource, 'object-fit: cover', {
      width: headerRect.width,
      height: headerRect.height,
      selectRectangleX: top,
      selectRectangleY: left,
      selectRectangleWidth: userInfoRect.width,
      selectRectangleHeight: userInfoRect.height
    }, imageData => {
      const averageColor = calcAverageColorFromImageData(imageData, 'white');

      const colorDifference = calcColorDifference(
        'black',
        `rgb(${averageColor.join(',')})`
      );

      if (colorDifference.isGood) {
        userInfo.style.setProperty('color', 'black', 'important');
      } else {
        userInfo.style.setProperty('color', 'white', 'important');
      }
    });
  };

  setUserInfoTextColor(); 
}

export const template = `
  <template>
    <rwp-embed>
      <header id="header" slot="header">
        <img id="avatar" src="https://source.unsplash.com/random/512/?girl" alt="avatar">
        <section id="user-info">
          <h3 id="name">Rubic Stark</h3>
          <h5 id="username">@rubicstark</h5>
          <h5 id="status">online</h5>
        </section>
      </header>
      <main id="content" slot="content">
        <ul>
          <li>About</li>
          <li>Get a burger</li>
          <li>I want a massage</li>
          <li>Settings</li>
        </ul>
      </main>
    </rwp-embed>
    <style>
      @import './styles/main.css';

      #header {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: .5em;
        padding: 1em;
        background-image: url('https://source.unsplash.com/random/512/?dark');
        background-size: cover;
      }

      #header * {
        margin: 0;
      }

      #avatar {
        --size: 64px;

        align-self: center;
        width: var(--size);
        height: var(--size);
        border-radius: 50%;
        object-fit: cover;
      }

      #user-info {
        display: grid;
        grid: "name name" "username status";
        gap: inherit;
      }

      #name {
        grid-area: name;
        align-self: end;
      }
      
      #username {
        grid-area: username;
        align-self: start;
      }

      #status {
        grid-area: status;
        align-self: start;
      }
    </style>
  </template>
`;