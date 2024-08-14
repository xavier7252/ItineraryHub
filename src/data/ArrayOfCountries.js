const countriesArray = [
  { code: 'AT', label: 'Austria', phone: '43' },
  {
      code: 'AU',
      label: 'Australia',
      phone: '61',
      suggested: true,
  },
  { code: 'BE', label: 'Belgium', phone: '32' },
  {
      code: 'CA',
      label: 'Canada',
      phone: '1',
      suggested: true,
  },
  { code: 'CH', label: 'Switzerland', phone: '41' },
 
  {
      code: 'DE',
      label: 'Germany',
      phone: '49',
      suggested: true,
  },
  { code: 'DK', label: 'Denmark', phone: '45' },
  { code: 'ES', label: 'Spain', phone: '34' },
  { code: 'FI', label: 'Finland', phone: '358' },
  {
      code: 'FR',
      label: 'France',
      phone: '33',
      suggested: true,
  },
  { code: 'GB', label: 'United Kingdom', phone: '44' },
  { code: 'IT', label: 'Italy', phone: '39' },
  {
      code: 'JP',
      label: 'Japan',
      phone: '81',
      suggested: true,
  },
  { code: 'KR', label: 'South Korea', phone: '82' },
  { code: 'NL', label: 'Netherlands', phone: '31' },
  { code: 'NO', label: 'Norway', phone: '47' },
  { code: 'NZ', label: 'New Zealand', phone: '64' },

  { code: 'SE', label: 'Sweden', phone: '46' },
  { code: 'SG', label: 'Singapore', phone: '65' },
  
  {
      code: 'US',
      label: 'United States',
      phone: '1',
      suggested: true,
  },
  
];

countriesArray.sort((a, b) => a.label.localeCompare(b.label));

export default countriesArray;