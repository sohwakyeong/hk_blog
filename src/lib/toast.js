import { toast } from "react-hot-toast";

const baseToastClasses = (t) =>
  `${t.visible ? "animate-enter" : "animate-leave"} px-4 py-2 rounded-md shadow-md text-sm`;

export function showError(error) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string"
      ? error
      : "알 수 없는 오류가 발생하였습니다.";

  toast.custom((t) => (
    <div className={`${baseToastClasses(t)} bg-gray-100 text-black border border-gray-200`}>
      {message}
    </div>
  ));
}

export function showSuccess(message) {
  toast.custom((t) => (
    <div className={`${baseToastClasses(t)} bg-black text-white`}>
      {message}
    </div>
  ));
}
