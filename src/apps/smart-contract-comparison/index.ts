import {
	websocketConnection,
	websocketEvents,
} from '@/api/websocket/websocket-connection';
import { TransactionStatusResponse } from '@/utils/types';
import { compareSmartContractRootState } from '@/apps/smart-contract-comparison/blockchain-utils/compare-smart-contract-root-state';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { transactionStatusAccuracyChecker } from '@/apps/smart-contract-comparison/hedera/transaction-status-accuracy-checker';

(async () => {
	await writeLogFile(
		`logs/transaction-checker.csv`,
		'BlockNumber,EthereumTransactioHash,HederaTransactionHash,Result \r\n'
	);

	// Start listening for the shadowing api requests from evm_shadowing api
	websocketConnection();
	await new Promise((resolve) => setTimeout(resolve, 2000));

	const eventQueue: TransactionStatusResponse[] = []
	let isProcessing = false;

	websocketEvents.on('websocket', async (contractData: TransactionStatusResponse) => {
		eventQueue.push(contractData)
		await new Promise((resolve) => setTimeout(resolve, 3000));
		await processQueue();
	});

	async function processQueue() {
		if (isProcessing) return;

		isProcessing = true;
		while (eventQueue.length > 0) {
			const contractData = eventQueue.shift();
			if (contractData) {
				await transactionStatusAccuracyChecker(contractData);
				await compareSmartContractRootState(contractData);
			}
		}
		isProcessing = false;
	}
})();
