const path = require('path');
const fs = require('fs');

const pathDb = path.join(__dirname, '../', 'files', 'users.json');

function readfile() {
    return new Promise((resolve, reject) => {
        fs.readFile(pathDb, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(JSON.parse(data));
        });
    });
}

function authenticateUser(req, res) {
    return new Promise((resolve, reject) => {
        const body = [];
        req.on("data", (chunks) => {
            body.push(chunks);
        });

        req.on("end", async () => {
            const bodyObject = Buffer.concat(body).toString();

            if (!bodyObject) {
               return reject('Enter your username and password');
            }
            const loginDetails = JSON.parse(bodyObject);
            
            const allUsers = await readfile();

            const findUser = allUsers.find((user) => {
                return user.username === loginDetails.username
            });
            if(!findUser) {
                return reject('Username not found, please signup');
            }
            if (findUser.userType !== "Admin"){
                return reject('You do not have the right to access this file');
            }
             resolve();
        })
    })
}


module.exports = {
    authenticateUser
}