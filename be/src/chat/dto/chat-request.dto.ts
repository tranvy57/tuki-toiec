import { IsNotEmpty, IsString } from 'class-validator';

export class ChatRequestDto {
    @IsString()
    @IsNotEmpty()
    chat_id: string;

    @IsString()
    @IsNotEmpty()
    user_input: string;

    @IsString()
    @IsNotEmpty()
    user_id: string;
}
