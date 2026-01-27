import SetupWizard from "@/pages/SetupView";
import { LoadingCircleSpinner } from "@/components/LoadingSpinner";
import { useHomeData, useAppConfig } from "@/hooks";

export interface Config {
  configured: boolean;
}

interface HomeProps {
  children: React.ReactNode;
}

export default function Home({ children }: HomeProps) {
  const dataQuery = useHomeData();
  const configQuery = useAppConfig();

  if (dataQuery.isLoading || configQuery.isLoading) {
    return <LoadingCircleSpinner />;
  }

  if (!configQuery.data?.configured) {
    return <SetupWizard />;
  }

  return <>{children}</>;
}
