// Try to use GPU where possible
import * as tf from '@tensorflow/tfjs-node'
const dfd = require('danfojs-node')
// import * as tf from '@tensorflow/tfjs-node-gpu'
import getModel from './getModel'
import { folderToTensors, bestValidationSave } from './helpers'

async function doTraining() {
  // Read images
  const [X, Y] = await folderToTensors()

  let df = new dfd.DataFrame(Y, {
    columns: ['ferengi', 'klingons', 'starfleet'],
  })

  let dfdata = new dfd.DataFrame(X)

  df.head().print()
  dfdata.head().print()

  df.to_csv('labels.csv')
  dfdata.to_csv('images.csv')

  console.log('BACK Y', df.tensor.shape)
  console.log('BACK X', dfdata.tensor.shape)

  // Cleanup!
  tf.dispose([X, Y])
  console.log('Tensors in memory', tf.memory().numTensors)
}

doTraining()
