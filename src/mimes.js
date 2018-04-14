const mimes = [
    {
        ext: /\.html?$/,
        mime: 'text/html',
    }, {
        ext: /\.js$/,
        mime: 'application/javascript',
    }, {
        ext: /\.css$/,
        mime: 'text/css',
    }, {
        ext: /\.json$/,
        mime: 'application/json',
    }, {
        ext: /\.svg$/,
        mime: 'image/svg+xml',
    }, {
        ext: /\.(gif|jpe?g|png)$/,
        mime: (ext) => `image/${ext}`,
    }, {
        ext: /\.ico$/,
        mime: 'image/x-icon',
    }, 
];

const cache = {};


module.exports = function (ext) {
    if(cache[ext]) {
        return cache[ext];
    }

    const type = mimes.find(type => type.ext.test(ext));
    
    if(!type) {
        return 'text/plain';
    }

    if (typeof type.mime === 'string') {
        cache[ext] = type.mime;
        return type.mime;
    }

    const [_, matchingExt] = type.ext.exec(ext);
    const mime = type.mime(matchingExt);
    cache[ext] = mime;
    return mime;
}