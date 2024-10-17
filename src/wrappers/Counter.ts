// import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

// export type CounterConfig = {
//     id: number;
//     counter: number;
// };

// export function counterConfigToCell(config: CounterConfig): Cell {
//     return beginCell().storeUint(config.id, 32).storeUint(config.counter, 32).endCell();
// }

// export const Opcodes = {
//     increase: 0x7e8764ef,
// };

// export class Counter implements Contract {
//     constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

//     static createFromAddress(address: Address) {
//         return new Counter(address);
//     }

//     static createFromConfig(config: CounterConfig, code: Cell, workchain = 0) {
//         const data = counterConfigToCell(config);
//         const init = { code, data };
//         return new Counter(contractAddress(workchain, init), init);
//     }

//     async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
//         await provider.internal(via, {
//             value,
//             sendMode: SendMode.PAY_GAS_SEPARATELY,
//             body: beginCell().endCell(),
//         });
//     }

//     async sendIncrease(
//         provider: ContractProvider,
//         via: Sender,
//         opts: {
//             increaseBy: number;
//             value: bigint;
//             queryID?: number;
//         }
//     ) {
//         await provider.internal(via, {
//             value: opts.value,
//             sendMode: SendMode.PAY_GAS_SEPARATELY,
//             body: beginCell()
//                 .storeUint(Opcodes.increase, 32)
//                 .storeUint(opts.queryID ?? 0, 64)
//                 .storeUint(opts.increaseBy, 32)
//                 .endCell(),
//         });
//     }

//     async getCounter(provider: ContractProvider) {
//         const result = await provider.get('get_counter', []);
//         return result.stack.readNumber();
//     }

//     async getID(provider: ContractProvider) {
//         const result = await provider.get('get_id', []);
//         return result.stack.readNumber();
//     }
// }
import { Contract, ContractProvider, Sender, Address, Cell, contractAddress, beginCell } from '@ton/core';

export default class Counter implements Contract {
    static createForDeploy(code: Cell, initialCounterValue: number): Counter {
        const data = beginCell().storeUint(initialCounterValue, 64).endCell();
        const workchain = 0; // deploy to workchain 0
        const address = contractAddress(workchain, { code, data });
        return new Counter(address, { code, data });
    }

    constructor(
        readonly address: Address,
        readonly init?: { code: Cell; data: Cell },
    ) {}

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: '0.01', // send 0.01 TON to contract for rent
            bounce: false,
        });
    }

    async getCounter(provider: ContractProvider) {
        const { stack } = await provider.get('counter', []);
        return stack.readBigNumber();
    }

    async sendIncrement(provider: ContractProvider, via: Sender) {
        const messageBody = beginCell()
            .storeUint(1, 32) // op (op #1 = increment)
            .storeUint(0, 64) // query id
            .endCell();
        await provider.internal(via, {
            value: '0.002', // send 0.002 TON for gas
            body: messageBody,
        });
    }
}
