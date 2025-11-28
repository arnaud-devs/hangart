"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "", ...props }: CardProps) => (
  <div 
    className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader = ({ children, className = "", ...props }: CardHeaderProps) => (
  <div 
    className={`flex flex-col space-y-1.5 p-6 ${className}`} 
    {...props}
  >
    {children}
  </div>
);

interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardTitle = ({ children, className = "", ...props }: CardTitleProps) => (
  <h3 
    className={`text-2xl font-semibold leading-none tracking-tight ${className}`} 
    {...props}
  >
    {children}
  </h3>
);

interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardDescription = ({ children, className = "", ...props }: CardDescriptionProps) => (
  <p 
    className={`text-sm text-gray-600 ${className}`} 
    {...props}
  >
    {children}
  </p>
);

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export const CardContent = ({ children, className = "", ...props }: CardContentProps) => (
  <div 
    className={`p-6 pt-0 ${className}`} 
    {...props}
  >
    {children}
  </div>
);