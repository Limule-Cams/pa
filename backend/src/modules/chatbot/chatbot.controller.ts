import { Controller, Post, Body, UseGuards, Req, Logger, HttpCode, HttpStatus, ForbiddenException } from '@nestjs/common'; // <-- ForbiddenException ajouté ici
import { ChatbotService } from './chatbot.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../core/guards/roles.guard';
import { Roles } from '../../core/decorators/roles.decorator';
import { UsersRoles } from '../../common/enum/roles.enum';
import { JwtToken } from '../../auth/jwt/jwt-token.interface';
import { ChatbotQueryDto } from './dto/chatbot-query.dto';
import { ChatbotResponseDto } from './dto/chatbot-response.dto';
import { EmployeeService } from '../employee/employee.service'; 

@Controller('chatbot') 
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UsersRoles.CLIENT) 
export class ChatbotController {
    private readonly logger = new Logger(ChatbotController.name);

    constructor(
        private readonly chatbotService: ChatbotService,
        private readonly employeeService: EmployeeService, 
    ) {}

    @Post('query')
    @HttpCode(HttpStatus.OK)
    async handleQuery(
        @Req() req: { user: JwtToken },
        @Body() queryDto: ChatbotQueryDto
    ): Promise<ChatbotResponseDto> {
        const userId = parseInt(String(req.user?.userId), 10);
        if (isNaN(userId)) {
             this.logger.error('Invalid userId in JWT token for chatbot query.');
             throw new ForbiddenException('Invalid user identification.'); 
        }

        const employee = await this.employeeService.findEmployeeByUserId(userId);

        this.logger.log(`Chatbot query received from employee ${employee.id}: "${queryDto.query}"`);
        return this.chatbotService.findAnswer(employee.id, queryDto.query);
    }
}