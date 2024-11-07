export type TransactionType = 'TRANSFER' | 'TRANSFER_TRANSACTION';

export type Genesis = {
	toAccount: string;
	amount: number;
};

export interface StateData {
	slot: string;
	value: string;
	timestamp: string;
	address: string;
}

export interface ContractType {
	addressTo: string;
	blockNumber: number;
	currentTimestamp: string;
	ethereumTransactionHash: string | null;
	hederaTransactionHash: string;
	transactionId: string;
	txTimestamp: string;
	type: string;
}

export interface TransactionStatusResponse extends ContractType{
	status: string,
}
