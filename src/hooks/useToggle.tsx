import { useState } from "react";

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggleState = () => setState((p) => !p);

  return [state, toggleState, setState!] as [state: typeof state, toggleState: () => void, setState: typeof setState];
};
