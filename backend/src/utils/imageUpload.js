let fs = require('fs')
const db = require('../models')
const file = db.file;
const fileAttachment = db.fileattachment
const path = require('path')
let  imageUpload = async (imageData,entityType,subDir,filePurpose,insertionData,userId,errors, serialNumber,transaction)=>{
    // e.g.  sub dir = "facility Images"
    // insertionData is the object whose work is to give the data in the format {id:2, name:'US'}
    try {
      console.log('image upload function entry')
        console.log(entityType,subDir,filePurpose,insertionData,userId,errors, serialNumber,'these are all parameters in upload image function')
        let createdDt = new Date();
        let updatedDt = new Date();
        let uploadFilePath = null;
        let uploadFilePath2 = null;
        const uploadDir = process.env.UPLOAD_DIR;
        const base64ImageFile = imageData ? imageData.replace(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/, "") : null;
        console.log('base 64 image file line 10')
        const mimeMatch = imageData.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/);
        const mime = mimeMatch ? mimeMatch[1] : null;
        
        console.log(mime, mimeMatch,'mime match')
        if ([
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/webp",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ].includes(mime.toLowerCase())) {
          console.log('base 64 image file line 21 certain mime type')

          // convert base 64 to buffer for image or document or set to null if not present
          const uploadImageFileBuffer = imageData ? Buffer.from(base64ImageFile, "base64") : null;
          // console.log(uploadImageFileBuffer,'25 upload image file buffer')
          if (uploadImageFileBuffer) {
            console.log('27',path.join(uploadDir, subDir))
            const imageFileDir = path.join(uploadDir, subDir);
            console.log(imageFileDir,'28 image file dir  image file buffer')
            // ensure the event image directory exists
            if (!fs.existsSync(imageFileDir)) {
              fs.mkdirSync(imageFileDir, { recursive: true });
            }
            const fileExtension = mime ? mime.split("/")[1] : "txt";
            
            console.log(fileExtension,'34 file extension image file buffer')

            uploadFilePath = `${imageFileDir}/${insertionData.id}${insertionData.name}_${serialNumber || null}.${fileExtension}`;

            fs.writeFileSync(uploadFilePath, uploadImageFileBuffer);
            uploadFilePath2 = `/${subDir}/${insertionData.id}${insertionData.name}_${serialNumber || null}.${fileExtension}`;
            console.log(uploadFilePath2,"upload file path2 43")
            let fileName = `${insertionData.id}${insertionData.name}.${fileExtension}`;
            let fileType = mime ? mime.split("/")[0] : 'unknown';
            console.log(fileName,fileType,"file path2 46")
            // insert to file table and file attachment table
            console.log(fileName,fileType, uploadFilePath2, 'create file data parameters')
            let createFile = await file.create({
              fileName: fileName,
              fileType: fileType,
              url: uploadFilePath2,
              statusId: 1,
              createdDt: createdDt,
              updatedDt: updatedDt,
              createdBy:userId,
              updatedBy:userId
            },
            {transaction}
          );
            console.log('createFile', createFile)
            if (!createFile) {
              return errors.push(`Failed to create file  for facility file at index ${i}`);
            } else {
              console.log(insertionData,entityType,'createFile',createFile, 'file purpose', filePurpose,'insert to file attachment')
              // Insert into file attachment table
              let createFileAttachment = await fileAttachment.create({
                entityId: insertionData.id,
                entityType: entityType,
                fileId: createFile.fileId,
                statusId: 1,
                filePurpose: filePurpose,
                createdBy:userId,
                updatedBy:userId,
                createdDt: createdDt,
                updatedDt: updatedDt

              },
              {transaction}
            );

              if (!createFileAttachment) {
                return errors.push(`Failed to create file attachment for facility file at index ${i}`);
              }
              return null;
            }
          }
        } else {
         return errors.push(`Invalid File type for facility file at index ${i}`);
        }
    } catch (err) {
      errors.push(`Something went wrong`)
    }


      
    }


module.exports = imageUpload