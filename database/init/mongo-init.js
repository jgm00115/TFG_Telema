console.log(`Creando database = ${process.env.MONGO_INITDB_DATABASE}`);

db.createUser(
    {
        user: process.env.INIT_DB_USER,
        pwd: process.env.INIT_DB_PASSWORD,
        roles: [
            {
                role: 'readWrite',
                db: process.env.MONGO_INITDB_DATABASE
            }
        ]
    }
);