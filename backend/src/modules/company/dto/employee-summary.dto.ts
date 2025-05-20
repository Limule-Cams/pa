import { ContractType } from "../../../common/enum/contract-type.enum";

export class EmployeeSummaryDto {
  id: number; 
  userId: number; 
  firstName: string; 
  lastName: string;
  email: string;
  occupied_job: string;
  startingDate: Date;
  endDate?: Date;
  contractType: ContractType;
}