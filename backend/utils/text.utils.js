import crypto from 'crypto';

export function sha1Encode(text) {
    return crypto.createHash('sha1').update(text).digest('hex');
}