## Boot Servo(Web Engine) on Dayu board


1. ### QEMU Installation

The emulator requires **QEMU** to be installed on your system.

- Download and install QEMU from the official website:  
  [https://www.qemu.org/download/](https://www.qemu.org/download/)



Refer to the platform-specific instructions on the QEMU website for installation details.

2. ### Running the Emulator

To start the emulator, use the appropriate script for your operating system:

- **Linux:**  
  ```bash
  sudo bash run.sh
  ```
注意这里要配置qemu的环境变量
- **Windows:**  
  ```powershell
  .\run.bat
  ```
如果.\run.bat有问题
改成下面：
```bash
@echo off
cd /d "%~dp0"

"C:\msys64\mingw64\bin\qemu-system-x86_64.exe" ^
 -accel whpx ^
 -machine q35 ^
 -smp 6 ^
 -m 4096M ^
 -boot c ^
 -nographic ^
 -vga none ^
 -device virtio-gpu-pci,xres=360,yres=720 ^
 -display sdl,gl=off ^
 -rtc base=utc,clock=host ^
 -device es1370 ^
 -initrd ramdisk.img ^
 -kernel bzImage ^
 -drive file=updater.img,if=virtio,media=disk,format=raw,index=0 ^
 -drive file=system.img,if=virtio,media=disk,format=raw,index=1 ^
 -drive file=vendor.img,if=virtio,media=disk,format=raw,index=2 ^
 -drive file=sys_prod.img,if=virtio,media=disk,format=raw,index=3 ^
 -drive file=chip_prod.img,if=virtio,media=disk,format=raw,index=4 ^
 -drive file=userdata.img,if=virtio,media=disk,format=raw,index=5 ^
 -append "ip=dhcp loglevel=4 console=ttyS0,115200 init=init root=/dev/ram0 rw  ohos.boot.hardware=virt default_boot_device=10007000.virtio_mmio sn=8823456789 ohos.required_mount.system=/dev/block/vdb@/usr@ext4@ro,barrier=1@wait,required ohos.required_mount.vendor=/dev/block/vdc@/vendor@ext4@ro,barrier=1@wait,required" ^
 -netdev user,id=net0,hostfwd=tcp::55555-:55555 ^
 -device virtio-net-pci,netdev=net0
```

> **Note for Windows Users:**  
> The emulator requires **Hyper-V** to be enabled on your system.

#### Enabling Hyper-V on Windows

1. Open **Start Menu** and search for “Turn Windows features on or off”.
2. In the Windows Features dialog, check the boxes for:
   - **Hyper-V**
   - **Hyper-V Management Tools**
   - **Hyper-V Platform**
3. Click **OK** and wait for the changes to apply.

Restart your system after running the above command.

#### Connecting to the Emulator with HDC

Once the emulator is running, you can connect to it using **HDC**:

```bash
hdc tconn localhost:55555
```

> **Note:**  
> `hdc` is included in the OpenHarmony SDK toolchain.


3. ### Find the ID for your connected device.

hdc list targets

(Note: your connected device should have developer options enabled and USB debugging enabled.)

4. ### Make a directory to stage the install files

hdc -t <your device id> shell mkdir -p data/local/tmp/soundcloud-demo

5. ### Send the .hap to your device.

hdc -t <your device id> file send <path-to>/soundcloud-demo-0.1.0.tar /data/local/tmp/soundcloud-demo


6. ### 安装x86_64 hap包
PS C:\WINDOWS\system32> hdc -t 127.0.0.1:55555 install C:\Users\chens\Desktop\haps\servoshell-default-signed_x86_64.hap
>>
[Info]App install path:C:\Users\chens\Desktop\haps\servoshell-default-signed_x86_64.hap, queuesize:0, msg:install bundle successfully.
AppMod finish
PS C:\WINDOWS\system32>