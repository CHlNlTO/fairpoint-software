// features/business-registration/components/steps/basic-info-step.tsx

'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PSGC_UTILS } from '@/features/business-registration/lib/constants';
import type {
  BusinessRegistrationData,
  PSGCBarangay,
  PSGCMunicipality,
  PSGCProvince,
  PSGCRegion,
} from '@/features/business-registration/lib/types';
import { motion } from 'framer-motion';
import * as React from 'react';
import { TINInput } from '../tin-input';

interface BasicInfoStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
  validation: {
    errors: Record<string, string[]>;
    isValidating: boolean;
  };
  clearFieldError: (field: string) => void;
}

type BasicInfoFormData = Pick<
  BusinessRegistrationData,
  'businessName' | 'taxId' | 'businessEmail' | 'address'
>;

export function BasicInfoStep({
  data,
  onNext,
  validation,
  clearFieldError,
}: BasicInfoStepProps) {
  const [regions, setRegions] = React.useState<PSGCRegion[]>([]);
  const [provinces, setProvinces] = React.useState<PSGCProvince[]>([]);
  const [municipalities, setMunicipalities] = React.useState<
    PSGCMunicipality[]
  >([]);
  const [barangays, setBarangays] = React.useState<PSGCBarangay[]>([]);
  const [isLoadingRegions, setIsLoadingRegions] = React.useState(true);
  const [isLoadingProvinces, setIsLoadingProvinces] = React.useState(false);
  const [isLoadingMunicipalities, setIsLoadingMunicipalities] =
    React.useState(false);
  const [isLoadingBarangays, setIsLoadingBarangays] = React.useState(false);

  // Simple state management for form data
  const [formData, setFormData] = React.useState<BasicInfoFormData>({
    businessName: data.businessName || '',
    taxId: data.taxId || '',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    businessEmail: (data as any).businessEmail || '',
    address: {
      regionPsgc: data.address?.regionPsgc || '',
      provincePsgc: data.address?.provincePsgc || '',
      cityMunicipalityPsgc: data.address?.cityMunicipalityPsgc || '',
      barangayPsgc: data.address?.barangayPsgc || '',
      streetAddress: data.address?.streetAddress || '',
      buildingName: data.address?.buildingName || '',
      unitNumber: data.address?.unitNumber || '',
      postalCode: data.address?.postalCode || '',
    },
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

  // Update global state whenever form data changes
  React.useEffect(() => {
    const safeAddress = {
      regionPsgc: formData.address?.regionPsgc || '',
      provincePsgc: formData.address?.provincePsgc || '',
      cityMunicipalityPsgc: formData.address?.cityMunicipalityPsgc || '',
      barangayPsgc: formData.address?.barangayPsgc || '',
      streetAddress: formData.address?.streetAddress || '',
      buildingName: formData.address?.buildingName || '',
      unitNumber: formData.address?.unitNumber || '',
      postalCode: formData.address?.postalCode || '',
    };
    onNext({
      ...formData,
      address: safeAddress,
    });
  }, [formData, onNext]);

  React.useEffect(() => {
    const loadRegions = async () => {
      try {
        setIsLoadingRegions(true);
        const regionsData = PSGC_UTILS.getRegions();
        setRegions(regionsData);
      } finally {
        setIsLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  const selectedRegion = formData.address?.regionPsgc;
  const prevRegionRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (selectedRegion) {
      const loadProvinces = async () => {
        try {
          setIsLoadingProvinces(true);
          const provincesData = PSGC_UTILS.getProvinces(selectedRegion);
          setProvinces(provincesData);
          if (
            prevRegionRef.current &&
            prevRegionRef.current !== selectedRegion
          ) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                provincePsgc: '',
                cityMunicipalityPsgc: '',
                barangayPsgc: '',
              },
            }));
            setMunicipalities([]);
            setBarangays([]);
          }
          prevRegionRef.current = selectedRegion;
        } finally {
          setIsLoadingProvinces(false);
        }
      };
      loadProvinces();
    } else {
      setProvinces([]);
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [selectedRegion]);

  const selectedProvince = formData.address?.provincePsgc;
  const prevProvinceRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (selectedProvince) {
      const loadMunicipalities = async () => {
        try {
          setIsLoadingMunicipalities(true);
          const municipalitiesData =
            PSGC_UTILS.getMunicipalities(selectedProvince);
          setMunicipalities(municipalitiesData);
          if (
            prevProvinceRef.current &&
            prevProvinceRef.current !== selectedProvince
          ) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                cityMunicipalityPsgc: '',
                barangayPsgc: '',
              },
            }));
            setBarangays([]);
          }
          prevProvinceRef.current = selectedProvince;
        } finally {
          setIsLoadingMunicipalities(false);
        }
      };
      loadMunicipalities();
    } else {
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [selectedProvince]);

  const selectedMunicipality = formData.address?.cityMunicipalityPsgc;
  const prevMunicipalityRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (selectedMunicipality) {
      const loadBarangays = async () => {
        try {
          setIsLoadingBarangays(true);
          const barangaysData = PSGC_UTILS.getBarangays(selectedMunicipality);
          setBarangays(barangaysData);
          if (
            prevMunicipalityRef.current &&
            prevMunicipalityRef.current !== selectedMunicipality
          ) {
            setFormData(prev => ({
              ...prev,
              address: {
                ...prev.address,
                barangayPsgc: '',
              },
            }));
          }
          prevMunicipalityRef.current = selectedMunicipality;
        } finally {
          setIsLoadingBarangays(false);
        }
      };
      loadBarangays();
    } else {
      setBarangays([]);
    }
  }, [selectedMunicipality]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl">
            <span>
              <span className="font-bold">Your</span> Business,
            </span>
            <br />
            <span>
              <span className="font-bold">Your</span> Story..
            </span>
          </h2>
        </div>
        <div className="space-y-2">
          <Label
            htmlFor="businessName"
            className="inline-flex items-center gap-0.5"
          >
            Name of Business
            <span className="text-destructive text-base leading-none">*</span>
          </Label>
          <Input
            id="businessName"
            placeholder="Enter business name"
            value={formData.businessName}
            onChange={e => {
              setFormData(prev => ({ ...prev, businessName: e.target.value }));
              clearFieldError('businessName');
            }}
            className={`bg-white ${hasFieldError('businessName') ? 'border-destructive' : ''}`}
          />
          {getFieldError('businessName') && (
            <p className="text-sm text-destructive">
              {getFieldError('businessName')}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId" className="inline-flex items-center gap-0.5">
            TIN <span className="text-destructive">*</span>
          </Label>
          <TINInput
            value={formData.taxId || ''}
            onChange={value => {
              setFormData(prev => ({ ...prev, taxId: value }));
              clearFieldError('taxId');
            }}
            error={hasFieldError('taxId')}
            placeholder="000-000-000-000"
          />
          {getFieldError('taxId') && (
            <p className="text-sm text-destructive">{getFieldError('taxId')}</p>
          )}
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="region"
                className="inline-flex items-center gap-0.5"
              >
                Region <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={value => {
                  setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      regionPsgc: PSGC_UTILS.formatRegionCode(value),
                    },
                  }));
                  clearFieldError('address.regionPsgc');
                }}
                value={PSGC_UTILS.extractRegionCode(
                  formData.address?.regionPsgc || ''
                )}
                disabled={isLoadingRegions}
              >
                <SelectTrigger
                  className={`bg-white ${hasFieldError('address.regionPsgc') ? 'border-destructive' : ''}`}
                >
                  <SelectValue
                    placeholder={
                      isLoadingRegions ? 'Loading regions...' : 'Select region'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {regions.map(region => (
                    <SelectItem key={region.psgcCode} value={region.regCode}>
                      {region.regionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('address.regionPsgc') && (
                <p className="text-sm text-destructive">
                  {getFieldError('address.regionPsgc')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="province"
                className="inline-flex items-center gap-0.5"
              >
                Province <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={value => {
                  setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      provincePsgc: PSGC_UTILS.formatProvinceCode(value),
                    },
                  }));
                  clearFieldError('address.provincePsgc');
                }}
                value={PSGC_UTILS.extractProvinceCode(
                  formData.address?.provincePsgc || ''
                )}
                disabled={!selectedRegion || isLoadingProvinces}
              >
                <SelectTrigger
                  className={`bg-white ${hasFieldError('address.provincePsgc') ? 'border-destructive' : ''}`}
                >
                  <SelectValue
                    placeholder={
                      isLoadingProvinces
                        ? 'Loading provinces...'
                        : 'Select province'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {provinces.map(province => (
                    <SelectItem
                      key={province.psgcCode}
                      value={province.provCode || province.psgcCode}
                    >
                      {province.provName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('address.provincePsgc') && (
                <p className="text-sm text-destructive">
                  {getFieldError('address.provincePsgc')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="municipality"
                className="inline-flex items-center gap-0.5"
              >
                City/Municipality <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={value => {
                  setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      cityMunicipalityPsgc:
                        PSGC_UTILS.formatMunicipalityCode(value),
                    },
                  }));
                  clearFieldError('address.cityMunicipalityPsgc');
                }}
                value={PSGC_UTILS.extractMunicipalityCode(
                  formData.address?.cityMunicipalityPsgc || ''
                )}
                disabled={!selectedProvince || isLoadingMunicipalities}
              >
                <SelectTrigger
                  className={`bg-white ${hasFieldError('address.cityMunicipalityPsgc') ? 'border-destructive' : ''}`}
                >
                  <SelectValue
                    placeholder={
                      isLoadingMunicipalities
                        ? 'Loading municipalities...'
                        : 'Select city/municipality'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {municipalities.map(m => (
                    <SelectItem key={m.psgcCode} value={m.munCityCode}>
                      {m.munCityName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('address.cityMunicipalityPsgc') && (
                <p className="text-sm text-destructive">
                  {getFieldError('address.cityMunicipalityPsgc')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="barangay"
                className="inline-flex items-center gap-0.5"
              >
                Barangay <span className="text-destructive">*</span>
              </Label>
              <Select
                onValueChange={value => {
                  setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      barangayPsgc: PSGC_UTILS.formatBarangayCode(value),
                    },
                  }));
                  clearFieldError('address.barangayPsgc');
                }}
                value={formData.address?.barangayPsgc || ''}
                disabled={!selectedMunicipality || isLoadingBarangays}
              >
                <SelectTrigger
                  className={`bg-white ${hasFieldError('address.barangayPsgc') ? 'border-destructive' : ''}`}
                >
                  <SelectValue
                    placeholder={
                      isLoadingBarangays
                        ? 'Loading barangays...'
                        : 'Select barangay'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {barangays.map(b => (
                    <SelectItem key={b.psgcCode} value={b.brgyCode}>
                      {b.brgyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {getFieldError('address.barangayPsgc') && (
                <p className="text-sm text-destructive">
                  {getFieldError('address.barangayPsgc')}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="streetAddress"
                className="inline-flex items-center gap-0.5"
              >
                Street
              </Label>
              <Input
                id="streetAddress"
                placeholder="Street"
                value={formData.address?.streetAddress || ''}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      streetAddress: e.target.value,
                    },
                  }));
                  clearFieldError('address.streetAddress');
                }}
                className={`bg-white ${hasFieldError('address.streetAddress') ? 'border-destructive' : ''}`}
              />
              {getFieldError('address.streetAddress') && (
                <p className="text-sm text-destructive">
                  {getFieldError('address.streetAddress')}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="postalCode"
                className="inline-flex items-center gap-0.5"
              >
                ZIP
              </Label>
              <Input
                id="postalCode"
                placeholder="ZIP"
                value={formData.address?.postalCode || ''}
                onChange={e => {
                  setFormData(prev => ({
                    ...prev,
                    address: {
                      ...prev.address,
                      postalCode: e.target.value,
                    },
                  }));
                  clearFieldError('address.postalCode');
                }}
                className={`bg-white ${hasFieldError('address.postalCode') ? 'border-destructive' : ''}`}
              />
              {getFieldError('address.postalCode') && (
                <p className="text-sm text-destructive">
                  {getFieldError('address.postalCode')}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="businessEmail"
            className="inline-flex items-center gap-0.5"
          >
            Business Email <span className="text-destructive">*</span>
          </Label>
          <Input
            id="businessEmail"
            type="email"
            placeholder="business@email.com"
            value={formData.businessEmail || ''}
            onChange={e => {
              setFormData(prev => ({ ...prev, businessEmail: e.target.value }));
              clearFieldError('businessEmail');
            }}
            className={`bg-white ${hasFieldError('businessEmail') ? 'border-destructive' : ''}`}
          />
          {getFieldError('businessEmail') && (
            <p className="text-sm text-destructive">
              {getFieldError('businessEmail')}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
