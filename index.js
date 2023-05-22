const express = require('express')
const app = express();
const path = require("path");

const fs = require('fs')

app.use(express.json());


var puerto = 0;
var usuario = '';
var pass = '';

var archivoDatos = "catalogo.json";
const Puerto = () => {
    const config = JSON.parse(fs.readFileSync("package.json"));
    puerto = config.puerto;
    usuario = config.usuario;
    pass = config.password
}
Puerto();
app.listen(puerto, console.log(`Escuchando por el puerto ${puerto}`))

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get("/canciones/", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync(archivoDatos));
    res.send(canciones);
})
app.get("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync(archivoDatos));
    let idx = canciones.findIndex(x => x.id === Number(req.params.id));
    let cancion = []
    cancion = canciones.slice(idx, idx + 1);

    res.send(cancion);
})
app.post("/canciones/", (req, res) => {
    var cancion = req.body;    
    const canciones = JSON.parse(fs.readFileSync(archivoDatos));
    canciones.push(cancion);
    fs.writeFileSync(archivoDatos, JSON.stringify(canciones))
    res.send(cancion);          
    
})

const userDataValidate = (req) => {
    if (!req.body.titulo) {
        throw Error("username is required");
    }
    if (!req.body.artista) {
        throw Error("password is required");
    }
    if (req.body.password.agno === 0 ) {
        throw Error("password should have atleast 5 characters");
    }        
};
app.put("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync(archivoDatos));
    let idx = canciones.findIndex(x => x.id === Number(req.params.id));

    canciones[idx].agno = req.body.agno;
    canciones[idx].titulo = req.body.titulo;
    canciones[idx].artista = req.body.artista;
    fs.writeFileSync(archivoDatos, JSON.stringify(canciones))
    res.send(canciones[idx]);
})
app.delete("/canciones/:id", (req, res) => {
    const canciones = JSON.parse(fs.readFileSync(archivoDatos));
    let idx = canciones.findIndex(x => x.id === Number(req.params.id));
    canciones.splice(idx, 1);
    fs.writeFileSync(archivoDatos, JSON.stringify(canciones));
    res.json(canciones);
})
/*app.get("/sqlserver/", (req, res) => {
    var Connection = require('tedious').Connection;  
    var config = {  
        server: 'LAPTOP-VVA-HP',  //update me
        authentication: {
            type: 'default',
            options: {
                userName: 'sa', //update me
                password: 'dasein'  //update me
            }
        },
        options: {
            // If you are on Microsoft Azure, you need encryption:
            encrypt: false,
            database: 'Cine'  //update me
        }
    };  
    var connection = new Connection(config);  
    connection.on('connect', function(err) {  
        // If no error, then good to proceed.
        console.log("Connected a sql server");  
        
    });    
    connection.connect();    
    var request = new connection.Request();           
    
        // query to the database and get the records
        // request.query('select * from pelicula where pel_agno = 2022', function (err, recordset) {
            
        //     if (err) console.log(err)

        //     // send records as a response
        //     res.send(recordset);
            
        // });
    
})*/
