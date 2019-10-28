import params from './data/socket.json'
if (!('host' in params)) {
    params.host = '127.0.0.1';
}
export const publicHost = `https://${params.host}`;
export const privateHost = `https://${params.host}/private`;
