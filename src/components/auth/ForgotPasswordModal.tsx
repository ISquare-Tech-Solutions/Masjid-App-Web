c'use client';

import Modal from '@/components/ui/Modal';
import ModalCloseButton from '@/components/ui/ModalCloseButton';
import Button from '@/components/ui/Button';

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
    providerEmail?: string;
}

export default function ForgotPasswordModal({
    isOpen,
    onClose,
    providerEmail = 'support@masjid-app.com',
}: ForgotPasswordModalProps) {
    const handleSendEmail = () => {
        window.location.href = `mailto:${providerEmail}?subject=Password Reset Request`;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="max-w-[480px] p-0">
            <div className="bg-white rounded-[24px] p-[32px] flex flex-col gap-[24px]">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <h2 className="font-inter font-bold text-[24px] text-[var(--grey-800)] leading-normal">
                        Forget Your Password
                    </h2>
                    <ModalCloseButton onClick={onClose} />
                </div>

                {/* Description */}
                <p className="font-inter font-normal text-[16px] text-[var(--grey-100)] leading-relaxed">
                    To reset your password, please contact the system provider. Click the button below to send an email request for a password reset.
                </p>

                {/* Send Email Button */}
                <Button
                    type="button"
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleSendEmail}
                >
                    Send Email
                </Button>

                {/* Back to Sign-In */}
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full font-inter font-medium text-[16px] text-[var(--grey-800)] text-center hover:underline transition-colors"
                >
                    Back to Sign-In
                </button>
            </div>
        </Modal>
    );
}
