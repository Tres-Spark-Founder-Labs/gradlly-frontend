"use client";

import { AlertCircle, Camera, CheckCircle, Loader2, User } from "lucide-react";
import Image from "next/image";
import { useCallback, useMemo, useRef, useState } from "react";

const AVATAR_SIZES = {
  xs: {
    container: "w-6 h-6",
    text: "text-[10px]",
    icon: 10,
    badge: "w-3 h-3",
    badgeIcon: 8,
  },
  sm: {
    container: "w-8 h-8",
    text: "text-xs",
    icon: 14,
    badge: "w-3.5 h-3.5",
    badgeIcon: 10,
  },
  md: {
    container: "w-10 h-10",
    text: "text-sm",
    icon: 16,
    badge: "w-4 h-4",
    badgeIcon: 12,
  },
  lg: {
    container: "w-12 h-12",
    text: "text-base",
    icon: 18,
    badge: "w-5 h-5",
    badgeIcon: 14,
  },
  xl: {
    container: "w-16 h-16",
    text: "text-lg",
    icon: 22,
    badge: "w-6 h-6",
    badgeIcon: 16,
  },
  "2xl": {
    container: "w-20 h-20",
    text: "text-xl",
    icon: 26,
    badge: "w-7 h-7",
    badgeIcon: 18,
  },
  "3xl": {
    container: "w-28 h-28",
    text: "text-2xl",
    icon: 32,
    badge: "w-8 h-8",
    badgeIcon: 20,
  },
};

const SHAPE_CLASSES = { circle: "rounded-full", square: "rounded-xl" };
const MAX_FILE_SIZE = 1.5 * 1024 * 1024;

export function Avatar({
  src,
  alt = "User avatar",
  initials = "",
  size = "md",
  shape = "circle",
  onUpload,
  onError,
  className = "",
  loading = false,
  isProfileCompleted = false,
  showProfileStatus = false,
}) {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef(null);

  const sizeConfig = AVATAR_SIZES[size] ?? AVATAR_SIZES.md;
  const shapeClass = SHAPE_CLASSES[shape] ?? SHAPE_CLASSES.circle;
  const isUploadable = Boolean(onUpload);
  const isDataUrl = src?.startsWith("data:");
  const showImage = src && !imageError;
  const displayInitials = useMemo(
    () => (initials ? initials.slice(0, 2).toUpperCase() : ""),
    [initials],
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
    onError?.("Failed to load image");
  }, [onError]);

  const handleClick = useCallback(() => {
    if (isUploadable && !loading) fileInputRef.current?.click();
  }, [isUploadable, loading]);

  const handleFileChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > MAX_FILE_SIZE) {
        onError?.("Image must be less than 1.5 MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload?.(reader.result);
        setImageError(false);
      };
      reader.onerror = () => onError?.("Failed to read file");
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [onUpload, onError],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (isUploadable && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        handleClick();
      }
    },
    [isUploadable, handleClick],
  );

  const containerClass = [
    "relative overflow-hidden transition-all duration-300",
    sizeConfig.container,
    shapeClass,
    isUploadable && !loading ? "cursor-pointer" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const badgeClass = [
    "absolute -bottom-0.5 -right-0.5 flex items-center justify-center ring-2 ring-white transition-all duration-200",
    sizeConfig.badge,
    isProfileCompleted
      ? "bg-linear-to-br from-green-500 to-emerald-600"
      : "bg-linear-to-br from-red-500 to-rose-600",
    shape === "circle" ? "rounded-full" : "rounded-lg",
  ].join(" ");

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={containerClass}
        onClick={handleClick}
        onMouseEnter={() => isUploadable && setIsHovered(true)}
        onMouseLeave={() => isUploadable && setIsHovered(false)}
        onKeyDown={handleKeyDown}
        role={isUploadable ? "button" : undefined}
        aria-label={isUploadable ? "Upload avatar" : alt}
        tabIndex={isUploadable && !loading ? 0 : undefined}
      >
        {showImage ? (
          isDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={alt}
              className="h-full w-full object-cover"
              onError={handleImageError}
              draggable={false}
            />
          ) : (
            <Image
              src={src}
              alt={alt}
              fill
              sizes="128px"
              className="object-cover"
              onError={handleImageError}
              draggable={false}
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary-500 to-primary-700">
            {displayInitials ? (
              <span
                className={`select-none font-bold text-white ${sizeConfig.text}`}
              >
                {displayInitials}
              </span>
            ) : (
              <User size={sizeConfig.icon} className="text-white/80" />
            )}
          </div>
        )}

        {isUploadable && (
          <>
            <div
              className={[
                "absolute inset-0 flex items-center justify-center bg-black/55 transition-opacity duration-200",
                isHovered && !loading ? "opacity-100" : "opacity-0",
              ].join(" ")}
              aria-hidden
            >
              <Camera
                size={Math.round(sizeConfig.icon * 0.8)}
                className="text-white drop-shadow"
              />
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              aria-label="Upload avatar image"
              disabled={loading}
            />
          </>
        )}

        {loading && (
          <div
            className={`absolute inset-0 flex items-center justify-center bg-black/50 ${shapeClass}`}
          >
            <Loader2 size={20} className="animate-spin text-white" />
          </div>
        )}
      </div>

      {showProfileStatus && (
        <div
          className={badgeClass}
          aria-label={
            isProfileCompleted ? "Profile complete" : "Profile incomplete"
          }
          title={
            isProfileCompleted ? "Profile complete" : "Complete your profile"
          }
        >
          {isProfileCompleted ? (
            <CheckCircle size={sizeConfig.badgeIcon} className="text-white" />
          ) : (
            <AlertCircle
              size={sizeConfig.badgeIcon}
              className="animate-pulse text-white"
            />
          )}
        </div>
      )}
    </div>
  );
}
