import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';
import { Public } from 'src/common/decorator/public.decorator';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @Public()
    @Post()
    async sendMessage(
        @Body() chatRequest: ChatRequestDto,
    ): Promise<string> {
        return this.chatService.sendMessage(chatRequest);
    }
}
