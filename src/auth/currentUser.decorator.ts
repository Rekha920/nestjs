/* eslint-disable prettier/prettier */
//creating the custom decorator
//decorator is always a function

import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: unknown , ctx: ExecutionContext) =>{
        const request = ctx.switchToHttp().getRequest();
    return request.user ?? null;
    }
)