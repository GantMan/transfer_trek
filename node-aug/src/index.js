import { ImageAugmentation } from 'image-augmentation';
// https://piercus.github.io/image-augment/
let ia = new ImageAugmentation();

// ia.addPadding({
//   probability: 1,
//   amount: 100,
//   background: { b: 255, g: 255, r: 255 },
//   padding: 'top',
//   image: './starfleet'
// });

// ia.addPadding({
//   probability: 1,
//   amount: 100,
//   background: { b: 255, g: 255, r: 255 },
//   padding: 'right',
//   image: './starfleet'
// });

ia.resize({
  height: 500,
  width: 500,
  probability: 1,
  image: './squeezers'
});


// ia.executeMultiple({
//   execute: async () => {
//     const image = './ferengi';
//     //  await ia.flipY({ image, probability: 1 });
//     // await ia.rotate({
//     //   probability: 0.2,
//     //   rotationDegree: 10,
//     //   image: './ferengi'
//     // });

//     ia.addPadding({
//       probability: 0.4,
//       amount: 120,
//       background: { b: 255, g: 255, r: 255 },
//       padding: 'top',
//       image: './ferengi'
//     });    
    
//   },
//   outputNumber: 10
// });