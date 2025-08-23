# Coding Standards & Guidelines

This document outlines the coding standards, conventions, and best practices for the Fairpoint Software platform. Following these guidelines ensures consistency, maintainability, and team collaboration.

## 📏 General Principles

### Code Philosophy

- **Clarity over cleverness** - Write code that tells a story
- **Consistency over personal preference** - Follow established patterns
- **Simplicity over complexity** - Start simple, add complexity when needed
- **Explicit over implicit** - Make intentions clear

### The Three Rules

1. **Make it work** - Functionality first
2. **Make it right** - Follow patterns and standards
3. **Make it fast** - Optimize when needed (not before)

## 🏗️ Architectural Standards

### Feature-Based Organization

#### ✅ DO: Organize by Feature

```
src/features/business-registration/
├── components/
├── hooks/
├── lib/
└── index.ts
```

#### ❌ DON'T: Organize by Type

```
src/
├── components/
├── hooks/
├── utils/
└── types/
```

### Import/Export Rules

#### ✅ DO: Use Path Aliases

```typescript
import { Button } from '@/components/ui/button';
import { createBusiness } from '@/server/business/actions';
import { useBusinessRegistration } from '@/features/business-registration';
```

#### ❌ DON'T: Use Relative Imports for Cross-Module

```typescript
import { Button } from '../../../components/ui/button';
import { createBusiness } from '../../server/business/actions';
```

#### Feature Export Pattern

```typescript
// src/features/business-registration/index.ts
export { BusinessRegistrationWizard } from './components/business-registration-wizard';
export { useBusinessRegistration } from './hooks/use-business-registration';
export type { BusinessRegistrationData } from './lib/types';
```

### Boundary Violations - What NOT to Do

#### ❌ NEVER: Cross-Feature Imports

```typescript
// In src/features/invoicing/
import { useBusinessRegistration } from '@/features/business-registration'; // ❌
```

#### ✅ DO: Use Shared Layer

```typescript
// Move shared logic to src/hooks/ or src/lib/
import { useBusinessData } from '@/hooks/use-business-data'; // ✅
```

## 📝 File Naming Conventions

### Component Files

- **React Components**: `kebab-case.tsx`
- **Hook Files**: `use-kebab-case.ts`
- **Utility Files**: `kebab-case.ts`
- **Type Files**: `types.ts` or `kebab-case.types.ts`

### Examples

```
✅ business-registration-wizard.tsx
✅ use-business-registration.ts
✅ business-registration-schema.ts
✅ api-client.ts

❌ BusinessRegistrationWizard.tsx
❌ useBusinessRegistration.ts
❌ BusinessRegistrationSchema.ts
❌ apiClient.ts
```

### Directory Names

- **Features**: `kebab-case`
- **Components**: `kebab-case`
- **Pages**: Follow Next.js conventions

## ⚛️ React Component Standards

### Component Structure

```typescript
'use client'; // Only when needed

import * as React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ComponentProps } from './types';

interface ComponentNameProps extends React.ComponentProps<'div'> {
  variant?: 'default' | 'outlined';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function ComponentName({
  variant = 'default',
  size = 'md',
  className,
  children,
  ...props
}: ComponentNameProps) {
  return (
    <div
      className={cn(
        'base-styles',
        variant === 'outlined' && 'outlined-styles',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
```

### Component Patterns

#### ✅ DO: Compound Components

```typescript
export function Wizard({ children }: { children: React.ReactNode }) {
  return <div className="wizard">{children}</div>;
}

Wizard.Step = function WizardStep({ children }: { children: React.ReactNode }) {
  return <div className="wizard-step">{children}</div>;
};

Wizard.Navigation = function WizardNavigation() {
  return <div className="wizard-nav">...</div>;
};
```

#### ✅ DO: Extract Custom Hooks

```typescript
function useWizardNavigation(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () =>
    setCurrentStep(prev => (prev < totalSteps - 1 ? prev + 1 : prev));

  const prevStep = () => setCurrentStep(prev => (prev > 0 ? prev - 1 : prev));

  return { currentStep, nextStep, prevStep };
}
```

