const http = require('http');
const path = require('path');

const { getAllUsers, createUser } = require('./router/user');
const { authenticateUser } = require('./router/authenticate_user');
const { creatBook } = require('./router/booksroute');

const PORT = 5000;
const HOSTNAME = 'localhost';

const reqHandler = (req, res) => {
    const { url, method} = req;
    if (url === '/user' && method === 'GET') {
        authenticateUser(req, res)
            .then(() => {
                getAllUsers(req, res);
            }).catch((err) => {
                res.writeHead(400);
                res.end(JSON.stringify({
                    message: err
                }));
            })
    } else if (url === '/user' && method === 'POST') {
        authenticateUser(req, res)
        .then(() => {
            createUser(req, res);
        })
        .catch((error) => {
            res.writeHead(400);
            res.end(JSON.stringify({
                message: error
            }));
        })
        

    }
    
}

const server = http.createServer(reqHandler);


server.listen(PORT, () => {
    console.log(`Server running on http://${HOSTNAME}:${PORT}`);
})
