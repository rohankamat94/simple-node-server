
const http = require('http');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const chalk = require('chalk');
const dot = require('dot');

const mime = require('./mimes');
const { formatFileStats } = require('./format');
const errorHandler = require('./errorHandler');

const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const readFile = promisify(fs.readFile);

const fileStats =({ path, ...rest }) => stat(path).then((stats) => ({ stats, path, ...rest }));

const minify = (subject) => subject.replace(/(?:^\s+)|(?:\s+$)|\n|^$/gm, '');

const showIndexedPage = (request, response, dirOptions) => (files) => 
    Promise.resolve(dirOptions.template({ files, url: request.url }))
                .then(minify)
                .then((body) => {
                    response.writeHead(200, dirOptions.headers);
                    response.write(body);
                    response.end();
                }); 

;

const serveDirectory = (request, response, resourcePath, dirOptions) =>  readdir(resourcePath)
    .then((files) => files.map(file => ({ name: file, path: path.join(resourcePath, file) })))
    .then((files) => Promise.all(files.map(fileStats)))
    .then(showIndexedPage(request, response, dirOptions))

const serveFile = (resourcePath, response) => new Promise((res, rej) => {
    const extension = path.extname(resourcePath);
    response.writeHead(200, { 'Content-Type': mime(extension) });

    fs.createReadStream(resourcePath).pipe(response); 
    res();
});

const logStatus = (request, response) => () => {
    const { statusMessage, statusCode: code } = response;
    const message = code >= 200 && code < 400 ? 
        chalk.green(`${response.statusCode} ${response.statusMessage}`) : 
        chalk.red(`${response.statusCode} ${response.statusMessage}`)

    console.log(`${request.method} ${request.url} ${message}`);
}

const server = ({ root, indexPageHeaders = {}, indexPageTemplate, handleError: customHandler }) => {
    if (!indexPageTemplate) {
        const { indexPage } = dot.process({path: path.join(process.cwd(), 'src', 'views')});
        indexPageTemplate = ( {files, ...rest }) => indexPage({files: formatFileStats(files), ...rest});
    }

    return http.createServer((request, response) => {
        const { url } = request;
        
        response.on('finish', logStatus(request, response));
        
        const resourcePath = path.join(root, url);
    
        const handleError = (rq, rs) => (e) => customHandler(rq, rs, e) || errorHandler(request, response);
        
        try {
            const handleRequest = (stats) => stats.isDirectory() 
            ? serveDirectory(request, response, resourcePath, { template: indexPageTemplate, headers: indexPageHeaders }) 
            : serveFile(resourcePath, response);
            
            stat(resourcePath)
                .then(handleRequest)
                .catch(handleError);
            
        } catch (e) {
            handleError(e)
        }  
    });
};

module.exports = server;
