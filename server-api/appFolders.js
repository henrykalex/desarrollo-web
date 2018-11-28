let fs = require('fs');
let path = require('path');
const uploadsFolder = 'uploads';
const appFolders = ['products', 'feeding-charts'];
module.exports = {
  uploadsFolder:uploadsFolder,
  appFolders: appFolders,
  syncFolders(){
    let uploadsDir = path.join(__dirname,'..', uploadsFolder);
    for(let folder of appFolders){
      let newPath = path.join(uploadsDir,folder);
      if(!fs.existsSync(newPath)){
        fs.mkdirSync(newPath);
      }
    }
  }
}
