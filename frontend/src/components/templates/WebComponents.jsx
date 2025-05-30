// src/components/templates/WebComponents.js
export const webComponents = {
    button: {
      type: 'rectangle',
      width: 120,
      height: 40,
      fill: '#4f46e5',
      cornerRadius: 8,
      shadowColor: 'black',
      shadowBlur: 10,
      shadowOpacity: 0.2,
      text: 'Button',
      fontSize: 14,
      fontFamily: 'Arial',
      fontColor: 'white',
      draggable: true,
      componentType: 'button'
    },
    card: {
      type: 'rectangle',
      width: 250,
      height: 150,
      fill: 'white',
      cornerRadius: 12,
      shadowColor: 'black',
      shadowBlur: 15,
      shadowOpacity: 0.1,
      draggable: true,
      componentType: 'card'
    },
    input: {
      type: 'rectangle',
      width: 200,
      height: 36,
      fill: 'white',
      cornerRadius: 6,
      stroke: '#d1d5db',
      strokeWidth: 1,
      text: '',
      fontSize: 14,
      fontFamily: 'Arial',
      fontColor: '#374151',
      draggable: true,
      componentType: 'input'
    }
  };