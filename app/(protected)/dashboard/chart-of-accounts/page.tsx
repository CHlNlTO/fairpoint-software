// app/(protected)/dashboard/chart-of-accounts/page.tsx
'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { createClient } from '@/lib/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';

interface AccountClass {
  id: string;
  code: number;
  name: string;
  normal_balance: string;
  is_active: boolean;
  description: string | null;
  hint: string | null;
  created_at: string;
}

interface AccountSubclass {
  id: string;
  account_class_id: string;
  code: number;
  name: string;
  is_active: boolean;
  description: string | null;
  hint: string | null;
  created_at: string;
  account_classes: {
    name: string;
    code: number;
  };
}

interface AccountType {
  id: string;
  account_subclass_id: string;
  user_id: string | null;
  business_registration_id: string | null;
  name: string;
  is_active: boolean;
  is_system_defined: boolean;
  description: string | null;
  hint: string | null;
  created_at: string;
  code: number;
  account_subclasses: {
    name: string;
    code: number;
  };
}

interface AccountSubtype {
  id: string;
  account_type_id: string;
  user_id: string | null;
  business_registration_id: string | null;
  name: string;
  is_active: boolean;
  is_system_defined: boolean;
  description: string | null;
  hint: string | null;
  created_at: string;
  code: number;
  account_types: {
    name: string;
    code: number;
  };
}

interface CoaTemplateItem {
  id: string;
  template_id: string;
  account_code: string;
  account_name: string;
  account_subtype_id: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  account_subtypes: {
    name: string;
    account_types: {
      name: string;
      account_subclasses: {
        name: string;
        account_classes: {
          name: string;
          normal_balance: string;
        };
      };
    };
  };
}

interface CoaTemplateRule {
  id: string;
  coa_template_id: string;
  tax_type: string | null;
  business_structure: string | null;
  industry_type: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  coa_templates: {
    template_name: string;
  };
}

interface BusinessChartOfAccounts {
  id: string;
  business_registration_id: string;
  account_code: string;
  account_name: string;
  account_subtype_id: string;
  is_active: boolean;
  is_custom: boolean;
  source_template_id: string | null;
  source_template_item_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  business_registrations: {
    business_name: string;
  };
  account_subtypes: {
    name: string;
  };
  coa_templates: {
    template_name: string;
  } | null;
}

