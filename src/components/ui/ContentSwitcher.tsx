import React, { ReactNode } from 'react';

export interface TabOption {
    id: string;
    label: string;
}

export interface ContentSwitcherProps {
    tabs: TabOption[];
    activeTab: string;
    onChange: (tabId: string) => void;
    rightContent?: ReactNode; // Optional right side content (buttons)
    className?: string;       // Optional custom classes for outer container
}

const ContentSwitcher: React.FC<ContentSwitcherProps> = ({ tabs, activeTab, onChange, rightContent, className = '' }) => {
    return (
        <div className={`bg-[rgba(7,119,52,0.05)] content-stretch flex items-center justify-between relative w-full ${className}`}>
            <div className="content-stretch flex items-center relative shrink-0">
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => onChange(tab.id)}
                            className={`
                                content-stretch flex gap-[8px] items-center justify-center p-[16px] relative shrink-0 w-[250px]
                                outline-none transition-all duration-300 pointer-events-auto
                                ${isActive ? 'border-[var(--brand,#077734)] border-b-2 border-solid' : 'border-b-2 border-solid border-transparent hover:bg-black/5'}
                            `}
                        >
                            <span
                                className={`
                                    leading-[normal] relative shrink-0 text-[18px] whitespace-nowrap transition-colors duration-300
                                    ${isActive 
                                        ? "font-inter font-semibold text-[var(--brand,#077734)]" 
                                        : "font-inter font-normal text-[#36394a]"
                                    }
                                `}
                            >
                                {tab.label}
                            </span>
                        </button>
                    );
                })}
            </div>
            {rightContent && (
                <div className="content-stretch flex gap-[12px] items-center relative shrink-0 pr-[16px]">
                    {rightContent}
                </div>
            )}
        </div>
    );
};

export default ContentSwitcher;
