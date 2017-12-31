import React, { Component } from 'react';
import ColorPicker from './ColorPicker/ColorPicker';
import ComplimentaryColor from'./ComplimentaryColor/ComplimentaryColor';
import SplitComplimentaryColors from'./SplitComplimentaryColors/SplitComplimentaryColors';


class Color extends Component {
  constructor(props) {
    super(props);
    const color = '#ffae4e';
    const compColor = this.convertHex(color, 'comp');
    const split1 = this.convertHex(color, 'split1');
    const split2 = this.convertHex(color, 'split2');
    this.state = {
      showPicker: false,
      color: color,
      compColor: compColor,
      split1: split1,
      split2: split2
    }
  }


  handleToggleColorPicker = () => {
    this.setState( (prevState) => {
      return {
        showPicker: !prevState.showPicker
      }
    });
  }

  handleChangeColor = (color) => {
    this.setState({
      color: color.hex,
      compColor: this.convertHex(color.hex, 'comp'),
      split1: this.convertHex(color.hex, 'split1'),
      split2: this.convertHex(color.hex, 'split2')
    })
  }

  handleClosePicker = () => {
    this.setState({
      showPicker: false
    })
  }

  // Adapted thanks to Edd https://stackoverflow.com/a/37657940/1965441
  convertHex(hex, whichColor){

      // Convert hex to rgb
      // Credit to Denis http://stackoverflow.com/a/36253499/4939630
      var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length/3 + '})', 'g')).map(function(l) { return parseInt(hex.length%2 ? l+l : l, 16); }).join(',') + ')';

      // Get array of RGB values
      rgb = rgb.replace(/[^\d,]/g, '').split(',');

      var r = rgb[0], g = rgb[1], b = rgb[2];

      // Convert RGB to HSL
      // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
      r /= 255.0;
      g /= 255.0;
      b /= 255.0;
      var max = Math.max(r, g, b);
      var min = Math.min(r, g, b);
      var h, s, l = (max + min) / 2.0;

      if(max === min) {
          h = s = 0;  //achromatic
      } else {
          var d = max - min;
          s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

          if(max === r && g >= b) {
              h = 1.0472 * (g - b) / d ;
          } else if(max === r && g < b) {
              h = 1.0472 * (g - b) / d + 6.2832;
          } else if(max === g) {
              h = 1.0472 * (b - r) / d + 2.0944;
          } else if(max === b) {
              h = 1.0472 * (r - g) / d + 4.1888;
          }
      }

      h = h / 6.2832 * 360.0 + 0;

      // Shift hue to opposite side of wheel and convert to [0-1] value
      if (whichColor === 'comp') h+= 180;;
      if (whichColor === 'split1') h+= 160;
      if (whichColor === 'split2') h+= 200;

      if (h > 360) { h -= 360; }
      h /= 360;

      // Convert h s and l values into r g and b values
      // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
      if(s === 0){
          r = g = b = l; // achromatic
      } else {
          var hue2rgb = function hue2rgb(p, q, t){
              if(t < 0) t += 1;
              if(t > 1) t -= 1;
              if(t < 1/6) return p + (q - p) * 6 * t;
              if(t < 1/2) return q;
              if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
              return p;
          };

          var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          var p = 2 * l - q;

          r = hue2rgb(p, q, h + 1/3);
          g = hue2rgb(p, q, h);
          b = hue2rgb(p, q, h - 1/3);
      }

      r = Math.round(r * 255);
      g = Math.round(g * 255);
      b = Math.round(b * 255);

      // Convert r b and g values to hex
      rgb = b | (g << 8) | (r << 16);
      return "#" + (0x1000000 | rgb).toString(16).substring(1);
  }

  getComplimentary(h) {
    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 180;
    if (h > 360) { h -= 360; }
    h /= 360;
    return h
  }

  get1stSplit(h) {
    // Shift hue to opposite side of wheel and convert to [0-1] value
    h+= 160;
    if (h > 360) { h -= 360; }
    h /= 360;
    return h
  }

  render() {
    return (
      <React.Fragment>
        <ColorPicker
          color={this.state.color}
          toggleColorPicker={this.handleToggleColorPicker}
          showPicker={this.state.showPicker}
          changeColor={this.handleChangeColor}
          closePicker={this.handleClosePicker}/>
        <ComplimentaryColor
          color={this.state.color}
          compColor={this.state.compColor}/>
        <SplitComplimentaryColors
          color={this.state.color}
          split1={this.state.split1}
          split2={this.state.split2}/>
      </React.Fragment>
    )
  }
}

export default Color;
