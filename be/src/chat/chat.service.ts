import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Injectable()
export class ChatService {
    private readonly AI_SERVICE_URL = 'http://34.143.141.5:8000/api/chat';

    constructor(private readonly httpService: HttpService) { }

    async sendMessage(chatRequest: ChatRequestDto): Promise<ChatResponseDto> {
        try {
            const response = await firstValueFrom(
                this.httpService.post<{ data: { result: string } }>(
                    this.AI_SERVICE_URL,
                    chatRequest,
                ),
            );

            return {
                data: {
                    result: response.data.data.result,
                },
                statusCode: response.status,
            };
        } catch (error) {
            console.error('Chat service error:', error);
            throw new HttpException(
                {
                    data: {
                        result: 'Sorry, I am unable to process your request at the moment.',
                    },
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                },
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
