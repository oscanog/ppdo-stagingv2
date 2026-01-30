import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Square, Check } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

interface MarginDropdownProps {
    marginGuidesVisible: boolean;
    onToggleMarginGuides: () => void;
    currentMargin: number; // Current uniform margin in inches. We'll use 'left' as the reference if checking uniformity is hard.
    onMarginChange: (value: number) => void;
    className?: string; // To allow custom styling for the trigger button
}

const PRESET_MARGINS = [0.3, 0.5, 0.75, 1.0, 1.5, 2.0];

export const MarginDropdown = ({
    marginGuidesVisible,
    onToggleMarginGuides,
    currentMargin,
    onMarginChange,
    className,
}: MarginDropdownProps) => {
    const [customValue, setCustomValue] = useState<string>(currentMargin.toString());
    const [error, setError] = useState<string | null>(null);

    // Sync custom input with current margin when it changes externally
    useEffect(() => {
        setCustomValue(currentMargin.toString());
        setError(null);
    }, [currentMargin]);

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = e.target.value;
        setCustomValue(newVal);

        const numVal = parseFloat(newVal);
        if (!isNaN(numVal)) {
            if (numVal < 0.3 || numVal > 2.0) {
                setError('0.3" - 2.0"');
            } else {
                setError(null);
            }
        } else {
            setError(null); // Just don't show error while typing incomplete number
        }
    };

    const handleCustomSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numVal = parseFloat(customValue);
        if (!isNaN(numVal) && numVal >= 0.3 && numVal <= 2.0) {
            onMarginChange(numVal);
        } else {
            // Reset to valid if invalid on submit
            setCustomValue(currentMargin.toString());
            setError(null);
        }
    };

    const handleCustomBlur = () => {
        const numVal = parseFloat(customValue);
        if (!isNaN(numVal) && numVal >= 0.3 && numVal <= 2.0) {
            onMarginChange(numVal);
        } else {
            setCustomValue(currentMargin.toString());
            setError(null);
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={className || `gap-2 ${marginGuidesVisible ? 'bg-zinc-100 dark:bg-zinc-800' : ''}`}
                >
                    <Square className="w-4 h-4" />
                    <span className="hidden lg:inline">Margin</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={(e) => {
                    e.preventDefault(); // Keep dropdown open? No, toggle closes it usually. Let's see.
                    onToggleMarginGuides();
                }}>
                    <div className="flex items-center gap-2 w-full">
                        <Square className="w-4 h-4" />
                        <span>{marginGuidesVisible ? 'Hide Guides' : 'Show Guides'}</span>
                        {marginGuidesVisible && <Check className="w-3 h-3 ml-auto opacity-50" />}
                    </div>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Presets (Inches)</DropdownMenuLabel>

                {PRESET_MARGINS.map((size) => (
                    <DropdownMenuItem
                        key={size}
                        onClick={() => onMarginChange(size)}
                        className="justify-between"
                    >
                        <span>{size}"</span>
                        {Math.abs(currentMargin - size) < 0.001 && (
                            <Check className="w-4 h-4 text-primary" />
                        )}
                    </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
                <div className="p-2">
                    <label className="text-xs font-medium mb-1.5 block text-muted-foreground">Custom (0.3" - 2.0")</label>
                    <form onSubmit={handleCustomSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                            <Input
                                type="number"
                                step="0.1"
                                min="0.3"
                                max="2.0"
                                value={customValue}
                                onChange={handleCustomChange}
                                onBlur={handleCustomBlur}
                                className={`h-8 text-xs ${error ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                                placeholder='0.5"'
                            />
                        </div>
                        <Button type="submit" size="sm" variant="secondary" className="h-8 px-3 text-xs">
                            Set
                        </Button>
                    </form>
                    {error && <span className="text-[10px] text-red-500 mt-1 block">{error}</span>}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
