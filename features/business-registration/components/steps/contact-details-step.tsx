// features/business-registration/components/steps/contact-details-step.tsx

'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { contactDetailsStepSchema } from '@/features/business-registration/lib/schemas';
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

interface ContactDetailsStepProps {
  data: Partial<BusinessRegistrationData>;
  onNext: (data: Partial<BusinessRegistrationData>) => void;
  onBack: () => void;
}

interface ContactDetailsFormData {
  address: {
    regionPsgc: string;
    provincePsgc: string;
    cityMunicipalityPsgc: string;
    barangayPsgc: string;
    streetAddress?: string;
    buildingName?: string;
    unitNumber?: string;
    postalCode?: string;
  };
  phone?: string;
  website?: string;
  email?: string;
}

export function ContactDetailsStep({ data, onNext }: ContactDetailsStepProps) {
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

  const form = useForm<ContactDetailsFormData>({
    resolver: zodResolver(contactDetailsStepSchema),
    defaultValues: {
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
      phone: data.phone || '',
      website: data.website || '',
      email: data.email || '',
    },
  });

  // Update parent data when form values change
  React.useEffect(() => {
    const subscription = form.watch(value => {
      // Only update if we have valid address data
      if (
        value.address?.regionPsgc &&
        value.address?.provincePsgc &&
        value.address?.cityMunicipalityPsgc &&
        value.address?.barangayPsgc
      ) {
        onNext({
          ...data,
          ...value,
          address: {
            regionPsgc: value.address.regionPsgc,
            provincePsgc: value.address.provincePsgc,
            cityMunicipalityPsgc: value.address.cityMunicipalityPsgc,
            barangayPsgc: value.address.barangayPsgc,
            streetAddress: value.address.streetAddress,
            buildingName: value.address.buildingName,
            unitNumber: value.address.unitNumber,
            postalCode: value.address.postalCode,
          },
        });
      } else {
        // Update other fields without address if address is incomplete
        const { address, ...otherFields } = value;
        onNext({
          ...data,
          ...otherFields,
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch, onNext, data]);

  // Load regions on component mount
  React.useEffect(() => {
    const loadRegions = async () => {
      try {
        setIsLoadingRegions(true);
        const regionsData = PSGC_UTILS.getRegions();
        setRegions(regionsData);
      } catch (error) {
        console.error('Failed to load regions:', error);
      } finally {
        setIsLoadingRegions(false);
      }
    };
    loadRegions();
  }, []);

  // Load provinces when region changes
  const selectedRegion = form.watch('address.regionPsgc');
  const prevRegionRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (selectedRegion) {
      const loadProvinces = async () => {
        try {
          setIsLoadingProvinces(true);
          const provincesData = PSGC_UTILS.getProvinces(selectedRegion);
          setProvinces(provincesData);
          // Only reset dependents if region actually changed (not on initial mount)
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
        } catch (error) {
          console.error('Failed to load provinces:', error);
        } finally {
          setIsLoadingProvinces(false);
        }
      };
      loadProvinces();
    } else {
      // When region is cleared, also clear dependents so UI stays consistent
      setProvinces([]);
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [selectedRegion, form]);

  // Load municipalities when province changes
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
          // Only reset if province actually changed
          if (
            prevProvinceRef.current &&
            prevProvinceRef.current !== selectedProvince
          ) {
            form.setValue('address.cityMunicipalityPsgc', '');
            form.setValue('address.barangayPsgc', '');
            setBarangays([]);
          }
          prevProvinceRef.current = selectedProvince;
        } catch (error) {
          console.error('Failed to load municipalities:', error);
        } finally {
          setIsLoadingMunicipalities(false);
        }
      };
      loadMunicipalities();
    } else {
      // When province is cleared, also clear dependents
      setMunicipalities([]);
      setBarangays([]);
    }
  }, [selectedProvince, form]);

  // Load barangays when municipality changes
  const selectedMunicipality = form.watch('address.cityMunicipalityPsgc');
  const prevMunicipalityRef = React.useRef<string | undefined>(undefined);
  React.useEffect(() => {
    if (selectedMunicipality) {
      const loadBarangays = async () => {
        try {
          setIsLoadingBarangays(true);
          const barangaysData = PSGC_UTILS.getBarangays(selectedMunicipality);
          setBarangays(barangaysData);
          // Only reset if municipality actually changed
          if (
            prevMunicipalityRef.current &&
            prevMunicipalityRef.current !== selectedMunicipality
          ) {
            form.setValue('address.barangayPsgc', '');
          }
          prevMunicipalityRef.current = selectedMunicipality;
        } catch (error) {
          console.error('Failed to load barangays:', error);
        } finally {
          setIsLoadingBarangays(false);
        }
      };
      loadBarangays();
    } else {
      // When municipality is cleared, also clear barangays
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
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Contact Details</CardTitle>
          <CardDescription>
            Add your business address and contact information. We&apos;l use
            this for official correspondence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Address Section */}
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
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingRegions
                          ? 'Loading regions...'
                          : 'Select region'
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
                {form.formState.errors.address?.regionPsgc && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.regionPsgc.message}
                  </p>
                )}
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
                  <SelectTrigger>
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
                {form.formState.errors.address?.provincePsgc && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.provincePsgc.message}
                  </p>
                )}
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
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingMunicipalities
                          ? 'Loading municipalities...'
                          : 'Select city/municipality'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {municipalities.map(municipality => (
                      <SelectItem
                        key={municipality.psgcCode}
                        value={municipality.munCityCode}
                      >
                        {municipality.munCityName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.address?.cityMunicipalityPsgc && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.cityMunicipalityPsgc.message}
                  </p>
                )}
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
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        isLoadingBarangays
                          ? 'Loading barangays...'
                          : 'Select barangay'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {barangays.map(barangay => (
                      <SelectItem
                        key={barangay.psgcCode}
                        value={barangay.brgyCode}
                      >
                        {barangay.brgyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {form.formState.errors.address?.barangayPsgc && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.address.barangayPsgc.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="streetAddress">Street Address</Label>
                <Input
                  id="streetAddress"
                  placeholder="Enter street address"
                  {...form.register('address.streetAddress')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buildingName">Building Name</Label>
                  <Input
                    id="buildingName"
                    placeholder="Building or establishment name"
                    {...form.register('address.buildingName')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unitNumber">Unit Number</Label>
                  <Input
                    id="unitNumber"
                    placeholder="Unit, room, or office number"
                    {...form.register('address.unitNumber')}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  placeholder="Enter 4-digit postal code"
                  {...form.register('address.postalCode')}
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Contact Information</h3>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                {...form.register('phone')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...form.register('email')}
              />
              {form.formState.errors.email && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                placeholder="Enter website URL"
                {...form.register('website')}
              />
              {form.formState.errors.website && (
                <p className="text-sm text-destructive">
                  {form.formState.errors.website.message}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
