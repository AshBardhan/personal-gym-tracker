/**
 * Application configuration from environment variables
 * Provides typed access to Vite environment variables
 */

/**
 * Get environment variable with fallback
 */
const getEnvVar = (key: string, fallback?: string): string => {
  const value = import.meta.env[key];
  if (value === undefined && fallback === undefined) {
    console.warn(`Environment variable ${key} is not set`);
    return "";
  }
  return value || fallback || "";
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: getEnvVar("VITE_API_BASE_URL", "http://localhost:5000/api"),
} as const;

/**
 * User Configuration (for development/demo purposes)
 * In production, this would come from authentication context
 */
export const USER_CONFIG = {
  DEMO_USER_ID: getEnvVar("VITE_DEMO_USER_ID", "673092a6fd2a34e8e4b91234"),
} as const;

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_MSW: getEnvVar("VITE_ENABLE_MSW") === "true",
} as const;

/**
 * App Configuration
 * Centralized access to all app configuration
 */
export const config = {
  api: API_CONFIG,
  user: USER_CONFIG,
  features: FEATURE_FLAGS,
} as const;
