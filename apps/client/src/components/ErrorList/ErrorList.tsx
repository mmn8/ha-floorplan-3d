import Modal from "@/components/Modal/Modal";
import { useErrorStore } from "@/store/ErrorStore";
import type { Error } from "@/store/ErrorStore";
import { RefreshCcw } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface ErrorDisplay {
  error: Error;
}

function ErrorDisplay({ error }: ErrorDisplay) {
  return (
    <>
      <div className="w-full h-auto text-text">
        <h1 className="font-bold text-sm">{String(error?.title ?? "")}</h1>
        <p className="font-light text-xs">{String(error?.description ?? "")}</p>
      </div>
    </>
  );
}

function Divider() {
  return <div className="w-auto border-border rounded-sm border-1 mt-2"></div>;
}

export function ErrorList() {
  const { errors } = useErrorStore();
  const queryClient = useQueryClient();

  function handleClick() {
    queryClient.invalidateQueries({ refetchType: "all" });
  }

  return (
    <div className="w-auto h-auto flex flex-col">
      <div className="flex text-gray-400 items-center gap-4">
        <h1 className="text-2xl text-red-500">{errors.length} Error(s)</h1>
        <button
          className="	rounded-full text-text bg-light p-1 transition duration-10 focus:outline-none focus:ring-2"
          onClick={handleClick}
        >
          <RefreshCcw className="stroke-2  " />
        </button>
      </div>
      <Divider />
      <div className="flex mt-2 flex-col gap-1 pl-1">
        {errors.map((item, index) => {
          return <ErrorDisplay key={index} error={item} />;
        })}
      </div>
    </div>
  );
}

interface ErrorModalProps {
  isOpen: boolean;
  closeModal: () => void;
}

export default function ErrorModal({ isOpen, closeModal }: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ErrorList />
    </Modal>
  );
}
