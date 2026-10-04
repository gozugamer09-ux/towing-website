// "What happened?" choices shared by the quick picker and the request form.
// `chip` is a shorter label for the quick-pick buttons, so they stay two lines on phones.
export const ISSUES = [
  { icon: 'truck', label: "Won't start or broke down", chip: 'Broke down', value: 'Breakdown, needs a tow' },
  { icon: 'alert', label: 'Accident', value: 'Accident' },
  { icon: 'tire', label: 'Flat tire', value: 'Flat tire' },
  { icon: 'battery', label: 'Dead battery', value: 'Dead battery' },
  { icon: 'key', label: 'Locked out', value: 'Locked out' },
  { icon: 'fuel', label: 'Out of fuel', value: 'Out of fuel' },
  { icon: 'hill', label: 'Stuck or off the road', value: 'Stuck in a ditch, sand or mud' },
  { icon: 'route', label: 'Planned or long-distance', chip: 'Long distance', value: 'Planned or long-distance tow' },
];
export const OTHER_ISSUES = ['Motorcycle tow', 'Junk car removal', 'Something else'];
