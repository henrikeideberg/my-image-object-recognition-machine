import {getImageUrls_gray, getImageUrls_binary} from './ImageUrls';
import * as tf from '@tensorflow/tfjs';

export class ImageData {
  constructor() {
    this.shuffledTrainIndex = 0;//index to keep track of where we are in trainIndices
    this.shuffledTestIndex = 0;//index to keep track of where we are in testIndices
    this.numberOfElementsInEachCategory = 70;
    this.imageSize = 300;
    this.oneChannelDataSize = this.imageSize*this.imageSize;//90000 in case of 300*300
    this.numOfClasses = 0;
    this.ratio = 0;//really needed as a class variable?
    this.batchSize = 0;
    this.numberOfElements = 0;
    this.numberOfTrainElements = 0;//really needed as a class variable?
    this.numberOfTestElements = 0;//really needed as a class variable?
    this.trainIndices = [];
    this.testIndices = [];
    this.urls = [];
    this.labelsData = [];
    this.labelsText = [];
    this.labelTextTemplate = null;
    this.imageDataArray = [];
  }
  
  /*
   * Method to load all selected images in to one imagearray.
   * Input;
   *  format - color, gray or binary
   *  categories - selected categories (crayfish, elephant, flamingo, hedgehog, kangaroo, leopards)
   *  ratio - training-images to test-images ratio (in range of 50-90%)
   *  batchSize - number of images to be used in a training batch
  */
  async load(format, categories, ratio, batchSize) {
    //save class variables
    this.numOfClasses = categories.size;
    this.numberOfElements = categories.size*this.numberOfElementsInEachCategory;
    this.ratio = ratio/100;
    this.numberOfTrainElements = Math.floor(this.ratio*this.numberOfElements);
    this.batchSize = parseInt(batchSize, 10);

    //create output labels (this is the expected output for each image)
    var label = [];
    var labelDataTemplate = [];
    for(var i=0; i<categories.size; i++){
      label = [];
      for(var j=0; j<categories.size; j++){
        if(i===j){
          label.push(1);
        }
        else{
          label.push(0);
        }
      }
      labelDataTemplate.push(label);
    }

    /*
     * For each category of format
     *  - get url and add in to one long url array
     *    e.g. [[crayfish-url, crayfish-url], [elephant-url, ...]]
     *  - get the text representation of the label and save in to an array
     *    e.g. ['catfish', 'elephant']
    */
    var urlsDeep = [];
    var labelTextTemplate = [];
    switch(format){
      case 'gray':
        categories.forEach(function(value) {
          urlsDeep.push(getImageUrls_gray(value));
          labelTextTemplate.push(value);
        });//.bind(this)); //only necessary to bind(this) when I handle a class variable
        break;
      case 'binary':
        categories.forEach(function(value) {
          urlsDeep.push(getImageUrls_binary(value));
          labelTextTemplate.push(value);
        });//.bind(this)); //only necessary to bind(this) when I handle a class variable
        break;
      default:
        /*
         * Covers color case too. Color is not yet implemented, hence if color is selected,
         * gray format will be implemented/chosen by application.
        */
        categories.forEach(function(value) {
          urlsDeep.push(getImageUrls_gray(value));
          labelTextTemplate.push(value);
        });//.bind(this)); //only necessary to bind(this) when I handle a class variable
    }

    /*
     * Flatten the urlsDeep array to this.urls.
     * After this operation this.urls will hold the urls of all selected images.
    */
    for(let i=0; i<urlsDeep.length; i++) {
      for(let j=0; j<urlsDeep[i].length; j++) {
        this.urls.push(urlsDeep[i][j]);
      }
    }

    /*
     * For all selected images, save the actual label in two arrays. One for the data format and
     * the other for text format. The index in these two arrays matches the index in this.urls
    */
    for(let i=0; i<labelDataTemplate.length; i++){
      for(let j=0; j<this.numberOfElementsInEachCategory; j++){
        this.labelsData.push(labelDataTemplate[i])
        this.labelsText.push(labelTextTemplate[i]);
      }
    }
    
    //save labelTextTemplate to use when comparing agains predicted values
    this.labelTextTemplate = labelTextTemplate;

    /*
     * Create shuffled indices into the train/test set for when we select a random dataset element
     * for training / validation.
    */
    var indices = tf.util.createShuffledIndices(this.numberOfElements);
    this.trainIndices = indices.slice(0, this.numberOfTrainElements);
    this.testIndices = indices.slice(this.numberOfTrainElements);
    
    /*
     * At this point in this function the below are important and created;
     *  this.trainIndices   array with index to training images/urls
     *  this.testIndices    array with index to test images/urls
     *  this.urls           array with all the image-urls
     *  this.labelsData     array with all the image-label (expected output from the model for that image)
     *  this.labelsText     array with all the image-label in text format
    */

    /*
     * Now push the imagedata for each url in this.urls in to an array.
     * After this loop all data for all images is pushed in to this.imageDataArray.
    */
    for(let i=0; i<this.urls.length; i++){
      this.getImageData(this.urls[i]).then(x => this.imageDataArray.push(x));
    }
  }

