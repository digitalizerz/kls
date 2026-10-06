import { Select } from "@/components/ui/select";
import { capacityGallonOptions } from "@/lib/capacity";

export function CapacitySelect({
  id,
  name,
  defaultValue,
  required = false,
}: {
  id: string;
  name: string;
  defaultValue?: number | null;
  required?: boolean;
}) {
  return (
    <Select id={id} name={name} defaultValue={defaultValue ? String(defaultValue) : ""} required={required}>
      <option value="">Select capacity</option>
      {capacityGallonOptions(defaultValue).map((gallons) => (
        <option key={gallons} value={gallons}>
          {gallons.toLocaleString()} gallons
        </option>
      ))}
    </Select>
  );
}
