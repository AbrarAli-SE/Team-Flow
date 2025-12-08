"use client";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface ResponseProps {
  children: string;
  partialMarkdown?: boolean;
  className?: string;
}

export function Response({
  children,
  partialMarkdown = false,
  className,
}: ResponseProps) {
  return (
    <div className={cn("ai-response-prose", className)}>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          pre: ({ node, ...props }) => (
            <pre {...props} className="overflow-x-auto" />
          ),
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            return match ? (
              <code {...props} className={className}>
                {children}
              </code>
            ) : (
              <code {...props} className={className}>
                {children}
              </code>
            );
          },
        }}
      >
        {children}
      </Markdown>
    </div>
  );
}
