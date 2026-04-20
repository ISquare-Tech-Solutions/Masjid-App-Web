import { SendIcon, EditIcon, TrashIcon } from '@/components/ui/Icons';

interface DraftRowActionsProps {
    onPublish: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function DraftRowActions({ onPublish, onEdit, onDelete }: DraftRowActionsProps) {
    return (
        <div className="flex items-center gap-[12px]">
            <button
                onClick={onPublish}
                title="Publish"
                className="text-[var(--brand)] hover:opacity-80 transition-opacity"
            >
                <SendIcon size={18} />
            </button>
            <button
                onClick={onEdit}
                title="Edit"
                className="text-[#667085] hover:text-[var(--brand)] transition-colors"
            >
                <EditIcon size={20} />
            </button>
            <button
                onClick={onDelete}
                title="Delete"
                className="text-[#eb6f70] hover:opacity-80 transition-opacity"
            >
                <TrashIcon size={20} />
            </button>
        </div>
    );
}