#### ❌ DON'T: Inline Complex Logic

```typescript
function WizardComponent() {
  // ❌ Too much logic in component
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ... 50 more lines of logic
}
```

## 🎨 Styling Standards

### Tailwind CSS Conventions

#### ✅ DO: Use Utility Classes

```typescript
<div className="flex items-center justify-between p-4 bg-background border border-border rounded-lg">
```

#### ✅ DO: Use CSS Variables for Theming

```typescript
<div className="bg-primary text-primary-foreground">
```

#### ✅ DO: Use cn() for Conditional Classes

```typescript
<Button
  className={cn(
    'base-button-styles',
    variant === 'destructive' && 'destructive-styles',
    size === 'lg' && 'large-styles',
    className
  )}
/>
```

#### ❌ DON'T: Use Arbitrary Values Unless Necessary

```typescript
<div className="mt-[23px] w-[347px]"> {/* ❌ Use standard spacing */}
<div className="mt-6 w-80"> {/* ✅ Better */}
```

## 🔧 TypeScript Standards

### Type Definitions

```typescript
// ✅ DO: Use interfaces for object shapes
interface UserData {
  id: string;
  name: string;
  email: string;
}

// ✅ DO: Use types for unions and computed types
type Status = 'pending' | 'approved' | 'rejected';
type UserWithStatus = UserData & { status: Status };

// ✅ DO: Use generic constraints
interface ApiResponse<T extends Record<string, unknown>> {
  data: T;
  status: number;
  message: string;
}
```

### Component Props

```typescript
// ✅ DO: Extend HTML element props
interface ButtonProps extends React.ComponentProps<'button'> {
  variant?: 'default' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
}

// ✅ DO: Use discriminated unions for variants
type AlertProps =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string; retry?: () => void };
```

### Utility Types

```typescript
// ✅ DO: Use utility types
type PartialUser = Partial<UserData>;
type UserEmail = Pick<UserData, 'email'>;
type CreateUserData = Omit<UserData, 'id'>;
```

## 🪝 Custom Hooks Standards

### Hook Structure

```typescript
export function useFeatureName(config?: FeatureConfig) {
  // State
  const [state, setState] = useState(initialState);

  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);

  // Handlers
  const handleAction = useCallback(() => {
    // Handler logic
  }, [dependencies]);

  // Return stable object
  return useMemo(
    () => ({
      state,
      actions: {
        handleAction,
      },
      utils: {
        isLoading: state.status === 'loading',
      },
    }),
    [state, handleAction]
  );
}
```

### TanStack Query Patterns

```typescript
// ✅ DO: Use consistent query key patterns
export function useBusinessData(businessId: string) {
  return useQuery({
    queryKey: ['business', businessId],
    queryFn: () => getBusinessById(businessId),
    enabled: !!businessId,
  });
}

// ✅ DO: Use mutations with proper error handling
export function useUpdateBusiness() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateBusiness,
    onSuccess: data => {
      queryClient.setQueryData(['business', data.id], data);
      queryClient.invalidateQueries({ queryKey: ['businesses'] });
    },
    onError: error => {
      console.error('Failed to update business:', error);
    },
  });
}
```

## 🗄️ Server-Side Standards

### Server Actions

```typescript
'use server';

import { auth } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { db } from '@/drizzle/db';
import { businessSchema } from './validation';

export async function createBusiness(data: unknown) {
  try {
    // 1. Authentication
    const { userId } = await auth();
    if (!userId) {
      throw new Error('Unauthorized');
    }

    // 2. Validation
    const validatedData = businessSchema.parse(data);

    // 3. Business logic
    const business = await db
      .insert(businesses)
      .values({
        ...validatedData,
        userId,
      })
      .returning();

    // 4. Cache invalidation
    revalidatePath('/dashboard');

    // 5. Return success
    return { success: true, data: business[0] };
  } catch (error) {
    // 6. Error handling
    console.error('Business creation failed:', error);
    throw new Error(error instanceof Error ? error.message : 'Unknown error');
  }
}
```

### Validation Schemas

