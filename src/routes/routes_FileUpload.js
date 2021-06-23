const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

// default options
app.use(fileUpload());


app.post('/API/upload2', function(req, res) {
    let sampleFile;
    let uploadPath;
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }
    console.log('req.files >>>', req.files); // eslint-disable-line
    sampleFile = req.files.xslx;
    uploadPath = __dirname + '/uploads/' + sampleFile.name;
    console.log(uploadPath);
    sampleFile.mv(uploadPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send('File uploaded to ' + uploadPath);
    });
});

app.post('/API/upload', (req, res) => {
    let File = req.files.xslx;
    console.log(File);

    // let EDFile = req.files;
    // let objeto = {
    //     xslx: EDFile.xslx,
    //     pdf: EDFile.pdf
    // }
    // console.log(objeto);

    File.mv(`../files/${File.name}`, err => {
        if (err) return res.status(500).send({ message: err })
        res.json({
            ok: true,
            message: "Respuesta upload"
        })
    })
})

module.exports = app;