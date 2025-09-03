// app/(protected)/businesses/page.tsx

'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Building2, Mail, MapPin, Phone, Plus } from 'lucide-react';
import Link from 'next/link';

export default function BusinessesPage() {
  // TODO: Replace with actual data from API
  const businesses = [
    {
      id: '1',
      name: 'Acme Corporation',
      type: 'Corporation',
      address: 'Manila, Philippines',
      phone: '+63 2 1234 5678',
      email: 'contact@acme.com',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Tech Solutions LLC',
      type: 'LLC',
      address: 'Cebu City, Philippines',
      phone: '+63 32 9876 5432',
      email: 'info@techsolutions.com',
      status: 'Active',
    },
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Businesses</h1>
          <p className="text-muted-foreground mt-2">
            Manage your registered businesses and view their details.
          </p>
        </div>
        <Button asChild>
          <Link href="/business-registration">
            <Plus className="mr-2 h-4 w-4" />
            Register New Business
          </Link>
        </Button>
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
      ) : (
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
                      {business.type}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-muted-foreground">
                      {business.status}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{business.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{business.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>{business.email}</span>
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
      )}
    </div>
  );
}
