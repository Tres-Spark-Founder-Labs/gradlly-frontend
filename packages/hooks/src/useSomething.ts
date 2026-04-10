import { useState } from "react";

export const useSomething = (initialValue = false) => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    enable: () => setValue(true),
    disable: () => setValue(false),
    toggle: () => setValue((current) => !current),
  };
};
