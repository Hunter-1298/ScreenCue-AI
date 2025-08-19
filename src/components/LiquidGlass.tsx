"use client";

import type React from "react";
import { useState, useRef, useCallback, type ReactNode } from "react";

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  variant?: "button" | "card" | "panel" | "floating";
  intensity?: "subtle" | "medium" | "strong";
  rippleEffect?: boolean;
  flowOnHover?: boolean;
  stretchOnDrag?: boolean;
  onClick?: () => void;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function LiquidGlass({
  children,
  className = "",
  style,
  variant = "card",
  intensity = "medium",
  rippleEffect = true,
  stretchOnDrag = true,
  onClick,
  onDragStart,
  onDragEnd,
}: LiquidGlassProps) {
  const [isJiggling, setIsJiggling] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [wobbleOffset, setWobbleOffset] = useState({ x: 0, y: 0 });
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);
  const elementRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const rippleCounter = useRef(0);

  const getVariantClasses = () => {
    const baseClasses = "liquid-glass";

    switch (variant) {
      case "button":
        return `${baseClasses} liquid-button`;
      case "card":
        return `${baseClasses} liquid-card p-6`;
      case "panel":
        return `${baseClasses} liquid-panel`;
      case "floating":
        return `${baseClasses} liquid-floating`;
      default:
        return baseClasses;
    }
  };

  const getIntensityClasses = () => {
    switch (intensity) {
      case "subtle":
        return "liquid-subtle";
      case "strong":
        return "liquid-strong";
      default:
        return "liquid-medium";
    }
  };

  const createRipple = useCallback(
    (e: React.MouseEvent) => {
      if (!rippleEffect || !elementRef.current) return;

      const rect = elementRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newRipple = {
        id: rippleCounter.current++,
        x,
        y,
      };

      setRipples((prev) => [...prev, newRipple]);

      setTimeout(() => {
        setRipples((prev) =>
          prev.filter((ripple) => ripple.id !== newRipple.id),
        );
      }, 600);
    },
    [rippleEffect],
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (stretchOnDrag) {
        setIsDragging(true);
        dragStartPos.current = { x: e.clientX, y: e.clientY };
        onDragStart?.();
      } else if (variant === "button") {
        setIsPressed(true);
      }

      createRipple(e);
    },
    [stretchOnDrag, onDragStart, createRipple, variant],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect();
        setCursorPos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }

      if (!isDragging) return;

      const deltaX = e.clientX - dragStartPos.current.x;
      const deltaY = e.clientY - dragStartPos.current.y;

      setDragOffset({ x: deltaX * 0.1, y: deltaY * 0.1 });
    },
    [isDragging],
  );

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);

      const currentOffset = { ...dragOffset };
      setWobbleOffset(currentOffset);

      setDragOffset({ x: 0, y: 0 });
      onDragEnd?.();

      setIsJiggling(true);
      setTimeout(() => {
        setIsJiggling(false);
        setWobbleOffset({ x: 0, y: 0 });
      }, 1800);
    } else if (variant === "button" && isPressed) {
      setIsPressed(false);
      setWobbleOffset({ x: 0, y: 0 });
      setIsJiggling(true);
      setTimeout(() => setIsJiggling(false), 1800);
    }
  }, [isDragging, dragOffset, onDragEnd, variant, isPressed]);

  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      createRipple(e);
      onClick?.();
    },
    [onClick, createRipple],
  );

  const transformStyle = isJiggling
    ? ({
        "--wobble-start-x": `${wobbleOffset.x}px`,
        "--wobble-start-y": `${wobbleOffset.y}px`,
      } as React.CSSProperties)
    : {
        transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) ${isDragging ? "scale(1.02)" : ""}`,
        transition: isDragging
          ? "none"
          : "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)",
      };

  return (
    <div
      ref={elementRef}
      className={`
        ${getVariantClasses()}
        ${getIntensityClasses()}
        ${isJiggling && variant === "button" ? "liquid-wobble-active" : ""}
        ${isPressed && variant === "button" ? "liquid-pressed" : ""}
        ${className}
      `}
      style={{ ...transformStyle, ...style }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => {
        setIsHovering(false);
        setIsPressed(false);
        handleMouseUp();
      }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      {isHovering && (
        <div
          className="liquid-hover-effect"
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
          }}
        />
      )}

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="liquid-ripple-effect"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      <div className="liquid-content">{children}</div>
    </div>
  );
}
