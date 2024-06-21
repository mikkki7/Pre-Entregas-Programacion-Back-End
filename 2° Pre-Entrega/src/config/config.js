import path from 'path';

const config = {
    server: 'local',
    port: 5050,
    dirname: path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:\/)/, '$1')),
    get UPLOAD_DIR() { return `${this.dirname}/public/images`},
    // mongoDB_URI: 'mongodb://127.0.0.1:27017/miki',
    mongoDB_URI: 'mongodb+srv://miki:SWWu23D0aqfUkKCF@miki.o8ujp94.mongodb.net/miki',
    mongoDB_ID_regex: /^[a-fA-F0-9]{24}$/
}

export default config;