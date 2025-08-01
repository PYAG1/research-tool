"use client";

import { BoldIcon } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@renderer/components/ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { cn } from "@renderer/lib";
import { useToolbar } from "./toolbar-provider";
// import type { Extension } from "@tiptap/core";
// import type { StarterKitOptions } from "@tiptap/starter-kit";

// type StarterKitExtensions = Extension<StarterKitOptions>;

const BoldToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, onClick, children, ...props }, ref) => {
		const { editor } = useToolbar();
		return (
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="ghost"
						size="icon"
						className={cn(
							"h-8 w-8 p-0 sm:h-9 sm:w-9",
							editor?.isActive("bold") && "bg-accent",
							className,
						)}
						onClick={(e) => {
							editor?.chain().focus().toggleBold().run();
							onClick?.(e);
						}}
						disabled={!editor?.can().chain().focus().toggleBold().run()}
						ref={ref}
						{...props}
					>
						{children ?? <BoldIcon className="h-4 w-4" />}
					</Button>
				</TooltipTrigger>
				<TooltipContent>
					<span>Bold</span>
					<span className="ml-1 text-xs text-gray-11">(cmd + b)</span>
				</TooltipContent>
			</Tooltip>
		);
	},
);

BoldToolbar.displayName = "BoldToolbar";

export { BoldToolbar };
