import {
	websocketConnection,
	websocketEvents,
} from '@/api/websocket/websocket-connection';
import { TransactionStatusResponse } from '@/utils/types';
import { compareSmartContractRootState } from '@/apps/smart-contract-comparision/blockchain-utils/compare-smart-contract-root-state';

(async () => {
	websocketConnection();
	await new Promise((resolve) => setTimeout(resolve, 2000));

	websocketEvents.on('websocket', (contractData: TransactionStatusResponse) => {
		compareSmartContractRootState(contractData);
	});
})();
