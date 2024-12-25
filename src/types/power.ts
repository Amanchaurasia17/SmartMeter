export interface PowerComponent {
  id: string;
  name: string;
  isOn: boolean;
  baseUsage: number; // Base usage in kWh
  currentUsage: number;
  location: string;
}

export interface PowerData {
  timestamp: Date;
  totalUsage: number;
  components: PowerComponent[];
}