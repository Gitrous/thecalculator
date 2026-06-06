import { createContext, useContext } from "react";

export type Locale = "es" | "en";
export const LocaleContext = createContext<Locale>("es");
export const useLocale = () => useContext(LocaleContext);
