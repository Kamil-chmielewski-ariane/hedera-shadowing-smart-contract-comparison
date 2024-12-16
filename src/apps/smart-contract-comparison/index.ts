import {
	websocketConnection,
	websocketEvents,
} from '@/api/websocket/websocket-connection';
import { TransactionStatusResponse } from '@/utils/types';
import { compareSmartContractRootState } from '@/apps/smart-contract-comparison/blockchain-utils/compare-smart-contract-root-state';
import { writeLogFile } from '@/utils/helpers/write-log-file';
import { transactionStatusAccuracyChecker } from '@/apps/smart-contract-comparison/hedera/transaction-status-accuracy-checker';

(async () => {
	let iterations = 0;
	let currentLogFileNumber = 1;
	await writeLogFile(
		`logs/transaction-checker-${currentLogFileNumber}.csv`,
		'transactionId,type,blockNumber,addressTo,txTimestamp,currentTimestamp,hederaTransactionHash,ethereumTransactionHash,status \r\n'
	);

	await writeLogFile(
		`logs/all-contracts-details.csv`,
		'blockNumber,ethereumTransactionHash,timestamp,contractAddress,searchedSlot,hederaValue,ethereumValue \r\n'
	);

	await writeLogFile(
		`logs/state-root-compare-errors.csv`,
		'blockNumber,ethereumTransactionHash,timestamp,contractAddress,searchedSlot,hederaValue,ethereumValue \r\n'
	);

	// Start listening for the shadowing api requests from evm_shadowing api
	websocketConnection();
	await new Promise((resolve) => setTimeout(resolve, 2000));
	const eventQueue: TransactionStatusResponse[] = [];
	let isProcessing = false;

	websocketEvents.on(
		'websocket',
		async (contractData: TransactionStatusResponse) => {
			eventQueue.push(contractData);
			await processQueue();
		}
	);

	async function processQueue() {
		if (isProcessing) return;

		isProcessing = true;
		while (eventQueue.length > 0) {
			const contractData = eventQueue.shift();
			if (contractData) {
				iterations++;
				if (iterations % 500000 === 0 && iterations !== 0) {
					currentLogFileNumber++;
					await writeLogFile(
						`logs/transaction-checker-${currentLogFileNumber}.csv`,
						'transactionId,type,blockNumber,addressTo,txTimestamp,currentTimestamp,hederaTransactionHash,ethereumTransactionHash,status \r\n'
					);
				}
				await transactionStatusAccuracyChecker(
					contractData,
					currentLogFileNumber
				);
				await compareSmartContractRootState(contractData);
			}
		}
		isProcessing = false;
	}
})();