  /*
   * Method to get the urls for the images selected for the training set.
  */
  getTrainingUrls() {
    var arrayToReturn = [];
    if(this.urls.length > 0){
      for(let i=0; i<this.trainIndices.length; i++){
        arrayToReturn.push(this.urls[this.trainIndices[i]]);
      }
    }
    return arrayToReturn;
  }

  /*
   * Method to get the urls for the images selected for the test set.
  */
  getTestUrls(){
    var arrayToReturn = [];
    if(this.urls.length > 0){
      for(let i=0; i<this.testIndices.length; i++){
        arrayToReturn.push(this.urls[this.testIndices[i]]);
      }
    }
    return arrayToReturn;
  }

  /*
   * Method to get the actual label for the images selected for the training set.
  */
  getTrainingLabels() {
    var arrayToReturn = [];
    if(this.labelsText.length > 0){
      for(let i=0; i<this.trainIndices.length; i++){
        arrayToReturn.push(this.labelsText[this.trainIndices[i]]);
      }
    }
    return arrayToReturn;
  }

  /*
   * Method to get the actual label for the images selected for the training set.
  */
  getTestLabels() {
    var arrayToReturn = [];
    if(this.labelsText.length > 0){
      for(let i=0; i<this.testIndices.length; i++){
        arrayToReturn.push(this.labelsText[this.testIndices[i]]);
      }
    }
    return arrayToReturn;
  }

  /*
   * Method which returns the array in which the selected categories/labels are stored in
   * text format.
  */
  getLabelTextTemplate() {
    return this.labelTextTemplate;
  }

/*
  getTrainBatch() {
    var imageDataAsTensor = 0;
    var imageLabelsAsTensor = 0;
    if((this.imageDataArray.length > 0) && (this.isThereMoreTrainingData() === true)){
      var numOfIndexes = this.numOfClasses * this.batchSize;
      //console.log('getTrainBatch this.batchSize: ', this.batchSize);
      //console.log('getTrainBatch numOfIndexes: ', numOfIndexes);
      var imageDataArrayToConvert = [];
      var labelDataArrayToConvert = [];
      for(let i=0; i<numOfIndexes; i++) {
        imageDataArrayToConvert.push(...this.getImageDataAtTrainIndex(this.getShuffledTrainIndex()));
        labelDataArrayToConvert.push(...this.getLabelDataAtTrainIndex(this.getShuffledTrainIndex()));
        this.stepShuffledTrainIndex();
      }
      //console.log('imageDataArrayToConvert: ', imageDataArrayToConvert);
      imageDataAsTensor = tf.tensor2d(imageDataArrayToConvert, [numOfIndexes, this.oneChannelDataSize]);
      imageLabelsAsTensor = tf.tensor2d(labelDataArrayToConvert, [numOfIndexes, this.numOfClasses]);
    }
    return {imageDataAsTensor, imageLabelsAsTensor};
  }
*/
  /*
   * Method to return a set of images (training batch), their labels and the batch size
   * (number of images). The number of images included in the batch depends on number of selected
   * categories and the selected batch size.
   * The images and the corresponding labels are returned as 2d tensors.
  */
  getTrainBatchNew() {
    var imageDataAsTensor = 0;
    var imageLabelsAsTensor = 0;
    var nrOfImages = 0;
    if(this.imageDataArray.length > 0){
      var imageDataArrayToConvert = [];
      var labelDataArrayToConvert = [];
      var startTrainIndex = this.getShuffledTrainIndex();
      /*
       * Check if we can provide complete batch, 
       * i.e. this.numOfClasses * this.batchSize number of images
      */
      if(startTrainIndex <= (this.trainIndices.length-1-(this.numOfClasses*this.batchSize))){
        nrOfImages = this.numOfClasses * this.batchSize;
        for(let i=0; i<nrOfImages; i++) {
          imageDataArrayToConvert.push(...this.getImageDataAtTrainIndex(this.getShuffledTrainIndex()));
          labelDataArrayToConvert.push(...this.getLabelDataAtTrainIndex(this.getShuffledTrainIndex()));
          this.stepShuffledTrainIndex();
        }
      }
      /*
       * If complete batch cannot be provided,
       * i.e. we are almost at end of this.trainIndices, then check if there is enough images left
       * to at least provide whats left.
      */
      else if(startTrainIndex <= (this.trainIndices.length-1-this.numOfClasses)){
        nrOfImages = this.trainIndices.length-1-startTrainIndex;
        for(let i=0; i<nrOfImages; i++) {
          imageDataArrayToConvert.push(...this.getImageDataAtTrainIndex(this.getShuffledTrainIndex()));
          labelDataArrayToConvert.push(...this.getLabelDataAtTrainIndex(this.getShuffledTrainIndex()));
          this.stepShuffledTrainIndex();
        }
      }
      imageDataAsTensor = tf.tensor2d(imageDataArrayToConvert, [nrOfImages, this.oneChannelDataSize]);
      imageLabelsAsTensor = tf.tensor2d(labelDataArrayToConvert, [nrOfImages, this.numOfClasses]);
    }
    return {imageDataAsTensor, imageLabelsAsTensor, nrOfImages}
  }

