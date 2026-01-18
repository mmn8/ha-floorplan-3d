import { useState, useEffect, useEffectEvent } from "react";
import { useErrorStore, ErrorType } from "@/store/ErrorStore";
import SetupWizard from "@/pages/SetupView";
import { LoadingCircleSpinner } from "@/components/LoadingSpinner";
import { useLoadHome } from "@/hooks/useLoadHome";

export interface Config {
  configured: boolean;
}

interface HomeProps {
  children: React.ReactNode;
}

export default function Home({ children }: HomeProps) {
  //Load home.yaml --> load buildings --> parse --> save to zustand store

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { errors } = useErrorStore();
  const [config, setConfig] = useState<Config>(null);
  const _fetchHomeData = useLoadHome(setIsLoading, setConfig);

  const fetchHomeData = useEffectEvent(() => {
    _fetchHomeData();
  });

  useEffect(() => {
    fetchHomeData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <LoadingCircleSpinner />;
  }

  if (!config?.configured) {
    return <SetupWizard setConfig={setConfig} config={config} />;
  }

  return <>{children}</>;
}
