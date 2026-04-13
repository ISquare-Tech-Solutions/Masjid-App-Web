'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}

export default function Modal({ isOpen, onClose, children, className = '', style }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleOverlayClick = (e: React.MouseEvent) => {
        if (e.target === overlayRef.current) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return createPortal(
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
        >
            <div className="flex min-h-full items-center justify-center p-4">
                <div
                    className={`bg-white rounded-[24px] shadow-xl w-full animate-in zoom-in-95 duration-200 ${className}`}
                    style={style}
                    role="dialog"
                    aria-modal="true"
                >
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
