const QRCode = require('qrcode');
const path = require('path');

const url = 'https://cardapiokop.ascendcreative.com.br';
const outputPath = path.join(__dirname, '../public/assets/img/qrcode_mesa.png');

// Gold Version
QRCode.toFile(path.join(__dirname, '../public/assets/img/qrcode_mesa.png'), url, {
    color: { dark: '#C8A26A', light: '#00000000' },
    width: 1000,
    margin: 1
});

// Black Version (High Contrast)
QRCode.toFile(path.join(__dirname, '../public/assets/img/qrcode_mesa_preto.png'), url, {
    color: { dark: '#000000', light: '#00000000' },
    width: 1000,
    margin: 1
}, function (err) {
    if (err) throw err;
    console.log('QR Codes generated successfully (Gold & Black)!');
});
