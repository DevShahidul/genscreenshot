import { DeviceName, devicesList } from "./devices";

export function isDeviceName(value: any): value is DeviceName {
  return typeof value === "string" && devicesList.includes(value as DeviceName);
}
