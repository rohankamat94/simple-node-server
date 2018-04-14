const sizeMap = [
    { size: 30, unit: 'GB'},
    { size: 20, unit: 'MB'},
    { size: 10, unit: 'KB'}
];

const formatDate = (dateString) => new Date(dateString).toISOString().replace('T',' ').replace(/\.\d+Z$/, '');

const formatSize = (size) => {
    const { unit, size: conversion = 1 } = sizeMap.find(pair => size > 2 ** pair.size) || {unit: 'B'} ;

    return `${size / (2 **conversion)} ${size === 0 ? '' :unit}`;
}

const formatFileStats = (files) => files.map(({ name, stats }) => ({
    name, 
    size: formatSize(stats.size), 
    modified: formatDate(stats.mtime),
}))

module.exports = {formatDate, formatSize, formatFileStats};