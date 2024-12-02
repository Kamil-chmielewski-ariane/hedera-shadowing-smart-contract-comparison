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

	websocketEvents.on('websocket', async (contractData: TransactionStatusResponse) => {
		await transactionStatusAccuracyChecker(contractData);
		await compareSmartContractRootState(contractData);
	});
})();
