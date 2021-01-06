import * as tf from '@tensorflow/tfjs-node'
// import * as tf from '@tensorflow/tfjs-node-gpu'
import * as fs from 'fs'
import { default as glob } from 'glob'

function encodeDir(filePath) {
  if (filePath.includes('ferengi')) return 0
  if (filePath.includes('klingons')) return 1
  if (filePath.includes('starfleet')) return 2

  // Should never get here
  console.error('Unrecognized folder')
  process.exit(1)
}

function shuffleCombo(array, array2) {
  let counter = array.length
  console.assert(array.length === array2.length)
  let temp, temp2
  let index = 0
  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    index = (Math.random() * counter) | 0
    // Decrease counter by 1
    counter--
    // And swap the last element with it
    temp = array[counter]
    temp2 = array2[counter]
    array[counter] = array[index]
    array2[counter] = array2[index]
    array[index] = temp
    array2[index] = temp2
  }
}

export function folderToTensors() {
  return new Promise((resolve, reject) => {
    const FILE_PATH = 'files'
    // create stack in JS
    const XS = []
    const YS = []

    // Read images
    console.log('Identifying PNG List')

    const pngs = glob.sync('files/**/*.png')
    const jpgs = glob.sync('files/**/*.jpg')
    console.log('PNGs', pngs.length)
    console.log('JPGs', jpgs.length)

    const files = [...pngs, ...jpgs]

    console.log(`${files.length} Files Found`)

    console.log('Now converting to tensors')
    files.forEach((file) => {
      const imageData = fs.readFileSync(file)
      const answer = encodeDir(file)
      const imageTensor = tf.node.decodeImage(imageData, 1)
      const smallTensor = tf.image.resizeNearestNeighbor(
        imageTensor,
        [28, 28],
        true
      )

      const smooshedTensor = smallTensor.reshape([784])

      // Store in memory
      YS.push(answer)
      XS.push(smooshedTensor)

      tf.dispose([imageTensor, smallTensor])
    })

    // Shuffle the data (keep XS[n] === YS[n])
    shuffleCombo(XS, YS)

    // Stack values
    console.log('Stacking')
    const X = tf.stack(XS)
    const Y = tf.oneHot(YS, 3)

    console.log('Images all converted to tensors:')
    console.log('X', X.shape)
    console.log('Y', Y.shape)

    // Normalize X to values 0 - 1
    const XNORM = X.div(255)
    // cleanup
    tf.dispose([XS, X])

    resolve([XNORM, Y])
  })
  // })
}

function printSign(val) {
  console.log(`
  ╔════════════╗
  ║   SAVING   ║
  ║   %${(val * 100).toFixed(2)}   ║
  ╚════════════╝
  `)
}

export async function bestValidationSave(model, savePath, best) {
  return {
    onEpochEnd: async (_epoch, logs) => {
      if (logs.val_acc > best) {
        printSign(logs.val_acc)
        model.save(savePath)
        best = logs.val_acc
      }
    },
  }
}
