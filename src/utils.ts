import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';

export function md5(str) {
    const hash = crypto.createHash('md5');
    hash.update(str);
    return hash.digest('hex');
}

export function generateParseIntPipe(data) {
    return new ParseIntPipe({
        exceptionFactory(){
            throw new BadRequestException(data + '应该传数字')
        }
    })
}