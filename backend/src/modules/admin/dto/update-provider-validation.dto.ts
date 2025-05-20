import { IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { ContractStatus } from '../../../common/enum/contract-status.enum';

export class UpdateProviderValidationDto {
    @IsNotEmpty()
    @IsBoolean()
    isVerified: boolean;

    @IsNotEmpty()
    @IsEnum(ContractStatus)
    validationStatus: ContractStatus;
}