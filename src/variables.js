import params from './data/socket.json'
if (!('host' in params)) {
    params.host = '127.0.0.1';
}
if (!('port' in params)) {
    params.port = 8000;
}
if (!('protocol' in params)) {
    params.protocol = (params.protocol == 'https' || params.protocol == 'http') ? params.protocol : 'https';
}
export const publicHost = `${params.protocol}://${params.host ? ':' + params.host : ''}:${params.port ? params.port : ''}`;
export const privateHost = `${params.protocol}://${params.host}:${params.port}/private`;
