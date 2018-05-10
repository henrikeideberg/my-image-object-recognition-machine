import * as tf from '@tensorflow/tfjs';

export class Model {
  constructor() {
    this.machine = null;
    this.data = null;
    this.history = [];
    this.predictionResult = null;
    this.imageSize = 100;
  }
  
  /*
   * Method to create and compile the convolutional neural network.
   * This model/machine is inspired by https://js.tensorflow.org/tutorials/mnist.html.
  */
  createAndCompileModel(inputSettings,
                        modelSettings,
                        convSettings,
                        nnSettings) {

    //(re)set our class variables
    this.machine = null;
    this.data = null;
    this.history = [];
    this.predictionResult = null;
    this.imageSize = 100;
    //instantiate our Sequential model with tf.sequential:
    this.machine = tf.sequential();

    var radix = 10;
    var returnString = "";

    try {
    /* 
     * Add the configured two-dimensional convolutional layer(s).
    */    
    for(let i=0; i<convSettings.nrOfLayers.length; i++){
      if(i === 0) {//First layer has a fixed input shape
        this.machine.add(tf.layers.conv2d({
          inputShape: [this.imageSize, this.imageSize, 1],
          kernelSize: parseInt(convSettings.filterSize[i], radix),
          filters: parseInt(convSettings.nrOfFilters[i], radix),
          strides: parseInt(convSettings.strides[i], radix),
          activation: convSettings.activationFunction[i],
          kernelInitializer: convSettings.filterInitializer[i]
        }));
        returnString = returnString + 'First convolutional layer added \n ';
        //Add a max pooling layer only if configured/set in gui.
        if(convSettings.poolLayer[i] === '1'){
          this.machine.add(tf.layers.maxPooling2d({
            poolSize: [parseInt(convSettings.poolSize[i], radix), parseInt(convSettings.poolSize[i], radix)],
            strides: [parseInt(convSettings.poolStrides[i], radix), parseInt(convSettings.poolStrides[i], radix)]
          }));
          returnString = returnString + 'Pooling layer to first convolutional layer added \n ';
        }
      }
      else {//Following layers will have 'auto' inputShape
        this.machine.add(tf.layers.conv2d({
          kernelSize: parseInt(convSettings.filterSize[i], radix),//5,
          filters: parseInt(convSettings.nrOfFilters[i], radix),//16,
          strides: parseInt(convSettings.strides[i], radix),//1,
          activation: convSettings.activationFunction[i],//'relu',
          kernelInitializer: convSettings.filterInitializer[i]//'varianceScaling'
        }));
        let layerNr = i+1;
        returnString = returnString + 'Convolutional layer nr: ' + layerNr + ' added \n ';
        //Add a max pooling layer only if configured/set in gui.
        if(convSettings.poolLayer[i] === '1'){
          this.machine.add(tf.layers.maxPooling2d({
            poolSize: [parseInt(convSettings.poolSize[i], radix), parseInt(convSettings.poolSize[i], radix)],
            strides: [parseInt(convSettings.poolStrides[i], radix), parseInt(convSettings.poolStrides[i], radix)]
          }));
          returnString = returnString + 'Pooling layer to convolutional layer nr ' + layerNr + ' added \n ';
        }
      }
    }
    
    /*
     * Add a flatten layer to flatten the output from the convolutional layers. This layer will
     * flatten the output from the 2D convolutional layer in to a 1D tensor array.
    */
    this.machine.add(tf.layers.flatten());
    returnString = returnString + 'Flattening layer added \n ';

    /*
     * Add fully connected/dense neural layer(s).
     * At least one layer (the 'final' layer) is added.  The number of neurons/output size of the 
     * 'final' neural layer will equal the number of selected categories. Hence, GUI settings for
     * the 'final' layer will be overwritten here.
     * If user adds additional neural layers, those layers will have number of neurons equal to 
     * the value set in the GUI.
     */
    for(let j=0; j<nnSettings.nrOfLayers.length; j++){
      
      if(j === nnSettings.nrOfLayers.length-1){//This is the 'final' neural layer (output layer)
        this.machine.add(tf.layers.dense({
          units: inputSettings.categories.size,
          kernelInitializer: nnSettings.filterInitializer[j],
          activation: nnSettings.activationFunction[j]
        }));
        returnString = returnString + 'Final dense layer with ' + 
                       inputSettings.categories.size + 
                       ' neurons added \n ';
      }
      else{
        this.machine.add(tf.layers.dense({
          units: parseInt(nnSettings.nrOfNeurons[j], radix),
          kernelInitializer: nnSettings.filterInitializer[j],
          activation: nnSettings.activationFunction[j]
        }));
        let layerNr = j+1;
        returnString = returnString + 'Neural layer nr ' + layerNr + ' added \n ';
      }
    }

    //Set the training characterisitics.
    var optimizer = tf.train.sgd(parseFloat(modelSettings.learningRate));

    //Compile the model.
    this.machine.compile({
      optimizer: optimizer,
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    });

    returnString = returnString + 'Model created and compiled succesfully \n ';
    //console.log(this.machine);
    }
    catch(err){
      returnString = [err];
    }
    finally{
      console.log(returnString);
      return returnString;
    }
  }

  /*
   * Method to train the model stored in the class varable this.machine.
   * This model and the training is inspired by https://js.tensorflow.org/tutorials/mnist.html.
   * 
  */
  async train(data, iterations, progressCallback, resultCallback) {
    this.data = data;
    
    //With Validation
    //let trainBatchSize = 6;//this.batchSize * numOfClasses//TBD - get actual value
    //let validationData = [testBatch.imageDataAsTensor.reshape([testBatchSize, this.imageSize, this.imageSize, 1]), testBatch.imageLabelsAsTensor];
    //this.machine.fit(
    //  trainBatch.imageDataAsTensor.reshape([trainBatchSize, this.imageSize, this.imageSize, 1]),
    //  trainBatch.imageLabelsAsTensor,
    //  {batchSize: trainBatchSize, validationData, epochs: iterations}).then(x => console.log(x));
    
    //Without validation
    while(this.data.isThereMoreTrainingData() === true){
      //To prevent unnecessary rendering, do not feedback any training progress.
      //let trainProgress = this.data.shuffledTrainIndex/this.data.trainIndices.length*100;
      //progressCallback(trainProgress);
      let trainBatch = data.getTrainBatchNew();
      let trainBatchSize = trainBatch.nrOfImages
      if(trainBatchSize === 0) { break; } //break in case we do not receive any training data

      //Train the model with the received training data
      this.machine.fit(
        trainBatch.imageDataAsTensor.reshape([trainBatchSize, this.imageSize, this.imageSize, 1]),
        trainBatch.imageLabelsAsTensor,
        {epochs: iterations}).then(x => this.history.push(x));

      // - dispose the batch ?
      
      await tf.nextFrame();
    }
    /*
     * Not using the resultCallback since the method is defined as asynchrounous, so the caller
     * can wait for it to complete and use the class variable this.history directly.
    */
    //resultCallback(this.history);
  }

  /*
   * Method to test the model and predict the categories of the test images.
  */
  async predict() {
    if(this.data !== null){

      //Test all images
      var testBatch = this.data.getFullTestBatch();
      var result = this.machine.predict(
          testBatch.imageDataAsTensor.reshape([testBatch.batchSize, this.imageSize, this.imageSize, 1]),
          {batchSize: testBatch.batchSize});

      this.predictionResult = await result.data();
      return this.predictionResult;
    }
  }
}