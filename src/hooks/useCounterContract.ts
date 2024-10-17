import { useEffect, useState } from "react";
import Counter from "../wrappers/Counter";
import { useTonClient } from "./useTonClient";
import { useAsyncInitialize } from "./useAsyncInitialize";
import "dotenv/config";
import { Address, OpenedContract } from "@ton/core";

export function useCounterContract() {
  const client: any = useTonClient();
  const [val, setVal] = useState<null | number>();

  const counterContract = useAsyncInitialize(async () => {
    if (!client) return;
    // const contract_address = import.meta.env.VITE_CONTRACT_ADDRESS;
    const contract = new Counter(
      Address.parse("EQCvGZCEA3AcjIXjrXMjbk-RgpWAO_Dv2M1Bb0mgsligQn1j") // replace with your address from tutorial 2 step 8
    );
    return client.open(contract) as OpenedContract<Counter>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!counterContract) return;
      setVal(null);
      const val = await counterContract.getCounter();
      setVal(Number(val));
    }
    getValue();
  }, [counterContract]);

  return {
    value: val,
    address: counterContract?.address.toString(),
  };
}
