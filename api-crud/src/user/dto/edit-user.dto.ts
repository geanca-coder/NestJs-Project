import { IsEmail, IsOptional, IsString } from "class-validator"

export class EditUserDto{
    
    @IsEmail()
    @IsString()
    @IsOptional()
    email? : string

    @IsString()
    @IsOptional()
    firstname? : string

    @IsString()
    @IsOptional()
    lastname? : string
}