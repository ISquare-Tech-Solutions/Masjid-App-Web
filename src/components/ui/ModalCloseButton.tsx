'use client';

import { CloseIcon } from './Icons';

interface ModalCloseButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

export default function ModalCloseButton({ onClick, disabled }: ModalCloseButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className="w-[36px] h-[36px] flex items-center justify-center bg-[rgba(7,119,52,0.1)] rounded-[8px] hover:bg-[rgba(7,119,52,0.2)] transition-colors shrink-0 disabled:opacity-50"
        >
            <CloseIcon size={24} className="text-[var(--grey-800)]" />
        </button>
    );
}
