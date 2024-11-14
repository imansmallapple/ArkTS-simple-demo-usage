# Procedure of installing app using hdc

To install on a device using hdc do the following.

1. Locate where the hdc tool on your system.

(For Windows with DevEcoStudio installed, you will find it at C:\Users\<your-account>\AppData\Local\OpenHarmony\Sdk\11\toolchains>

The rest of these steps assume that you have this directory in your path or you run hdc from this path.

2. Find the ID for your connected device.

hdc list targets

(Note: your connected device should have developer options enabled and USB debugging enabled.)

3. Make a directory to stage the install files

hdc -t <your device id> shell mkdir -p data/local/tmp/soundcloud-demo

4. Send the .hap to your device.

hdc -t <your device id> file send <path-to>/soundcloud-demo-0.1.0.tar /data/local/tmp/soundcloud-demo

5. Unpack the tarball

hdc -t <your device id> shell tar -xvf /data/local/tmp/soundcloud-demo/soundcloud-demo-0.1.0.tar -C /data/local/tmp/soundcloud-demo/

6. Install the .hap on your device

hdc -t <your device id> shell bm install -p data/local/tmp/soundcloud-demo/soundcloud-demo-0.1.0

6. Clean-up (optional)

hdc -t <your device id> shell rm -rf /data/local/tmp/soundcloud-demo


/*****************************************/
To install on a device using hdc do the following.

1. Locate where the hdc tool on your system.

(For Windows with DevEcoStudio installed, you will find it at C:\Users\<your-account>\AppData\Local\OpenHarmony\Sdk\11\toolchains>

The rest of these steps assume that you have this directory in your path or you run hdc from this path.

2. Find the ID for your connected device.

hdc list targets

(Note: your connected device should have developer options enabled and USB debugging enabled.)

3. Make a directory to stage the install files

hdc -t <your device id> shell mkdir -p data/local/tmp/telegram-demo

4. Send the .hap to your device.

hdc -t <your device id> file send <path-to>telegram-demo-0.2.0.tar /data/local/tmp/telegram-demo

5. Unpack the tarball

hdc -t <your device id> shell tar -xvf /data/local/tmp/telegram-demo/telegram-demo-0.2.0.tar -C /data/local/tmp/telegram-demo/

6. Install the .hap on your device

hdc -t <your device id> shell bm install -p data/local/tmp/telegram-demo/telegram-demo-0.2.0

6. Clean-up (optional)

hdc -t <your device id> shell rm -rf /data/local/tmp/telegram-demo
