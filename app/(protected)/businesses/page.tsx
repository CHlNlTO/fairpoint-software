// app/(protected)/businesses/page.tsx

'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useBusinesses } from '@/hooks/use-businesses';
import type { Business } from '@/lib/types';
import {
  AlertCircle,
  Building2,
  Grid3X3,
  List,
  Mail,
  MapPin,
  Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

type ViewMode = 'cards' | 'table';

export default function BusinessesPage() {
  const { data: businesses = [], isLoading, error, refetch } = useBusinesses();
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  // Helper function to format business address
  const formatBusinessAddress = (business: Business): string => {
    const parts: string[] = [];

    if (business.address.streetAddress) {
      parts.push(business.address.streetAddress);
    }

    if (business.address.buildingName) {
      parts.push(business.address.buildingName);
    }

    if (business.address.unitNumber) {
      parts.push(`Unit ${business.address.unitNumber}`);
    }

    // For now, just show "Philippines" as we don't have PSGC lookup
    // In a real implementation, you'd look up the location names from PSGC codes
    parts.push('Philippines');

    return parts.join(', ') || 'Address not available';
  };

  // Helper function to format business types
  const formatBusinessTypes = (types: string[]): string => {
    return types
      .map(
        type => type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')
      )
      .join(', ');
  };

  // Helper function to format business structure for display
  const formatBusinessStructure = (structure: string): string => {
    return structure
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-48" />
          </div>
        </div>

        {viewMode === 'cards' ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="pt-3 border-t">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          // <Card>
          //   <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Business Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>TIN</TableHead>
                <TableHead>Structure</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          //   </CardContent>
          // </Card>
        )}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Businesses</h1>
            <p className="text-muted-foreground mt-2">
              Manage your registered businesses and view their details.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ToggleGroup
              type="single"
              value={viewMode}
              onValueChange={value => {
                if (value) setViewMode(value as ViewMode);
              }}
              variant="outline"
            >
              <ToggleGroupItem value="cards" aria-label="Card view">
                <Grid3X3 className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="table" aria-label="Table view">
                <List className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
            <Button asChild>
              <Link href="/business-registration">
                <Plus className="mr-2 h-4 w-4" />
                Register New Business
              </Link>
            </Button>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load businesses.{' '}
            {error instanceof Error
              ? error.message
              : 'An unexpected error occurred.'}
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              className="ml-2"
            >
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Businesses</h1>
          <p className="text-muted-foreground mt-2">
            Manage your registered businesses and view their details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ToggleGroup
            type="single"
            value={viewMode}
            onValueChange={value => {
              if (value) setViewMode(value as ViewMode);
            }}
            variant="outline"
          >
            <ToggleGroupItem value="cards" aria-label="Card view">
              <Grid3X3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
          <Button asChild>
            <Link href="/business-registration">
              <Plus className="mr-2 h-4 w-4" />
              Register New Business
            </Link>
          </Button>
        </div>
      </div>

      {businesses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No businesses registered
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by registering your first business to manage its tax
              and accounting needs.
            </p>
            <Button asChild>
              <Link href="/business-registration">
                <Plus className="mr-2 h-4 w-4" />
                Register Business
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {businesses.map(business => (
            <Card
              key={business.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{business.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {formatBusinessTypes(business.types)}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        business.status === 'Active'
                          ? 'bg-green-500'
                          : 'bg-gray-400'
                      }`}
                    ></div>
                    <span className="text-xs text-muted-foreground">
                      {business.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">
                    {formatBusinessAddress(business)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{business.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span className="truncate">
                    TIN: {business.tin} • {business.structure}
                  </span>
                </div>
                <div className="pt-3 border-t">
                  <Button variant="outline" size="sm" className="w-full">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-2 px-2">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Business Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>TIN</TableHead>
                  <TableHead>Structure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {businesses.map(business => (
                  <TableRow key={business.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{business.name}</div>
                        {/* <div className="text-sm text-muted-foreground">
                          {formatBusinessTypes(business.types)}
                        </div> */}
                      </div>
                    </TableCell>
                    <TableCell>{formatBusinessTypes(business.types)}</TableCell>
                    <TableCell>{business.email}</TableCell>
                    <TableCell>{business.tin}</TableCell>
                    <TableCell>
                      {formatBusinessStructure(business.structure)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            business.status === 'Active'
                              ? 'bg-green-500'
                              : 'bg-gray-400'
                          }`}
                        ></div>
                        <span className="text-sm">{business.status}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
