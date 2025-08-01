"use client";

import { WrapText } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@renderer/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib";
import { useToolbar } from "./toolbar-provider";

const HardBreakToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", className)}
						onClick={(e) => {
							editor?.chain().focus().setHardBreak().run();
							onClick?.(e);
						}}
						ref={ref}
						{...props}
					>
						{children ?? <WrapText className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Hard break</span>
				</TooltipContent>
			</Tooltip>
		);
	},
);

HardBreakToolbar.displayName = "HardBreakToolbar";

export { HardBreakToolbar };
