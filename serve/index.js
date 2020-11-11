const path = require("path");
const fse = require("fs-extra");
const { resolve } = require("path");
// const UPLOAD_DIR = path.resolve(__dirname,'./target');//当前目录下的target
// const UPLOAD_DIR = path.resolve(__dirname,'target');//当前目录下的target        //三种方式
const UPLOAD_DIR = path.resolve(__dirname,'.','target'); //当前目录下的target,绝对目录


const filename = "yb";
const filePath = path.resolve(UPLOAD_DIR,'..',`${filename}.jpg`);

const mergeFileChunk = async(filePath,filename,size)=>{
  // console.log(filePath,filename,size);
  const chunkDir = path.resolve(UPLOAD_DIR,filename)
  const chunkPaths = await fse.readdir(chunkDir) //读取文件夹中的文件名

  const pipeStream = (path,WriteStream) =>
    new Promise(resolve=>{
      const readStream = fse.createReadStream(path);
      readStream.on('end',()=>{
        fse.unlinkSync(path)
        resolve();
      })
      readStream.pipe(WriteStream)
    })
  // console.log(chunkPaths);
  chunkPaths.sort((a,b)=>a.split('-')[1]-b.split('-')[1])//升序排序
  await Promise.all(
    chunkPaths.map((chunkPath,index)=>{
      pipeStream(
        path.resolve(chunkDir,chunkPath),
        fse.createWriteStream(filePath,{
          start: index*size,
          end: (index + 1)*size
        })
      )
    })
  )
  console.log('文件合并成功');
}
mergeFileChunk(filePath,filename,0.5*1024*1024);//半兆