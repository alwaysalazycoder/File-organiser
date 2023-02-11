const path = require('path');
const fs = require('fs');
const { executionAsyncId } = require('async_hooks');
const { type } = require('os');
const { cursorTo } = require('readline');

let inputArr = process.argv.slice(2);

let command = inputArr[0];
let dirPath = inputArr[1];
let extension = {
    img : ['jpeg','jpg','png','svg'],
    video : ['mkv','mp4',],
    archives : ['zip','7z','rar','tar','gz','ar','iso','xz'],
    excels : ['xlsx','xls'],
    pdf : ['pdf'],
    word :['word'],
    doc : ['doc','docx','ods','odt','odp'],
    app : ['exe','pkg','deb','dmg']
}





switch(command){
    case "organise":{
        organise(dirPath);
        break;
    }
    case "help" :{
        help();
        break;
    }
    default:{
        console.log("Please enter the correct command...🔥")
    }
}






function organise(dirPath){ 
    if(dirPath == undefined){
        console.log("Please enter the correct path");
    }
    else{

        if(fs.existsSync(dirPath)){
            let destPath = path.join(dirPath,"organised files");
            if(fs.existsSync(destPath) == false){
                fs.mkdirSync(destPath);
            }

            organiseHelper(dirPath,destPath);


        }
        else{
            console.log("Please enter the correct path....");
        }
    }

}

function organiseHelper(src,dest){
    let childNames = fs.readdirSync(src);

    for(let i = 0; i < childNames.length; i++){
        let childPath = path.join(src,childNames[i]);
        let isFile = fs.lstatSync(childPath).isFile();
        if(isFile){
            let childCategory = category(src,dest,childPath);
            console.log(childCategory);
            console.log();
            sendFiles(src,dest,childPath,childCategory);
            console.log(childPath+"file is moved to :  "+"is moved to the dir" + childCategory + "Successfully 🔥🔥🔥");
            console.log();
        }
    }
    
}

function category(src,dest,childPath){
    let ext = path.extname(childPath);
    ext = ext.slice(1);
    
    
    for(let type in extension){
        let currentTypeArray = extension[type];
        for(let i = 0; i < currentTypeArray.length; i++){
            if(ext == currentTypeArray[i]){
                return type;
            }
        }
    }
    return "others"
    
    
    
    
    
}

function sendFiles(src,dest,childAddress,category){


    let categoryPath = path.join(dest,category);
    console.log(categoryPath);
    console.log();
    if(fs.existsSync(categoryPath) == false){
        fs.mkdirSync(categoryPath);
        
    }
    else{
        console.log(childAddress);
        let newcat = "."+category;
        let filename = path.basename(childAddress,newcat);
        console.log(filename +"😔🏓");
        console.log();
        let filePath = path.join(categoryPath,filename);
        console.log(filePath);
        console.log();
        fs.copyFileSync(childAddress,filePath);
        // fs.unlinkSync(childAddress);
        console.log(filename + "  moved to the  " + categoryPath);
        console.log();
    
    }

}

function help(){
    console.log("For organizing use command node filename.js organise path ");
}


// 1. take the input and make dest directory
// 2. get the category of the data ..
// 3. send the files to the new dest path... of organised folder




























