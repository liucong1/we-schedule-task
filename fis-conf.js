fis.match('*.js',{
    parser : fis.plugin('babel-6.x', {
        plugins : [ require('babel-plugin-transform-runtime') ]
    })
});

fis.set('project.ignore', [
    'output/**',
    'node_modules/**',
    '.git/**',
    '*.md',
    '*.lock',
    '*.json',
    'fis-conf.js',
    '*.log'
]);