
let fs = require('fs');
let path = require('path');
let extension = {
    img : ['jpeg','jpg','png','svg'],
    video : ['mkv','mp4',],
    archives : ['zip','7z','rar','tar','gz','ar','iso','xz'],
    excels : ['xlsx','xls'],
    doc : ['doc','txt','pdf','docx','ods','odt','odp'],
    app : ['exe','pkg','deb','dmg']
}
let inputArr = process.argv.slice(2);// here process is used for input and we slice 2 because the first two element were node and filename
let command = inputArr[0];
console.log(command)
let dirPath = inputArr[1];
console.log(dirPath)
let destPath = path.join(__dirname, "organised files");
console.log(destPath);

switch (command) {
    case "organise": {
        organise(dirPath);
        break;
    }
    case "tree": {
        tree(dirPath);
        break;
    }
    case "help": {
        console.log(`

        Here are the commands
        1. node main.js tree dirpath
        2. node main.js organise dirpath 
        3. help
        
        `);
        break;
    }
    default: {
        console.log("Please enter the right command .......");
    }
}
function tree(dirPath){
    if(dirPath == undefined ){
        console.log("Kindly enter the path");
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            treeHelper(dirPath , " ");
        }
        else{
            console.log("kindly enter the right path");
            return;
        }
    }

}
function treeHelper(dirPath, indent){

    // is file or directory
    let isFile = fs.lstatSync(dirPath).isFile();
    if(isFile){
        let filename = path.basename(dirPath);
        console.log(indent +  "|-- " +filename);
    }
    else{
        let dirName = path.basename(dirPath);
        console.log(indent + " +-- " +dirName);
        let children = fs.readdirSync(dirPath);
        for(let i = 0; i < children.length; i++){
            let childPath = path.join(dirPath,children[i])
            treeHelper(childPath, indent + "\t");
        }
    }

}
function organise(dirPath){
    
    if(dirPath == undefined ){
        console.log("Kindly enter the path");
        return;
    }
    else{
        let doesExist = fs.existsSync(dirPath);
        if(doesExist){
            destPath = path.join(dirPath,"organised files");
            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
            }
            organiseHelper(dirPath,destPath);
            
        }
        else{
            console.log("kindly enter the right path");
            return;
        }
    }
}
function organiseHelper(src,dest){
    //3. identify categories of all the files in that input directory
    let childNames = fs.readdirSync(src);
    console.log(childNames);
    for(let i = 0; i< childNames.length; i++){
        let childAddress = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if(isFile){
            console.log(childNames[i]);
            // category get karo
            let category = getCategory(childNames[i]);
            console.log(childNames[i] +"  belong to " + category );
            // copy wala code
            sendFiles(childAddress,destPath,category)
        }
    }
    
}
function getCategory(name){
    let ext = path.extname(name);
    console.log(ext);
    ext = ext.slice(1);
    console.log(ext);
    
    for(let type in extension){
        let cTypeArray = extension[type];
        for(let i = 0; i < cTypeArray.length; i++){
            if(ext == cTypeArray[i]){
                return type;
            }
        }
    }
    return "others";
}
function sendFiles(srcFilePath,dest,category){
    
    let categoryPath = path.join(dest,category);
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath)
    }
    let filename = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, filename);
    fs.copyFileSync(srcFilePath,destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(filename , " copied to " , category);
}



//1. input directory path given
// 2. create organised files directory 
//  3. identify categories of all files present in that input directory
// 4. copy files to that organised directory inside of any of category folder