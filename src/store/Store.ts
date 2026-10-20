import { DiagramStore } from "@mapequation/alluvial-diagram";
import { createContext } from "react";
import InputStore from "./InputStore";

export class Store extends DiagramStore {
  input = new InputStore(this);

  constructor() {
    super({ identifier: "name", colorScheme: "C3 Turbo", showModuleId: true });
  }
}

export const StoreContext = createContext(new Store());
