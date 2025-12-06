import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ChatRequestDto } from './dto/chat-request.dto';
import { ChatResponseDto } from './dto/chat-response.dto';

@Injectable()
export class ChatService {
  private readonly AI_SERVICE_URL = 'http://34.143.141.5:8000/api/chat';

  constructor(private readonly httpService: HttpService) {}

  async sendMessage(chatRequest: ChatRequestDto): Promise<string> {
    try {
      const response = await firstValueFrom(
        this.httpService.post(this.AI_SERVICE_URL, chatRequest),
      );

      // Log the actual response structure for debugging
      console.log(
        'AI Service Response:',
        JSON.stringify(response.data, null, 2),
      );

      // Try to extract the result from various possible structures
      let result: string;

      // Check different possible response structures
      if (response.data?.data?.data?.result) {
        // Structure: { data: { data: { result: "..." } } }
        result = response.data.data.data.result;
      } else if (response.data?.data?.result) {
        // Structure: { data: { result: "..." } }
        result = response.data.data.result;
      } else if (response.data?.result) {
        // Structure: { result: "..." }
        result = response.data.result;
      } else {
        console.error('Unexpected response structure:', response.data);
        throw new Error('Unable to extract result from AI service response');
      }

      return result;
    } catch (error) {
      console.error('Chat service error:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
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
