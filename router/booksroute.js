const path = require('path');
const fs = require('fs');


const booksDb = path.join(__dirname, '../files', 'books.json');

function readBookFile() {
    return new Promise((resolve, reject) => {
        fs.readFile(booksDb, (err, data) => {
            if(err){
                reject(err);
            }
            resolve(JSON.parse(data));
        })
    })
}

function creatBook(req, res) {
    const body = [];
    req.on("data", (chunks) => {
        body.push(chunks);
    });

    req.on("end", async () => {
        const rawFile = Buffer.concat(body).toString();
        const newBook = JSON.parse(rawFile);

        const bookFileDb = await readBookFile();

        //TO get the ID of the book file
        const lastBook = bookFileDb[bookFileDb.length - 1];
        const lastBookId = lastBook.id;
        newBook.id = lastBookId + 1;
       bookFileDb.push(newBook);

       fs.writeFile(booksDb, JSON.stringify(bookFileDb), 'utf-8', err => {
            if(err) {
                throw err;
                return res.end('Your file could not be written');
            }
       })        
        
    });
}

module.exports = {
    creatBook
}