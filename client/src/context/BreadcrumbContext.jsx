import { createContext, useContext, useEffect, useState } from "react";

const BreadcrumbContext = createContext({
  dynamicLabel: null,
  setDynamicLabel: () => {},
});

export function BreadcrumbProvider({ children }) {
  const [dynamicLabel, setDynamicLabel] = useState(null);

  return (
    <BreadcrumbContext.Provider value={{ dynamicLabel, setDynamicLabel }}>
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumbLabel(label) {
  const { setDynamicLabel } = useContext(BreadcrumbContext);

  useEffect(() => {
    if (!label) return;
    setDynamicLabel(label);
    return () => setDynamicLabel(null);
  }, [label, setDynamicLabel]);
}

export function useBreadcrumbContext() {
  return useContext(BreadcrumbContext);
}
