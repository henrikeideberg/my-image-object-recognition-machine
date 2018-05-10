export function getImageUrls_color(category) {
  var urls = [];
  //300x300
  //var dir = "/objects/300x300/color/" + category + "/";//used for local build
  //var dir = "http://henrik.eideberg.se/projects/machinelearning/my-image-object-recognition-machine/objects/300x300/color/" + category + "/";//used for online build
  
  //100x100
  //var dir = "/objects/100x100/color/" + category + "/";//used for local build
  var dir = "http://henrik.eideberg.se/projects/machinelearning/my-image-object-recognition-machine/objects/100x100/color/" + category + "/";//used for online build
  var file = "";
  for(let i=1; i<10; i++){
    file = "image_000" + i + ".jpg";
    urls.push(dir+file);
  }
  for(let i=10; i<71; i++){
    file = "image_00" + i + ".jpg";
    urls.push(dir+file);
  }
  return urls;
}

export function getImageUrls_gray(category) {
  var urls = [];
  //300x300
  //var dir = "/objects/300x300/gray/" + category + "/";//local build
  //var dir = "http://henrik.eideberg.se/projects/machinelearning/my-image-object-recognition-machine/objects/300x300/gray/" + category + "/";//online build

  //100x100
  //var dir = "/objects/100x100/gray/" + category + "/";//used for local build
  var dir = "http://henrik.eideberg.se/projects/machinelearning/my-image-object-recognition-machine/objects/100x100/gray/" + category + "/";//used for online build
  var file = "";
  for(let i=1; i<10; i++){
    file = "image_000" + i + ".jpg";
    urls.push(dir+file);
  }
  for(let i=10; i<71; i++){
    file = "image_00" + i + ".jpg";
    urls.push(dir+file);
  }
  return urls;
}

export function getImageUrls_binary(category) {
  var urls = [];
  //300x300
  //var dir = "/objects/300x300/binary/" + category + "/";//local build
  //var dir = "http://henrik.eideberg.se/projects/machinelearning/my-image-object-recognition-machine/objects/300x300/binary/" + category + "/";//online build
  
  //100x100
  //var dir = "/objects/100x100/binary/" + category + "/";//used for local build
  var dir = "http://henrik.eideberg.se/projects/machinelearning/my-image-object-recognition-machine/objects/100x100/binary/" + category + "/";//used for online build
  var file = "";
  for(let i=1; i<10; i++){
    file = "image_000" + i + ".bmp";
    urls.push(dir+file);
  }
  for(let i=10; i<71; i++){
    file = "image_00" + i + ".bmp";
    urls.push(dir+file);
  }
  return urls;
}