export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        try {
            const http = await import('node:http');
            const origListen = http.Server.prototype.listen;
            if (typeof origListen === 'function') {
                http.Server.prototype.listen = function (...args) {
                    this.keepAliveTimeout = 65000;
                    this.headersTimeout = 66000;
                    this.requestTimeout = 120000;
                    return origListen.apply(this, args);
                };
            }

            const origAdd = http.IncomingMessage.prototype._addHeaderLines;
            if (typeof origAdd === 'function') {
                http.IncomingMessage.prototype._addHeaderLines = function (...args) {
                    origAdd.apply(this, args);
                    if (this.headers && typeof this.headers.hasOwnProperty !== 'function') {
                        Object.setPrototypeOf(this.headers, Object.prototype);
                    }
                    if (this.rawHeaders && typeof this.rawHeaders.hasOwnProperty !== 'function') {
                        Object.setPrototypeOf(this.rawHeaders, Object.prototype);
                    }
                };
            }
        } catch (e) {
            // Silently fallback if http prototype patching is restricted
        }
    }
}