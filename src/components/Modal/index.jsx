import { useEffect, useRef } from "react";

// 네이티브 <dialog>의 showModal()로 포커스 가두기·ESC 닫기·배경 비활성(inert)을 처리한다
const Modal = ({ isOpen, onClose, children }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto bg-white rounded-2xl shadow-lg w-[calc(100%-2rem)] max-w-md p-6 h-[500px] max-h-[85vh] backdrop:bg-black/50"
    >
      <div className="flex flex-col justify-between h-full gap-4">
        <div className="text-[18px] overflow-y-auto">{children}</div>
        <div className="text-center">
          <button
            onClick={onClose}
            className="px-8 py-2 border-1 bg-blue-600 text-white cursor-pointer"
          >
            확인
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default Modal;
