import { compareSmartContractRootState } from '@/apps/smart-contract-comparision/blockchain-utils/compare-smart-contract-root-state';
import { websocketEvents } from '@/api/websocket/websocket-connection';
import { TransactionStatusResponse } from '@/utils/types';

(async () => {
	websocketEvents.on('websocket', (contractData: TransactionStatusResponse) => {
		console.log(contractData);
		// compareSmartContractRootState(contractData.transactionPayload);
	});
})();
