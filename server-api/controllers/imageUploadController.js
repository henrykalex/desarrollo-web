var debug = require('debug')('home-productsapi:image-upload-controller');
var path = require('path');
var formidable = require('formidable');

exports.uploadImage = function (type, elementId, req){
  var form = new formidable.IncomingForm();
  let dir =
  type=='product'?'products':
  type=='feedingChart'?'feeding-charts':'';
  let uploadDir = path.join(__dirname,'..','..', 'uploads',dir);
  form.uploadDir = uploadDir;
  form.keepExtensions = true;
  form.maxFields = 1;
  form.multiples = false;
  form.on('fileBegin', (name, file)=>{
    debug("name",name);
    debug("file",file);
    const fileSplit =  file.name.split('.');
    // let fileName  = fileSplit.slice(0,-1).join('').replace(/(\s|\.)/g, '-');
    let fileName = elementId;
    let fileExt = fileSplit[fileSplit.length-1];
    file.path = path.join(uploadDir, `${fileName}-${new Date().getTime()}.${fileExt}`)
  });
  return new Promise((resolve, reject)=>{
    form.parse(req, (error, fields, files)=>{
      if(error){
        debug("error",error);
        // return next(appError("Error al leer la forma"));
        reject(appError("Error al leer la forma"));
      }
      debug("fields",fields);
      debug("files",files);
      var path = files.file.path,
      // file_size = files.file.size,
      file_ext = files.file.name.split('.').pop(),
      index = path.lastIndexOf('/') + 1,
      file_name = path.substr(index);

      debug("path",path);
      debug("file_ext",file_ext);
      debug("file_name",file_name);
      resolve(file_name)
      // return file_name;
    });
  });
}
