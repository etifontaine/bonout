import React from "react";

export default function Card({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-lg"
      {...props}
    >
      {children}
    </div>
  );
}
