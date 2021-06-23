const mssql = require('mssql');

module.exports = class Sql {
    constructor(stringConnection) {
        this.stringConnection = stringConnection;
        this.connect();
    }

    connect() {
        mssql.on('error', err => {
            console.log("Error al conectar SQL-server");
            console.log(err);
            mssql.close();
        });
        console.log("Conectado SQL-server");
        return mssql.connect(this.stringConnection);
    }

    close() {
        return mssql.close();
    }

    async ejecuta(querry) {
        return new Promise((resolve, reject) => {
            this.connect().then(pool => {
                return pool.request().query(querry);
            }).then(result => {
                mssql.close();
                resolve(result);
            }).catch(err => {
                reject(err);
            });
        });
    }

}