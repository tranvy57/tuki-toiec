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
                this.httpService.post<{
                    data: {
                        data: { result: string };
                        statusCode: number;
                    };
                    message: string;
                    statusCode: number;
                }>(
                    this.AI_SERVICE_URL,
                    chatRequest,
                ),
            );

            // AI service returns: { data: { data: { result: "..." }, statusCode: 200 }, message: "Success", statusCode: 200 }
            // We need to extract: data.data.result
            return {
                data: {
                    result: response.data.data.data.result,
                },
                statusCode: response.data.statusCode,
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
