import { NextFunction, Request, Response, Router } from 'express';
import { handleEndShift, EndShift } from './handler';
import { updateCashierShift } from '../processCashierShift';
import { getCashierShiftStreamName } from '../cashierShift';
import { isCommand } from '#core/commands';
import { isNotEmptyString } from '#core/validation';

export const route = (router: Router) =>
  router.delete(
    '/cash-registers/:cashRegisterId/shifts',
    async function (request: Request, response: Response, next: NextFunction) {
      try {
        const command = mapRequestToCommand(request);

        if (!isCommand(command)) {
          next({ status: 400, message: command });
          return;
        }

        const streamName = getCashierShiftStreamName(
          command.data.cashRegisterId,
          command.data.cashierShiftId
        );

        const result = await updateCashierShift(
          streamName,
          command,
          handleEndShift
        );

        if (result.isError) {
          switch (result.error) {
            case 'STREAM_NOT_FOUND':
              response.sendStatus(404);
              break;
            case 'SHIFT_ALREADY_ENDED':
            case 'FAILED_TO_APPEND_EVENT':
              response.sendStatus(409);
              break;
            default:
              break;
          }
        }
        response.sendStatus(200);
      } catch (error) {
        next(error);
      }
    }
  );

function mapRequestToCommand(
  request: Request
): EndShift | 'MISSING_CASH_REGISTER_ID' {
  if (!isNotEmptyString(request.params.cashRegisterId)) {
    return 'MISSING_CASH_REGISTER_ID';
  }

  return {
    type: 'end-shift',
    data: {
      cashRegisterId: request.route.cashRegisterId,
      cashierShiftId: request.params.id,
    },
  };
}