```typescript
import { z } from 'zod';

// ✅ DO: Create reusable schemas
export const businessBaseSchema = z.object({
  name: z.string().min(1, 'Business name is required').max(100),
  type: z.enum(['corporation', 'llc', 'partnership', 'sole_proprietorship']),
});

export const createBusinessSchema = businessBaseSchema.extend({
  taxId: z.string().regex(/^\d{2}-\d{7}$/, 'Invalid tax ID format'),
});

export const updateBusinessSchema = businessBaseSchema.partial();

// ✅ DO: Export types
export type BusinessData = z.infer<typeof businessBaseSchema>;
export type CreateBusinessData = z.infer<typeof createBusinessSchema>;
```

## 📋 Form Handling Standards

### React Hook Form Pattern

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export function BusinessForm() {
  const form = useForm<CreateBusinessData>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: '',
      type: 'llc',
    },
  });

  const onSubmit = form.handleSubmit(async (data) => {
    try {
      await createBusiness(data);
      // Handle success
    } catch (error) {
      // Handle error
      form.setError('root', {
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return (
    <form onSubmit={onSubmit}>
      {/* Form fields */}
    </form>
  );
}
```

## 🧪 Testing Conventions

### File Naming

```
src/components/button.tsx
src/components/button.test.tsx
src/components/button.stories.tsx
```

### Test Structure

```typescript
import { render, screen } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('applies variant styles correctly', () => {
    render(<Button variant="destructive">Delete</Button>);
    expect(screen.getByRole('button')).toHaveClass('destructive-styles');
  });
});
```

## 📝 Comments and Documentation

### When to Comment

```typescript
// ✅ DO: Explain why, not what
const delay = 1000; // Debounce API calls to prevent rate limiting

// ✅ DO: Document complex business logic
// Calculate tax based on business type and state regulations
// Corporation: 21% federal + state rate
// LLC: Pass-through to owner's personal tax rate
function calculateTax(business: BusinessData): TaxCalculation {
  // Implementation
}

// ❌ DON'T: State the obvious
const user = getUser(); // Get the user
```

### JSDoc for Public APIs

```typescript
/**
 * Creates a new business registration
 * @param data - Business registration data
 * @returns Promise resolving to created business
 * @throws Error when validation fails or user is unauthorized
 */
export async function createBusiness(
  data: CreateBusinessData
): Promise<Business> {
  // Implementation
}
```

## 🚨 Error Handling Standards

### Frontend Error Boundaries

```typescript
export function FeatureErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallback={({ error, resetError }) => (
        <div className="error-container">
          <h2>Something went wrong</h2>
          <button onClick={resetError}>Try again</button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
}
```

### Backend Error Responses

```typescript
// ✅ DO: Consistent error structure
export interface ApiError {
  message: string;
  code: string;
  field?: string; // For validation errors
}

// ✅ DO: Proper error throwing
if (!userId) {
  throw new Error('AUTH_REQUIRED:User authentication required');
}
```

## 🎯 Performance Guidelines

### Bundle Size

- Keep feature bundles under 100KB
- Use dynamic imports for large components
- Avoid importing entire libraries

### React Performance

```typescript
// ✅ DO: Use memo for expensive components
export const ExpensiveComponent = React.memo(
  function ExpensiveComponent(props) {
    // Component logic
  }
);

// ✅ DO: Use useCallback for event handlers
const handleSubmit = useCallback(
  (data: FormData) => {
    // Handler logic
  },
  [dependency]
);

// ✅ DO: Use useMemo for expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

## 🔍 Code Review Checklist

### Before Submitting PR

- [ ] Code follows architectural boundaries
- [ ] ESLint and Prettier pass
- [ ] TypeScript compiles without errors
- [ ] Component props are properly typed
- [ ] Error handling is implemented
- [ ] Loading states are handled
- [ ] Responsive design is considered

### Review Focus Points

- [ ] Architecture compliance
- [ ] Code clarity and readability
- [ ] Performance implications
- [ ] Security considerations
- [ ] Error handling completeness
- [ ] Type safety
- [ ] Test coverage

---

**Remember**: These standards exist to help us build better software together. When in doubt, ask the team and prioritize consistency over personal preference.
