This docs introduces how to update oniro developer board to the newest OpenHarmony version

#### Environment
First of all, the environment needs to be on Linux(For me is Ubuntu system)

Step 1:  
we can download the images for the board or you can build it yourself(I downloaded the image dayu200_standard_arm32.tar.gz from my colleague's link)
Didn't try the way of building by myself.

Step 2:
Flash the board following the `oniro docs` :  
 https://docs.oniroproject.org/developer-boards/hihope-hh-scdayu200.html#flashing


- Connect the board with Power pin(DCIN-12V) and USB-A pin(USB3.0 HOST1)

- Download the flash.py flashing tool from Gitee using the following commands:

```bash
git clone https://gitee.com/hihope_iot/docs.git hihope_iot_docs
mkdir flash && cp -r hihope_iot_docs/HiHope_DAYU200/烧写工具及指南/linux/* flash/
chmod +x flash/flash.py flash/bin/flash.x86_64
```
- To ensure proper device recognition, install the udev rule:

```bash
sudo cp flash/etc/udev/rules.d/85-rk3568.rules /etc/udev/rules.d/85-rk3568.rules
```

- Then, either reload udev rules or reboot your system:(没有权限就sudo)
```bash
udevadm control --reload-rules
```
- After this setup, running flash/flash.py -q should produce the following output, indicating readiness:(检查输出)

>Note:
If you want to implement it through WSL, you need to attach USB devices to virtual Ubuntu, and follow the procedure with the link instruction from `Attach a USB device`:
https://learn.microsoft.com/en-us/windows/wsl/connect-usb

```bash
maskrom
```
- To enable programming mode on the device, perform the following steps:
    - Press and hold VOL/RECOVERY then RESET buttons.
    - Release RESET button.

(先按住 VOL/RECOVERY 再按 RESET 按钮都不松开，然后松开 RESET 按钮)

- Confirm the mode by running lsusb, which should show:
```
loader
```

- Once the above steps are completed successfully, you can proceed to flash the board:

```bash
flash/flash.py -a -i ./out/rk3568/packages/phone/images
```

`注意：` ./out/rk3568/packages/phone/images 路径里面必须是我们之前下载的镜像文件的路径 `dayu200_standard_arm32.tar.gz`，否则手动更改镜像路径

#### Reference material  
https://docs.oniroproject.org/developer-boards/hihope-hh-scdayu200.html#building
