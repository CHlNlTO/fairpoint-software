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
import { basicInfoStepSchema } from '@/features/business-registration/lib/schemas';
import type {
  BusinessRegistrationData,
  PSGCBarangay,
  PSGCMunicipality,
  PSGCProvince,
  PSGCRegion,
} from '@/features/business-registration/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import * as React from 'react';
import { useForm } from 'react-hook-form';

interface BasicInfoStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

type BasicInfoFormData = Pick<
  BusinessRegistrationData,
  'businessName' | 'taxId' | 'businessEmail' | 'address'
>;

export function BasicInfoStep({ data, onNext }: BasicInfoStepProps) {
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

  const form = useForm<BasicInfoFormData>({
    resolver: zodResolver(basicInfoStepSchema),
    defaultValues: {
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
    },
  });

  React.useEffect(() => {
    const subscription = form.watch(value => {
      // Ensure address fields are never undefined, but always a full object with string values
      const safeAddress = {
        regionPsgc: value.address?.regionPsgc ?? '',
        provincePsgc: value.address?.provincePsgc ?? '',
        cityMunicipalityPsgc: value.address?.cityMunicipalityPsgc ?? '',
        barangayPsgc: value.address?.barangayPsgc ?? '',
        streetAddress: value.address?.streetAddress ?? '',
        buildingName: value.address?.buildingName ?? '',
        unitNumber: value.address?.unitNumber ?? '',
        postalCode: value.address?.postalCode ?? '',
      };
      onNext({
        ...data,
        ...value,
        address: safeAddress,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, onNext, data]);

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

  const selectedRegion = form.watch('address.regionPsgc');
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
            form.setValue('address.provincePsgc', '');
            form.setValue('address.cityMunicipalityPsgc', '');
            form.setValue('address.barangayPsgc', '');
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
  }, [selectedRegion, form]);

  const selectedProvince = form.watch('address.provincePsgc');
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
            form.setValue('address.cityMunicipalityPsgc', '');
            form.setValue('address.barangayPsgc', '');
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
  }, [selectedProvince, form]);

  const selectedMunicipality = form.watch('address.cityMunicipalityPsgc');
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
            form.setValue('address.barangayPsgc', '');
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
  }, [selectedMunicipality, form]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <div className="w-full flex flex-col gap-2 justify-center items-center">
          <h2 className="text-5xl font-bold">Your Business, Your Story</h2>
          <p className="text-muted-foreground">
            Tell us the basics to get started.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="businessName">Name of Business *</Label>
          <Input
            id="businessName"
            placeholder="Enter business name"
            {...form.register('businessName')}
            className={`bg-white ${form.formState.errors.businessName ? 'border-destructive' : ''}`}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">TIN *</Label>
          <Input
            id="taxId"
            placeholder="Enter TIN"
            {...form.register('taxId')}
            className={`bg-white ${form.formState.errors.taxId ? 'border-destructive' : ''}`}
          />
        </div>

        {/* Address */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Business Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="region">Region *</Label>
              <Select
                onValueChange={value =>
                  form.setValue(
                    'address.regionPsgc',
                    PSGC_UTILS.formatRegionCode(value)
                  )
                }
                value={PSGC_UTILS.extractRegionCode(
                  form.watch('address.regionPsgc') || ''
                )}
                disabled={isLoadingRegions}
              >
                <SelectTrigger className="bg-white">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Province *</Label>
              <Select
                onValueChange={value =>
                  form.setValue(
                    'address.provincePsgc',
                    PSGC_UTILS.formatProvinceCode(value)
                  )
                }
                value={PSGC_UTILS.extractProvinceCode(
                  form.watch('address.provincePsgc') || ''
                )}
                disabled={!selectedRegion || isLoadingProvinces}
              >
                <SelectTrigger className="bg-white">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="municipality">City/Municipality *</Label>
              <Select
                onValueChange={value =>
                  form.setValue(
                    'address.cityMunicipalityPsgc',
                    PSGC_UTILS.formatMunicipalityCode(value)
                  )
                }
                value={PSGC_UTILS.extractMunicipalityCode(
                  form.watch('address.cityMunicipalityPsgc') || ''
                )}
                disabled={!selectedProvince || isLoadingMunicipalities}
              >
                <SelectTrigger className="bg-white">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="barangay">Barangay *</Label>
              <Select
                onValueChange={value =>
                  form.setValue(
                    'address.barangayPsgc',
                    PSGC_UTILS.formatBarangayCode(value)
                  )
                }
                value={form.watch('address.barangayPsgc') || ''}
                disabled={!selectedMunicipality || isLoadingBarangays}
              >
                <SelectTrigger className="bg-white">
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
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="streetAddress">Street</Label>
              <Input
                id="streetAddress"
                placeholder="Street"
                {...form.register('address.streetAddress')}
                className={`bg-white ${form.formState.errors.address?.streetAddress ? 'border-destructive' : ''}`}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="postalCode">ZIP</Label>
              <Input
                id="postalCode"
                placeholder="ZIP"
                {...form.register('address.postalCode')}
                className={`bg-white ${form.formState.errors.address?.postalCode ? 'border-destructive' : ''}`}
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessEmail">Business Email *</Label>
          <Input
            id="businessEmail"
            type="email"
            placeholder="business@email.com"
            {...form.register('businessEmail')}
            className={`bg-white ${form.formState.errors.businessEmail ? 'border-destructive' : ''}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
