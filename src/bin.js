const path = require('path');
const chalk = require('chalk');
const args = require('minimist')(process.argv.slice(2));
const dot = require('dot');

const root = path.resolve(process.cwd(), args.public || '');
const port = args.port || 8000;

const server = require('./index')({ root });

server.on('error', (err) => {
    if(err.code === 'EADDRINUSE') {
        console.error(chalk.red(`Port ${port} is already in use.`));
        return;
    }
    
    console.error(error);
});

server.on('listening', () => {
    console.log(`Running at ${chalk.blue(`http://localhost:${port}/`)}`);
    console.log(`Serving files from ${chalk.blue(root)}`);
});

server.listen(port);

