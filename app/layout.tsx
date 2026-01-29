
import React from 'react';

// @fix: Making children optional to resolve the TypeScript error in index.tsx.
// Sometimes the TS compiler/JSX transpiler fails to correctly associate children 
// in nested JSX structures, leading to "Property 'children' is missing" errors.
export default function RootLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen antialiased selection:bg-cyan-500/30">
      {children}
    </div>
  );
}
