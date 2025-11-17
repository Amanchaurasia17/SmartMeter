export interface PowerComponent {
  id: string;
  name: string;
  isOn: boolean;
  baseUsage: number; // Base usage in kWh
  currentUsage: number;
  location: string;
  onSince?: Date; // When the component was turned on
  autoOffTimer?: number; // Minutes until auto-off (0 or undefined = no timer)
}

export interface PowerData {
  timestamp: Date;
  totalUsage: number;
  components: PowerComponent[];
}