const config = {
    port: 1433,
    server: 'localhost',
    user: 'SA',
    password: 'kevinroot7?',
    database: 'TestDB',
    // stream: false,
    options: {
        // tru +stedConnection: true,
        encrypt: true,
        // enableArithAbort: true,
        trustServerCertificate: true,
    },
}

module.exports = config;