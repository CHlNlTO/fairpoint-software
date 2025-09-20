// features/business-registration/components/steps/chart-of-accounts-step.tsx

'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useChartOfAccountsTemplateItems,
  useChartOfAccountsTemplates,
} from '@/features/business-registration/hooks/use-master-data';
import type { BusinessRegistrationData } from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import React from 'react';

interface ChartOfAccountsStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  clearFieldError: (field: string) => void;
}

interface ChartOfAccountsFormData {
  coaSetupOption: 'default' | 'import';
  coaCsvData: string;
}

export function ChartOfAccountsStep({
  data,
  onNext,
  validation,
  clearFieldError,
}: ChartOfAccountsStepProps) {
  // Simple state management for form data (matching other step patterns)
  const [formData, setFormData] = React.useState<ChartOfAccountsFormData>({
    coaSetupOption: (data.coaSetupOption as 'default' | 'import') || 'default',
    coaCsvData: (data.coaCsvData as string) || '',
  });

  // Helper function to get field error
  const getFieldError = (field: string): string | undefined => {
    const fieldErrors = validation.errors[field];
    return fieldErrors && fieldErrors.length > 0 ? fieldErrors[0] : undefined;
  };

  // Helper function to check if field has error
  const hasFieldError = (field: string): boolean => {
    return Boolean(
      validation.errors[field] && validation.errors[field].length > 0
    );
  };

  // Fetch available chart of accounts templates
  const { data: templates, isLoading: templatesLoading } =
    useChartOfAccountsTemplates(
      data.businessStructure,
      data.businessCategories
    );

  // Get the default template for the current business structure and categories
  const defaultTemplate = React.useMemo(() => {
    if (!templates || templates.length === 0) return null;

    // Find template that matches business structure and has overlapping business types
    return (
      templates.find(template => {
        const hasMatchingStructure =
          template.business_structure === data.businessStructure;
        const hasMatchingTypes = data.businessCategories?.some(category =>
          template.business_types.includes(category)
        );
        return hasMatchingStructure && hasMatchingTypes;
      }) || templates.find(template => template.is_default)
    );
  }, [templates, data.businessStructure, data.businessCategories]);

  // Fetch template items when default template is selected
  const { data: templateItems, isLoading: itemsLoading } =
    useChartOfAccountsTemplateItems(
      formData.coaSetupOption === 'default' && defaultTemplate
        ? defaultTemplate.id
        : undefined
    );

  // Update global state whenever form data changes
  React.useEffect(() => {
    onNext({ ...data, ...formData });
  }, [formData, onNext]);

  const handleOptionChange = (value: 'default' | 'import') => {
    setFormData(prev => ({ ...prev, coaSetupOption: value }));
    clearFieldError('coaSetupOption');
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    setFormData(prev => ({ ...prev, coaCsvData: text }));
    clearFieldError('coaCsvData');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">
            <span className="font-bold">Set-up Chart</span> <br /> of Accounts
          </h2>
          <p className="text-muted-foreground">
            Use a default template or import your own CSV.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="inline-flex items-center gap-0.5">
              COA Setup Options <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={handleOptionChange}
              value={formData.coaSetupOption}
            >
              <SelectTrigger
                className={`bg-white ${hasFieldError('coaSetupOption') ? 'border-destructive' : ''}`}
              >
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Use Default Template</SelectItem>
                <SelectItem value="import">Import CSV</SelectItem>
              </SelectContent>
            </Select>
            {getFieldError('coaSetupOption') && (
              <p className="text-sm text-destructive">
                {getFieldError('coaSetupOption')}
              </p>
            )}
          </div>

          {formData.coaSetupOption === 'default' ? (
            <div className="space-y-4">
              {templatesLoading ? (
                <div className="p-4 bg-muted border border-border rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Loading available templates...
                  </p>
                </div>
              ) : defaultTemplate ? (
                <div className="space-y-4">
                  <div className="p-6 bg-green-50 border border-green-200 rounded-xl dark:bg-green-900/20 dark:border-green-800/30">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-800/30 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600 dark:text-green-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-900 dark:text-green-200">
                          Template Selected
                        </h3>
                        <p className="text-sm text-green-700 dark:text-green-400">
                          Ready to use your chart of accounts
                        </p>
                      </div>
                    </div>

                    {/* Template Info */}
                    <div className="space-y-3">
                      <div className="bg-white/50 dark:bg-white/5 rounded-lg p-4 border border-green-200/50 dark:border-green-800/20">
                        <h4 className="font-medium text-green-900 dark:text-green-200 mb-2">
                          {defaultTemplate.template_name}
                        </h4>
                        <p className="text-sm text-green-700 dark:text-green-400 leading-relaxed">
                          {defaultTemplate.description}
                        </p>
                      </div>

                      {/* Business Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 border border-green-200/50 dark:border-green-800/20">
                          <p className="text-xs font-medium text-green-600 dark:text-green-500 uppercase tracking-wide mb-1">
                            Business Structure
                          </p>
                          <p className="text-sm font-medium text-green-900 dark:text-green-200 capitalize">
                            {data.businessStructure?.replace(/_/g, ' ')}
                          </p>
                        </div>
                        <div className="bg-white/50 dark:bg-white/5 rounded-lg p-3 border border-green-200/50 dark:border-green-800/20">
                          <p className="text-xs font-medium text-green-600 dark:text-green-500 uppercase tracking-wide mb-1">
                            Industries
                          </p>
                          <p className="text-sm font-medium text-green-900 dark:text-green-200 capitalize">
                            {data.businessCategories
                              ?.map(cat => cat.replace(/_/g, ' '))
                              .join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Chart of Accounts Preview Table */}
                  <div className="border border-border rounded-xl overflow-hidden shadow-sm">
                    <div className="bg-gradient-to-r from-muted to-muted/80 px-6 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-primary/10 rounded-md flex items-center justify-center">
                          <svg
                            className="w-3 h-3 text-primary"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-foreground">
                            Chart of Accounts Preview
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Preview of your accounting structure
                          </p>
                        </div>
                      </div>
                    </div>

                    {itemsLoading ? (
                      <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          Loading chart of accounts...
                        </p>
                      </div>
                    ) : templateItems && templateItems.length > 0 ? (
                      <div className="bg-card">
                        <div className="overflow-x-auto">
                          <table className="w-full text-sm">
                            <thead className="bg-muted border-b border-border">
                              <tr>
                                <th className="px-3 py-2 text-left font-medium text-foreground">
                                  Code
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-foreground">
                                  Account Name
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-foreground">
                                  Type
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-foreground">
                                  Category
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-foreground">
                                  Balance
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                              {templateItems
                                .sort((a, b) => a.sort_order - b.sort_order)
                                .map(item => (
                                  <tr
                                    key={item.id}
                                    className="hover:bg-muted/50"
                                  >
                                    <td className="px-3 py-2 font-mono text-xs text-muted-foreground">
                                      {item.account_code}
                                    </td>
                                    <td className="px-3 py-2 text-foreground">
                                      {item.account_name}
                                    </td>
                                    <td className="px-3 py-2">
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                          item.account_type === 'asset'
                                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                            : item.account_type === 'liability'
                                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                              : item.account_type === 'equity'
                                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                : item.account_type ===
                                                    'revenue'
                                                  ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                                                  : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300'
                                        }`}
                                      >
                                        {item.account_type}
                                      </span>
                                    </td>
                                    <td className="px-3 py-2 text-muted-foreground text-xs">
                                      {item.account_category.replace(/_/g, ' ')}
                                    </td>
                                    <td className="px-3 py-2">
                                      <span
                                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                          item.normal_balance === 'debit'
                                            ? 'bg-muted text-muted-foreground'
                                            : 'bg-muted text-muted-foreground'
                                        }`}
                                      >
                                        {item.normal_balance}
                                      </span>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Summary - Outside of scrollable area */}
                        <div className="bg-gradient-to-r from-muted/50 to-muted/30 px-6 py-4 border-t border-border">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                              <span className="text-sm font-medium text-foreground">
                                Total Accounts: {templateItems.length}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-4 text-xs">
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="text-muted-foreground">
                                  {
                                    templateItems.filter(
                                      item => item.account_type === 'asset'
                                    ).length
                                  }{' '}
                                  Assets
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-muted-foreground">
                                  {
                                    templateItems.filter(
                                      item => item.account_type === 'liability'
                                    ).length
                                  }{' '}
                                  Liabilities
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-muted-foreground">
                                  {
                                    templateItems.filter(
                                      item => item.account_type === 'equity'
                                    ).length
                                  }{' '}
                                  Equity
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-muted-foreground">
                                  {
                                    templateItems.filter(
                                      item => item.account_type === 'revenue'
                                    ).length
                                  }{' '}
                                  Revenue
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                <span className="text-muted-foreground">
                                  {
                                    templateItems.filter(
                                      item => item.account_type === 'expense'
                                    ).length
                                  }{' '}
                                  Expenses
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <p className="text-sm text-muted-foreground">
                          No chart of accounts items found for this template.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800/30">
                  <p className="text-sm text-yellow-800 dark:text-yellow-300">
                    <strong>No Default Template Available</strong> - No specific
                    template found for your business structure and categories.
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Business Structure: {data.businessStructure} | Categories:{' '}
                    {data.businessCategories?.join(', ')}
                  </p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    You may want to use the CSV import option instead.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2 w-fit">
              <Label className="inline-flex items-center gap-0.5">
                Upload CSV Template <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) handleFile(file);
                  }}
                  className={`
                    w-fit px-3 py-2 border rounded-md bg-card text-sm
                    file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
                    file:text-sm file:font-medium file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90
                    focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                    ${hasFieldError('coaCsvData') ? 'border-destructive' : 'border-input'}
                  `}
                />
              </div>
              {getFieldError('coaCsvData') && (
                <p className="text-sm text-destructive">
                  {getFieldError('coaCsvData')}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
