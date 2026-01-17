import { useState, useEffect } from "react";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import ErrorList from "@/components/ErrorList";
import SetupWizard from "@/pages/SetupView";
import { LoadingCircleSpinner } from "@/components/LoadingSpinner";
import { useLoadHome } from "@/hooks/useLoadHome";

export default function Home({ children }) {
  //Load home.yaml --> load buildings --> parse --> save to zustand store

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { errors } = useErrorStore();
  const [config, setConfig] = useState(null);
  const fetchHomeData = useLoadHome(setIsLoading, setConfig);

  useEffect(() => {
    fetchHomeData();
  }, []);

  if (isLoading) {
    return <LoadingCircleSpinner />;
  }

  if (!config?.configured) {
    return <SetupWizard setConfig={setConfig} config={config} />;
  }

  if (errors.filter((e) => e.type === ErrorType.FATAL).length != 0) {
    return <ErrorList isOpen={true} closeModal={undefined} />;
  }

  return <>{children}</>;
}