export default function ChartOfAccountsPage() {
  const supabase = createClient();

  const {
    data: accountClasses,
    isLoading: loadingClasses,
    error: errorClasses,
  } = useQuery({
    queryKey: ['account-classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_classes')
        .select('*')
        .order('code', { ascending: true });
      if (error) throw error;
      return data as AccountClass[];
    },
  });

  const {
    data: accountSubclasses,
    isLoading: loadingSubclasses,
    error: errorSubclasses,
  } = useQuery({
    queryKey: ['account-subclasses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_subclasses')
        .select('*, account_classes(name, code)')
        .order('code', { ascending: true });
      if (error) throw error;
      return data as AccountSubclass[];
    },
  });

  const {
    data: accountTypes,
    isLoading: loadingTypes,
    error: errorTypes,
  } = useQuery({
    queryKey: ['account-types'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_types')
        .select('*, account_subclasses(name, code)')
        .order('code', { ascending: true });
      if (error) throw error;
      return data as AccountType[];
    },
  });

  const {
    data: accountSubtypes,
    isLoading: loadingSubtypes,
    error: errorSubtypes,
  } = useQuery({
    queryKey: ['account-subtypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_subtypes')
        .select('*, account_types(name, code)')
        .order('code', { ascending: true });
      if (error) throw error;
      return data as AccountSubtype[];
    },
  });

  const {
    data: coaTemplateItems,
    isLoading: loadingTemplateItems,
    error: errorTemplateItems,
  } = useQuery({
    queryKey: ['coa-template-items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coa_template_items')
        .select(
          `
          *,
          account_subtypes(
            name,
            account_types(
              name,
              account_subclasses(
                name,
                account_classes(
                  name,
                  normal_balance
                )
              )
            )
          )
        `
        )
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data as CoaTemplateItem[];
    },
  });

  const {
    data: coaTemplateRules,
    isLoading: loadingTemplateRules,
    error: errorTemplateRules,
  } = useQuery({
    queryKey: ['coa-template-rules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coa_template_rules')
        .select('*, coa_templates(template_name)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as CoaTemplateRule[];
    },
  });

  const {
    data: businessChartOfAccounts,
    isLoading: loadingBusinessCoa,
    error: errorBusinessCoa,
  } = useQuery({
    queryKey: ['business-chart-of-accounts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_chart_of_accounts')
        .select(
          `
          *,
          business_registrations(business_name),
          account_subtypes(name),
          coa_templates(template_name)
        `
        )
        .order('account_code', { ascending: true });
      if (error) throw error;
      return data as BusinessChartOfAccounts[];
    },
  });

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6 lg:p-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-4xl">
          Chart of Accounts
        </h1>
        <p className="text-sm text-muted-foreground md:text-base">
          View and manage chart of accounts structure and templates
        </p>
      </div>

      <Tabs defaultValue="classes" className="w-full space-y-4">
        <ScrollArea className="w-full">
          <TabsList className="inline-flex h-auto flex-wrap gap-1 bg-muted p-1">
            <TabsTrigger value="classes" className="text-xs md:text-sm">
              Classes
            </TabsTrigger>
            <TabsTrigger value="subclasses" className="text-xs md:text-sm">
              Subclasses
            </TabsTrigger>
            <TabsTrigger value="types" className="text-xs md:text-sm">
              Types
            </TabsTrigger>
            <TabsTrigger value="subtypes" className="text-xs md:text-sm">
              Subtypes
            </TabsTrigger>
            <TabsTrigger value="template-items" className="text-xs md:text-sm">
              Template Items
            </TabsTrigger>
            <TabsTrigger value="template-rules" className="text-xs md:text-sm">
              Template Rules
            </TabsTrigger>
            <TabsTrigger value="business-coa" className="text-xs md:text-sm">
              Business COA
            </TabsTrigger>
          </TabsList>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Classes</CardTitle>
              <CardDescription>
                Top-level account classifications ({accountClasses?.length || 0}{' '}
                total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorClasses && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorClasses instanceof Error
                      ? errorClasses.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingClasses ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-28">Balance</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Description
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountClasses?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">
                              {item.code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.normal_balance === 'debit'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {item.normal_balance}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-xs text-muted-foreground">
                                {item.description || '-'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!accountClasses?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subclasses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Subclasses</CardTitle>
              <CardDescription>
                Secondary level account classifications (
                {accountSubclasses?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorSubclasses && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorSubclasses instanceof Error
                      ? errorSubclasses.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingSubclasses ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Account Class
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Description
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountSubclasses?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">
                              {item.code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">
                                {item.account_classes?.code}.{' '}
                                {item.account_classes?.name}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-xs text-muted-foreground">
                                {item.description || '-'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!accountSubclasses?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Types</CardTitle>
              <CardDescription>
                Third level account classifications ({accountTypes?.length || 0}{' '}
                total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorTypes && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorTypes instanceof Error
                      ? errorTypes.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingTypes ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[700px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="w-28">System</TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Account Subclass
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountTypes?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">
                              {item.code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.is_system_defined
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {item.is_system_defined ? 'System' : 'Custom'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">
                                {item.account_subclasses?.code}.{' '}
                                {item.account_subclasses?.name}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!accountTypes?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subtypes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Subtypes</CardTitle>
              <CardDescription>
                Fourth level account classifications (
                {accountSubtypes?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorSubtypes && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorSubtypes instanceof Error
                      ? errorSubtypes.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingSubtypes ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[700px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Code</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="w-28">System</TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Account Type
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {accountSubtypes?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">
                              {item.code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.name}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.is_system_defined
                                    ? 'secondary'
                                    : 'outline'
                                }
                              >
                                {item.is_system_defined ? 'System' : 'Custom'}
                              </Badge>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">
                                {item.account_types?.code}.{' '}
                                {item.account_types?.name}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!accountSubtypes?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template-items" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>COA Template Items</CardTitle>
              <CardDescription>
                Predefined chart of accounts template entries (
                {coaTemplateItems?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorTemplateItems && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorTemplateItems instanceof Error
                      ? errorTemplateItems.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingTemplateItems ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[1200px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Code</TableHead>
                          <TableHead>Account Name</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Class
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Subclass
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Type
                          </TableHead>
                          <TableHead className="hidden xl:table-cell">
                            Subtype
                          </TableHead>
                          <TableHead className="w-28">Balance</TableHead>
                          <TableHead className="w-24">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coaTemplateItems?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">
                              {item.account_code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.account_name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">
                                {
                                  item.account_subtypes?.account_types
                                    ?.account_subclasses?.account_classes?.name
                                }
                              </span>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">
                                {
                                  item.account_subtypes?.account_types
                                    ?.account_subclasses?.name
                                }
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">
                                {item.account_subtypes?.account_types?.name}
                              </span>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <span className="text-sm">
                                {item.account_subtypes?.name}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.account_subtypes?.account_types
                                    ?.account_subclasses?.account_classes
                                    ?.normal_balance === 'debit'
                                    ? 'default'
                                    : 'secondary'
                                }
                              >
                                {
                                  item.account_subtypes?.account_types
                                    ?.account_subclasses?.account_classes
                                    ?.normal_balance
                                }
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!coaTemplateItems?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={8}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template-rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>COA Template Rules</CardTitle>
              <CardDescription>
                Rules for applying chart of accounts templates (
                {coaTemplateRules?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorTemplateRules && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorTemplateRules instanceof Error
                      ? errorTemplateRules.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingTemplateRules ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[700px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Template Name</TableHead>
                          <TableHead className="w-28">Tax Type</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Structure
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Industry
                          </TableHead>
                          <TableHead className="w-24">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {coaTemplateRules?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <span className="text-sm font-medium">
                                {item.coa_templates?.template_name}
                              </span>
                            </TableCell>
                            <TableCell>
                              {item.tax_type ? (
                                <Badge variant="secondary">
                                  {item.tax_type}
                                </Badge>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  -
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">
                                {item.business_structure || '-'}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">
                                {item.industry_type || '-'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!coaTemplateRules?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business-coa" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Business Chart of Accounts</CardTitle>
              <CardDescription>
                Business-specific chart of accounts instances (
                {businessChartOfAccounts?.length || 0} total)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errorBusinessCoa && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {errorBusinessCoa instanceof Error
                      ? errorBusinessCoa.message
                      : 'Failed to load data'}
                  </AlertDescription>
                </Alert>
              )}
              {loadingBusinessCoa ? (
                <LoadingSkeleton />
              ) : (
                <ScrollArea className="w-full">
                  <div className="min-w-[900px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-24">Code</TableHead>
                          <TableHead>Account Name</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Business
                          </TableHead>
                          <TableHead className="hidden lg:table-cell">
                            Subtype
                          </TableHead>
                          <TableHead className="hidden xl:table-cell">
                            Template
                          </TableHead>
                          <TableHead className="w-24">Status</TableHead>
                          <TableHead className="w-24">Custom</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {businessChartOfAccounts?.map(item => (
                          <TableRow key={item.id}>
                            <TableCell className="font-mono font-medium">
                              {item.account_code}
                            </TableCell>
                            <TableCell className="font-medium">
                              {item.account_name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <span className="text-sm">
                                {item.business_registrations?.business_name}
                              </span>
                            </TableCell>
                            <TableCell className="hidden lg:table-cell">
                              <span className="text-sm">
                                {item.account_subtypes?.name}
                              </span>
                            </TableCell>
                            <TableCell className="hidden xl:table-cell">
                              <span className="text-sm">
                                {item.coa_templates?.template_name || '-'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={item.is_active ? 'default' : 'outline'}
                              >
                                {item.is_active ? 'Active' : 'Inactive'}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  item.is_custom ? 'secondary' : 'outline'
                                }
                              >
                                {item.is_custom ? 'Custom' : 'Template'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                        {!businessChartOfAccounts?.length && (
                          <TableRow>
                            <TableCell
                              colSpan={7}
                              className="text-center text-muted-foreground"
                            >
                              No data available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-24" />
        </div>
      ))}
    </div>
  );
}
