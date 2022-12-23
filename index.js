const express = require("express");
const multer = require("multer");
const uuid = require("uuid").v4;
const app = express();

//these are for later use, when combining with the front end
//const cors = require("cors");
//app.use(cors()); 

// const fileupload = multer({dest: "file_uploads/"});

//POST request - single file upload
//this POST request is only taking one file to upload. Cannot upload multiple files
// app.post("/userdocumentupload", fileupload.single("file"), (req, res) => {
//     setTimeout(() => {
//         console.log("file uploaded successfully!")
//         return res.status(200).json({result: true, message: "file uploaded!"})
//     }, 3000);
// });


//specify the type of the file to upload | accepts all the files which the parent type of that file is "image".
const fileFilter = (req, file, cb) => {
    if(file.mimetype.split("/")[0] === 'image'){
        cb(null, true);
    }
    else{
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false);
    }
}

// obtain custom file name when uploading | the uploded file will be saved into the local storage. (your hard disk)
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "file_uploads/");
    },
    filename: (req, file, callback) => {
        const { originalname } = file;
        callback(null, `${uuid()}-${originalname}`);
    }
})

/*POST request - multiple files upload | maximun number of files allowed is 4 |
                    obtain cutome file name and filter out the specified file type and limits the file size */
const fileupload = multer({storage, fileFilter, limits: {fileSize: 20000000, files: 4}});
app.post("/userdocumentupload", fileupload.array("file"), (req, res) => {
    setTimeout(() => {
        console.log("file uploaded successfully!")
        return res.status(200).json({result: true, message: "files uploaded!"})
    }, 3000);
});

/*POST request - multiple files upload | maximun number of files allowed is 4 |
                    obtain cutome file name and filter out the specified file type and limits the file size */
// const fileupload = multer({storage, fileFilter, limits: {fileSize: 2000000}});
// app.post("/userdocumentupload", fileupload.array("file", 4), (req, res) => {
//     setTimeout(() => {
//         console.log("file uploaded successfully!")
//         return res.status(200).json({result: true, message: "files uploaded!"})
//     }, 3000);
// });


//POST request - multiple fields upload 
// const multiFields = fileupload.fields([
//     {name: "profilePic", maxCount: 1},
//     {name: "documentName", maxCount: 2}
// ])
// app.post("/userdocumentupload", multiFields, (req, res) => {
//     setTimeout(() => {
//         console.log("file uploaded successfully!")
//         console.log(req.files)
//         return res.status(200).json({result: true, message: "files uploaded!"})
//     }, 3000);
// });

//DELETE request
app.delete("/deletefile", (req, res) => {
    console.log("file deleted")
    return res.status(200).json({result: true, message: "file deleted"})
});


//Error handling
app.use((error, req, res, next) => {
    if(error instanceof multer.MulterError) {
        if(error.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                message: "File size has exeeded the maximum file size limit...!!!"
            })
        }
        if(error.code === "LIMIT_FILE_COUNT") {
            return res.status(400).json({
                message: "Exeeded maximum number of files allowed...!!!"
            })
        }
        if(error.code === "LIMIT_UNEXPECTED_FILE") {
            return res.status(400).json({
                message: "Failed to upload the file/files. File type is not recognized...!!!"
            })
        }
    }
})

app.listen(4000, () => console.log("server is up & running | Listning on port 4000"));

