const path = require('path');
const fs = require('fs');
const { json } = require('stream/consumers');

const pathDb = path.join(__dirname, '../', 'files', 'users.json');

function getAllUsers(req, res) {
    
        fs.readFile(pathDb, 'utf8',(err, data) => {
            if (err) {
                res.writeHead(400);
                res.end("Canno read file");
            }    
            res.end(data);
        });             
}

function createUser(req, res) {
    const body = [];
    req.on("data", (chunks) => {
        body.push(chunks);
    });
    req.on("end", () => {
        const bodyInput = Buffer.concat(body).toString();
        const bodyInputObj = JSON.parse(bodyInput);
        
        fs.readFile(pathDb, 'utf-8', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end(err);
            }

            const dataFile = JSON.parse(data);
            dataFile.push(bodyInputObj);
            
            /*
            / Another method to also merge arrays is using the spread operator as shown Below
            const newDataFile = [...dataFile, bodyInputObj] 
            console.log(newDataFile)

            */
            
            fs.writeFile(pathDb, JSON.stringify(dataFile), 'utf-8', (err) => {
                if (err) {
                    res.writeHead(404);
                    res.end(JSON.stringify({
                        message: "Unable to write file"
                    }));
                }
                res.writeHead(200);
                res.end("Your file was successfully written");;
            });
        });
    });
}



module.exports = {
    getAllUsers,
    createUser
}


