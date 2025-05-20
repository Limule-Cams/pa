import { ContractStatus } from "../../../common/enum/contract-status.enum";

export class ContractDto {
  id: number;
  startDate: Date;
  endDate?: Date;
  status: ContractStatus;
  renewable: boolean;
  conditions?: string;
  fileUrl: string;
  companyId: number;
}