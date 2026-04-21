import QRCode from 'qrcode';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const url = 'https://cardapiokop.ascendcreative.com.br';

async function generate() {
    try {
        // Gold Version
        await QRCode.toFile(path.join(__dirname, '../public/assets/img/qrcode_mesa.png'), url, {
            color: { dark: '#C8A26A', light: '#00000000' },
            width: 1000,
            margin: 1
        });
        
        // Black Version (High Contrast)
        await QRCode.toFile(path.join(__dirname, '../public/assets/img/qrcode_mesa_preto.png'), url, {
            color: { dark: '#000000', light: '#00000000' },
            width: 1000,
            margin: 1
        });
        
        console.log('✅ QR Codes generated successfully (Gold & Black)!');
    } catch (err) {
        console.error('❌ Error generating QR codes:', err);
    }
}

generate();
