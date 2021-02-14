import {
  calcAverageColorFromImageData,
  calcColorDifference
} from '../../base-components/rwp-colors.js';
import { initCustomElement } from '../../core/core.js';


class RWPProfile extends HTMLElement {
  /** @type {HTMLElement} */
  _header;

  /** @type {HTMLElement} */
  _userInfo;

  constructor() {
    super();

    initCustomElement(this).then(() => {
      this._header = this.shadowRoot.querySelector('#header');
      this._userInfo = this.shadowRoot.querySelector('#user-info');

      this.setUserInfoTextColor();
    });
  }

  setUserInfoTextColor() {
    const headerRect = this._header.getBoundingClientRect();
    const userInfoRect = this._userInfo.getBoundingClientRect();

    let top = userInfoRect.top - headerRect.top;
    let left = userInfoRect.left - headerRect.left;

    if (top === 0) top = userInfoRect.top;
    if (left === 0) left = userInfoRect.left;

    const headerStyle = self.getComputedStyle(this._header);
    const imageSource = RWPProfile.extractBackgroundImageURL(headerStyle.backgroundImage);

    RWPProfile.getImageData(imageSource, 'object-fit: cover', {
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
        this._userInfo.style.setProperty('color', 'black', 'important');
      } else {
        this._userInfo.style.setProperty('color', 'white', 'important');
      }
    });
  }

  /**
   * @callback ImageDataCallback
   * @param {ImageData} imageData
   */

  /**
   * @param {ImageDataCallback} callback
   * @param {string} imageSource
   * @param {string} [imageStyle]
   * @param {object} [canvasOptions]
   * @param {number} [canvasOptions.width=512]
   * @param {number} [canvasOptions.height=512]
   * @param {number} [canvasOptions.selectRectangleX=0]
   * @param {number} [canvasOptions.selectRectangleY=0]
   * @param {number} [canvasOptions.selectRectangleWidth=0]
   * @param {number} [canvasOptions.selectRectangleHeight=0]
   */
  static getImageData(imageSource, imageStyle = '', canvasOptions = {}, callback) {
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

  /** @param {string} backgroundImagePropertyValue */
  static extractBackgroundImageURL(backgroundImagePropertyValue) {
    return backgroundImagePropertyValue.match(/(?<=url\(").*(?="\))/)[0];
  }
}

export default RWPProfile;