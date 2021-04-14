import { OperationType, Statement } from "../../entities/Statement";

export type ICreateStatementDTO = {
  user_id: string;
  description: string;
  amount: number;
  type: OperationType;
  sender_id?: string;
}

