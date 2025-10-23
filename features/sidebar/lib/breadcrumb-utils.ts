// features/sidebar/lib/breadcrumb-utils.ts

import type { BreadcrumbItem } from './types';

interface DynamicBreadcrumbConfig {
  pattern: string;
  breadcrumbs: BreadcrumbItem[];
  getDynamicLabel?: (params: Record<string, string>) => string;
}

/**
 * Matches a pathname against a pattern and extracts dynamic parameters
 * @param pattern - Pattern like '/edit/:id' or '/users/:userId/posts/:postId'
 * @param pathname - Actual pathname like '/edit/123' or '/users/456/posts/789'
 * @returns Object with match status and extracted parameters
 */
function matchPattern(
  pattern: string,
  pathname: string
): {
  isMatch: boolean;
  params: Record<string, string>;
} {
  const patternSegments = pattern.split('/');
  const pathSegments = pathname.split('/');

  if (patternSegments.length !== pathSegments.length) {
    return { isMatch: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const patternSegment = patternSegments[i];
    const pathSegment = pathSegments[i];

    if (patternSegment.startsWith(':')) {
      // Dynamic segment - extract parameter name and value
      const paramName = patternSegment.slice(1);
      params[paramName] = pathSegment;
    } else if (patternSegment !== pathSegment) {
      // Static segment doesn't match
      return { isMatch: false, params: {} };
    }
  }

  return { isMatch: true, params };
}

/**
 * Finds the matching breadcrumb configuration for a given pathname
 * @param pathname - The current pathname
 * @param dynamicConfigs - Array of dynamic breadcrumb configurations
 * @returns Matching breadcrumb configuration or null
 */
export function findMatchingBreadcrumbConfig(
  pathname: string,
  dynamicConfigs: DynamicBreadcrumbConfig[]
): { breadcrumbs: BreadcrumbItem[]; params: Record<string, string> } | null {
  for (const config of dynamicConfigs) {
    const { isMatch, params } = matchPattern(config.pattern, pathname);
    if (isMatch) {
      // Generate dynamic breadcrumbs by replacing placeholders
      const breadcrumbs = config.breadcrumbs.map((crumb, index) => ({
        ...crumb,
        label:
          config.getDynamicLabel && index === config.breadcrumbs.length - 1
            ? config.getDynamicLabel(params)
            : crumb.label,
        href: crumb.href?.replace(
          /:(\w+)/g,
          (_, paramName) => params[paramName] || ''
        ),
      }));

      return { breadcrumbs, params };
    }
  }

  return null;
}

/**
 * Replaces dynamic parameters in a URL template
 * @param urlTemplate - URL template with parameters like '/edit/:id'
 * @param params - Parameters object like { id: '123' }
 * @returns Resolved URL like '/edit/123'
 */
export function resolveUrl(
  urlTemplate: string,
  params: Record<string, string>
): string {
  return urlTemplate.replace(
    /:(\w+)/g,
    (_, paramName) => params[paramName] || ''
  );
}
