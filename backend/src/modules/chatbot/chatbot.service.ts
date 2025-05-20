import { Injectable, Logger, NotFoundException, ForbiddenException, InternalServerErrorException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm'; 
import { QuestionAnswerEntity } from '../../common/entity/question-answer.entity';
import { ChatbotResponseDto } from './dto/chatbot-response.dto';
import { EmployeeEntity } from '../employee/employee.entity';
import { CompanyService } from '../company/company.service';
import { SubscriptionTier } from '../../common/enum/subscription-tier.enum';

interface UsageInfo {
    count: number;
    month: number; // 0-11
    year: number;
}

@Injectable()
export class ChatbotService {
    private readonly logger = new Logger(ChatbotService.name);
    private usageStore: Map<number, UsageInfo> = new Map();

    constructor(
        @InjectRepository(QuestionAnswerEntity)
        private readonly qaRepository: Repository<QuestionAnswerEntity>,
        @InjectRepository(EmployeeEntity)
        private readonly employeeRepository: Repository<EmployeeEntity>,
        @Inject(forwardRef(() => CompanyService))
        private readonly companyService: CompanyService,
    ) {}

    private async checkAndIncrementUsage(employeeId: number): Promise<{ limitReached: boolean; remaining: number | 'illimité' }> {
        const employee = await this.employeeRepository.findOne({
            where: { id: employeeId },
            relations: ['company'] 
        });

        if (!employee || !employee.company) {
            this.logger.error(`Cannot check usage: Employee ${employeeId} or associated company not found.`);
            throw new ForbiddenException('Cannot verify usage limits due to missing employee/company data.');
        }

        const limits = this.companyService.getTierLimits(employee.company.subscriptionTier);
        const monthlyLimit = limits.chatbotQuestions;

        if (monthlyLimit === 'illimité') {
            this.logger.debug(`Employee ${employeeId} has unlimited chatbot usage.`);
            return { limitReached: false, remaining: 'illimité' };
        }

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        let currentUsage = this.usageStore.get(employeeId);

        if (!currentUsage || currentUsage.year !== currentYear || currentUsage.month !== currentMonth) {
            currentUsage = { count: 0, month: currentMonth, year: currentYear };
            this.logger.log(`Resetting monthly chatbot usage count for employee ${employeeId}.`);
        }

        if (currentUsage.count >= monthlyLimit) {
            this.logger.warn(`Chatbot query limit (${monthlyLimit}) reached for employee ${employeeId}.`);
            return { limitReached: true, remaining: 0 };
        }

        currentUsage.count++;
        this.usageStore.set(employeeId, currentUsage);
        const remaining = monthlyLimit - currentUsage.count;
        this.logger.debug(`Employee ${employeeId} used chatbot. Count: ${currentUsage.count}/${monthlyLimit}. Remaining: ${remaining}.`);

        return { limitReached: false, remaining: remaining };
    }


    async findAnswer(employeeId: number, query: string): Promise<ChatbotResponseDto> {
        let usage: { limitReached: boolean; remaining: number | 'illimité' };
        try {
             usage = await this.checkAndIncrementUsage(employeeId);
        } catch (error) {
             this.logger.error(`Usage check failed for employee ${employeeId}: ${error.message}`, error.stack)
             if (error instanceof ForbiddenException) throw error;
             throw new InternalServerErrorException('Could not verify usage limits.');
        }


        if (usage.limitReached) {
            return {
                answer: "Vous avez atteint votre limite de questions pour ce mois.",
                limitReached: true,
                remainingQueries: 0
            };
        }

        try {
            const queryWords = query.toLowerCase().split(' ').filter(w => w.length > 2); 
            let bestMatch: QuestionAnswerEntity | null = null;
            bestMatch = await this.qaRepository.findOne({ where: { question: query, isActive: true } });

            if (!bestMatch && queryWords.length > 0) {
                 const keywordMatches = await this.qaRepository.createQueryBuilder("qa")
                    .where("qa.isActive = :isActive", { isActive: true })
                    .andWhere("LOWER(qa.keywords) LIKE LOWER(:kw1) OR LOWER(qa.keywords) LIKE LOWER(:kw2)",
                              { kw1: `%${queryWords[0]}%`, kw2: `%${queryWords[1] ?? queryWords[0]}%` })
                    .orderBy("qa.priority", "DESC") 
                    .limit(1)
                    .getOne();
                bestMatch = keywordMatches;
            }

            if (bestMatch) {
                this.logger.log(`Found answer (ID: ${bestMatch.id}) for query from employee ${employeeId}: "${query}"`);
                return {
                    answer: bestMatch.answer,
                    sourceId: bestMatch.id,
                    limitReached: false, 
                    remainingQueries: usage.remaining,
                };
            } else {
                this.logger.log(`No specific answer found for query from employee ${employeeId}: "${query}"`);
                return {
                    answer: "Je ne suis pas sûr de comprendre votre question. Pouvez-vous reformuler ou consulter nos fiches pratiques ?",
                    limitReached: false,
                    remainingQueries: usage.remaining,
                };
            }

        } catch (error) {
            this.logger.error(`Error finding answer for employee ${employeeId}: ${error.message}`, error.stack);
            throw new InternalServerErrorException('Error while processing your request.');
        }
    }
}