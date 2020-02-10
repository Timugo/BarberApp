export interface Barber {

    idBarber: number;
    name: string;
    lastName: string;
    city: string;
    phone:string;

}
export interface Componente{
    icon:string;
    name:string;
    redirectTo:string;
  }

export interface DeviceInfo {
    // The current bundle build of the app
    appBuild : string;
    // The current bundle verison of the app
    appVersion : string;
    // A percentage (0 to 1) indicating how much the battery is charged
    batteryLevel ?: number;
    // How much free disk space is available on the the normal data storage path for the os, in bytes
    diskFree ?: number;
    // The total size of the normal data storage path for the OS, in bytes
    diskTotal ?: number;
    // Whether the device is charging
    isCharging ?: boolean;
    // Whether the app is running in a simulator/emulator
    isVirtual : boolean;
    // The manufacturer of the device
    manufacturer : string;
    // Approximate memory used by the current app, in bytes. Divide by 1048576 to get the number of MBs used.
    memUsed ?: number;
    // The device model. For example, "iPhone"
    model : string;
    // The operating system of the device
    operatingSystem :string ;
    // The version of the device OS
    osVersion : string;
    // The device platform (lowercase).
    platform : any;
    // The UUID of the device as available to the app. This identifier may change on modern mobile platforms that only allow per-app install UUIDs.
    uuid : string;
}
    
export interface DeviceLanguageCodeResult {
    value : string;
}