  getTestImageAsTensor() {
    let index = this.testIndices[this.shuffledTestIndex];
    let batchSize = 1;
    let imageDataAsTensor = tf.tensor2d(this.imageDataArray[index], [batchSize, this.oneChannelDataSize]);
    let imageLabelsAsTensor = tf.tensor2d(this.labelsData[index], [batchSize, this.numOfClasses]);
    return {imageDataAsTensor, imageLabelsAsTensor, batchSize};
  }

  getFullTestBatch() {
    let imageDataAsTensor = 0;
    let imageLabelsAsTensor = 0;
    let batchSize = 0;
    if(this.imageDataArray.length > 0){
      var imageDataArrayToConvert = [];
      var labelDataArrayToConvert = [];
      for(let i=0; i<this.testIndices.length; i++) {
        let index = this.testIndices[this.shuffledTestIndex];
        imageDataArrayToConvert.push(...this.imageDataArray[index]);
        labelDataArrayToConvert.push(...this.labelsData[index]);
        this.stepShuffledTestIndex();
      }
      imageDataAsTensor = tf.tensor2d(imageDataArrayToConvert, [this.testIndices.length, this.oneChannelDataSize]);
      imageLabelsAsTensor = tf.tensor2d(labelDataArrayToConvert, [this.testIndices.length, this.numOfClasses]);
      batchSize = this.testIndices.length;
    }
    return {imageDataAsTensor, imageLabelsAsTensor, batchSize};
  }
  
  getImageDataAtTrainIndex(index) {
    //No out-of-range-check here. Assume it has been done before in getTrainBatch()
    return this.imageDataArray[this.trainIndices[index]];
  }
  
  getLabelDataAtTrainIndex(index) {
    //No out-of-range-check here. Assume it has been done before in getTrainBatch()
    return this.labelsData[this.trainIndices[index]];
  }
  
  getShuffledTrainIndex() {
    return this.shuffledTrainIndex;
  }
  
  stepShuffledTrainIndex(){
    this.shuffledTrainIndex = this.shuffledTrainIndex + 1;
  }
  
  stepShuffledTestIndex(){
    this.shuffledTestIndex = this.shuffledTestIndex + 1;
  }

  /*
   * Minimum required nr of images for a training is equal to 'nr of categories'
   *  => true if current index is less than or equal to
   *     this.trainIndices.length - 1 - this.numOfClasses
   *  => false if current current index is greater than 
   *     this.trainIndices.length - 1 -(this.numOfClasses * this,batchSize)
  */
  isThereMoreTrainingData(){
    return this.shuffledTrainIndex <= (this.trainIndices.length-1-this.numOfClasses);
  }

  /*
   * Returns the red data (from [r][g][b][a]) of image (defined at url).
  */
  async getImageData(url) {
    var dataBatch = new Float32Array(this.oneChannelDataSize);
    var img = new Image();
    img.src = url;
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    var imageData = [];
    img.onload = function() {
      ctx.drawImage(img, 0, 0);
      imageData = ctx.getImageData(0, 0, img.width, img.height).data;
      for (let i=0; i<imageData.length/4; i++) {
        // All channels hold an equal value since the image is grayscale
        // or binary so just read the red channel.
        dataBatch[i] = imageData[i * 4]/255;
      }
    };
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //canvas = null;
    return dataBatch;
  }
}