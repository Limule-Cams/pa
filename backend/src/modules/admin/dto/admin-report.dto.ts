import { ReportStatus } from "../../../common/enum/report-status.enum";

export class AdminReportDto {
  id: number;
  reportedAt: Date;
  status: ReportStatus; 
  category?: string;
  contentPreview: string;
}