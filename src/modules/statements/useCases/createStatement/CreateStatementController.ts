import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { Statement } from '../../entities/Statement';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { amount, description } = request.body;
    const { receiver_id } = request.params;
    let type =  OperationType.DEPOSIT

    const splittedPath = request.originalUrl.split('/')
    
    if (splittedPath.includes('deposit')) { type =  OperationType.DEPOSIT; }
    if (splittedPath.includes('withdraw')) { type =  OperationType.WITHDRAW; }
    if (splittedPath.includes('transfer')) { type =  OperationType.TRANSFER; }
    
    const createStatement = container.resolve(CreateStatementUseCase);

    if (type === OperationType.TRANSFER){
      const transferResponse: Statement[] = [];
      const sender_id = user_id;
      const senderStatement = await createStatement.execute({
        user_id: sender_id,
        type,
        amount,
        description
      });
      transferResponse.push(senderStatement);
      const receiverStatement = await createStatement.execute({
        user_id: receiver_id,
        type,
        amount,
        description,
        sender_id
      });
      transferResponse.push(receiverStatement)
      return response.status(201).json(transferResponse)
    }

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description
    });
    return response.status(201).json(statement);
  }
}
