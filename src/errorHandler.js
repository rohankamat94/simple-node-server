module.exports = (request, response) => (e) => {
    if(e.code === 'ENOENT') {
        response.writeHead(404, {
            'Content-Type': 'text/html',
        });
        response.write(`Whoops! Couldn\'t find ${request.url}`);
        response.end();

    } else {
        response.writeHead(500, {
            'Content-Type': 'text/html',
        });
        response.write(`Ruh roh! Something's wrong`);
        response.end();

    }

    console.log(e);
}
