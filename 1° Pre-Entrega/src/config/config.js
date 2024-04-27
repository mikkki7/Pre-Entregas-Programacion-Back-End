import * as url from 'url';

const config = {
    port: 8080,
    dirname: url.fileURLToPath(new URL(`.`, import.meta.url)),
    get UPLOAD_DIR() { return `${this.dirname}/public/images`}
}

export default config;