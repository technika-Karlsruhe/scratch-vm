require ("core-js");
require ("regenerator-runtime")
var success=false
var connecteddevice;
var list = new Array(); //order of tasks
var valWrite = new Array(); // Values of all writeable chars(0, 1 --> Motor; 2-5--> Inputs)
var valIn = new Array(); //values of In-modes
var stor = new Array() // memory 
var charZust=0;
var n=0; 
let inEndpoint = undefined;
let outEndpoint = undefined;
var inputchange = new Array()
var funcstate= new Array()
var changing= new Array()
var numruns = new Array()
var read=0
var notificationTimer=0
var type // defined locally-> only accessible from this file--> no interference with other type variable 

var connect = undefined
var autoconnect = undefined
let writer = undefined

var data = undefined
let rxBuffer = new Uint8Array(0);
var listentimeout = 5; // time between two listen calls

// Set to true when actively debugging TX protocol payloads
const TX_DEBUG = false;


//Controller specifications 
class BTSmart {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
    }
    request=3
    baudRate= 115200
    value=3000000/115200
    configuration=1
    interface=0
    usbVendorId=8733
    usbProductId=5
    //functions returning the commands in the controller appropriate format
    getwriteOut(ind, val ){// val <0 right, >0 left
        if(ind<2){
        data=this.writeOut
        data[8]=ind
        data[11]=-val //inverting to align with fischertechnik convention
        return data
        }
    }
    getwriteInMode(ind, val){
        data=this.writeInMode
        data[8]=ind 
        data[9]= val
        return data
    }
    getread(){
        return this.read
    }
    getwriteLED(){
        return this.writeLED
    }
    writeOut = new Uint8Array([ 0x5a, 0xa5, 0x68, 0xce, 0x2a, 0x04, 0, 4,  0, 3, 0, 0]);
    writeInMode = new Uint8Array([ 0x5a, 0xa5, 0x14, 0x34, 0xff, 0x93, 0x00, 0x02, 0, 0]);
    writeLED= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    read= new Uint8Array( [ 0x5a, 0xa5, 0xf4, 0x8a, 0x16, 0x32, 0x00, 0x00]);
    inputOffset=2 //amout of values ignored when reading 
    inputHeader= new Array(90, 165, 244, 138, 22, 50, 0, 20)
    indIn=4 // Number of Inputs
    inLength=24
    indServo=0
    indOut=6 // Number of outputs
    indSum=10 // Sum of all characteristics which are permanently accessed (not LED)
    name='BT Smart Controller'//name for USB connection 
}

class RX {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation
        listentimeout = 250; // RX has a longer response time
    }
    request = 3;
    baudRate = 19200;
    configuration = 1;
    interface = 0;
    usbVendorId = 0x221D;
    usbProductId = 0x0029;

    inputOffset = 2 //amout of values ignored when reading
    inputHeader = [0x10, 0x02];
    indIn = 8 // Number of Inputs
    inLength = 24
    indServo = 0
    indOut = 12 // Number of outputs
    indSum = 10 // Sum of all characteristics which are permanently accessed (not LED)
    name='RXC'//name for USB connection
    hasResponse = true;

    writeOut = new Uint8Array([0x55, 0xAA, 0x04, 0x02, 0x00, 0x00, 0x00]);
    writeInMode = new Uint8Array([0x55, 0xAA, 0x04, 0x03, 0x00, 0x00, 0x00]);
    writeLED = new Uint8Array([0x55, 0xAA, 0x02, 0x04, 0x00]);
    read = new Uint8Array([0x55, 0xAA, 0x02, 0x01, 0x00]);

    // Output
    getwriteOut(ind, val) {
        //console.log(`Writing to output ${ind} with value ${val}`);
        let data;
        if (ind >= 0 && ind <= 3) {
            //console.log(`Setting motor ${ind + 1} speed to ${val}`);
            // Motor: Setup Motor 0xC2
            // val: -127 to 127, must be represented on 2 Byte (signed, two's complement)
            let speed = Math.max(-127, Math.min(127, val));
            let speed16 = speed << 2; // Scale value to 10 Bit (-512 to 512)
            // 2-Byte signed (little endian)
            data = new Uint8Array(8);
            data[0] = 0x10; // DLE
            data[1] = 0x02; // STX
            data[2] = 0xC2; // CMD (Setup Motor)
            data[3] = ind + 1; // Motor Number (1-4)
            data[4] = (speed16 >> 8) & 0xFF; // MSB
            data[5] = speed16 & 0xFF; // LSB
            data[6] = 0x10; // DLE
            data[7] = 0x03; // ETX
        } else if (ind >= 4 && ind <= 11) {
            //console.log(`Setting output ${ind - 3} PWM to ${val}`);
            // Output: Setup Output 0xC0
            // val: 0 to 127, scale to 0-512
            let pwm = Math.max(0, Math.min(127, val));
            let pwm16 = pwm << 2; // scale to 10 Bit (0-512)
            data = new Uint8Array(8);
            data[0] = 0x10; // DLE
            data[1] = 0x02; // STX
            data[2] = 0xC0; // CMD (Setup Output)
            data[3] = (ind - 3); // Port Number (1-8)
            data[4] = (pwm16 >> 8) & 0xFF; // MSB
            data[5] = pwm16 & 0xFF; // LSB
            data[6] = 0x10; // DLE
            data[7] = 0x03; // ETX
        } else {
            throw new Error("Index outside the valid range (0-11)");
        }
        //console.log('Output command prepared:', data);
        return data;
    }

    // Input Mode
    getwriteInMode(ind, val) {
        let typeVal;
        switch (val) {
            case 0x0a: // mV
                typeVal = 0;
                break;
            case 0x0b: // resistor
                typeVal = 1;
                break;
            case 0x0c: // ultrasonic
                typeVal = 3;
                break;
            case 0xFF: // disabled
                typeVal = 0xFF;
                break;
            default:
                typeVal = 0xFF; // fallback: disabled
        }
        //console.log(`Setting input mode for input ${ind} to ${val} (mapped to type ${typeVal})`);
        let data = new Uint8Array(7);
        data[0] = 0x10; // DLE
        data[1] = 0x02; // STX
        data[2] = 0xB0; // CMD
        data[3] = (ind === 255) ? 255 : ind + 1;;  // Port
        data[4] = typeVal; // Type
        data[5] = 0x10; // DLE
        data[6] = 0x03; // ETX
        //console.log('Input mode command prepared:', data);
        return data;
    }

    // LED
    getwriteLED() { //placeholder for LED writing
        let data = new Uint8Array(5);
        data[0] = 0x55;
        data[1] = 0xAA;
        data[2] = 0x02;
        data[3] = 0x04;
        return data;
    }

    // read
    getread() {
        let data = new Uint8Array(5);
        data[0] = 0x10; // DLE
        data[1] = 0x02; // STX
        data[2] = 0xB2; // CMD
        data[3] = 0x10; // DLE
        data[4] = 0x03; // ETX
        return data;
    }
}

class TX {
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
        translate.setup(); // setup translation

        listentimeout = 100;


        // PWM State: Index 0-7 = O1-O8 (oder M1+, M1-, M2+, M2-, etc.)
        this.pwmState = new Int16Array(8).fill(0);
        
        // Motor master/sync
        this.motorMaster = new Uint8Array(4).fill(0);
        
        // Motor distance
        this.motorDistance = new Uint16Array(4).fill(0);
        
        // Input configuration
        // Bit 7 (0x80) = Analog-Flag (0=Digital, 1=Analog)
        // Basis-Modi:
        //   0x00 = Spannung Digital,     0x80 = Spannung Analog
        //   0x01 = Widerstand 5k Dig,    0x81 = Widerstand 5k Analog
        //   0x02 = Widerstand 15k Dig,   0x82 = Widerstand 15k Analog
        //   0x03 = Ultraschall Dig,      0x83 = Ultraschall Analog
        this.inputMode = new Uint8Array(8).fill(0x81); // Default: Widerstand 5k Analog

        // Counter State (4 counters)
        this.counterValues = new Uint16Array(4).fill(0);

        // Counter Reset Command IDs (4 counters)
        this.cntResetCmdId = new Uint16Array(4).fill(0);

        // Session and Transaction IDs
        this.sid = 0;
        this.tid = 1;
    }

    baudRate = 38400;
    request = 9;
    configuration = 1;
    interface = 1;
    usbVendorId = 0x221D;
    usbProductId = 0x1000;

    inputOffset = 0; // amount of values ignored when reading
    inputHeader = [0x02, 0x55];
    indIn = 8; // Number of Inputs
    inLength = 24;
    indServo = 0;
    indOut = 12; // Number of Motors*3 
    indSum = 10; // Sum of all characteristics which are permanently accessed (not LED)
    name = 'ROBO TX Controller'; // name for USB connection

    // Output
    getwriteOut(ind, val) {
        console.log(`TX: Setting output index ${ind} to value ${val}`);
        
        // Mappt ind und val zu den PWM-Kanälen
        // ind 0-3 = Motoren M1-M4
        // ind 4-11 = Outputs O1-O8
        
        if (ind >= 0 && ind < 4) {
            // Motor-Modus: ind 0-3 = M1-M4
            // val: -127 bis +127
            // Positive Werte = Links (M+), Negative = Rechts (M-)
            
            const pwmIndex1 = ind * 2;      // M+ (z.B. M1+ = Index 0)
            const pwmIndex2 = ind * 2 + 1;  // M- (z.B. M1- = Index 1)
            
            if (val > 0) {
                // Linkslauf: M+ aktiv, M- aus
                this.pwmState[pwmIndex1] = Math.min(512, val * 4); // Scale zu 0-512
                this.pwmState[pwmIndex2] = 0;
            } else if (val < 0) {
                // Rechtslauf: M- aktiv, M+ aus
                this.pwmState[pwmIndex1] = 0;
                this.pwmState[pwmIndex2] = Math.min(512, Math.abs(val) * 4);
            } else {
                // Stopp/Bremse
                this.pwmState[pwmIndex1] = 0;
                this.pwmState[pwmIndex2] = 0;
            }
        } else if (ind >= 4 && ind < 12) {
            // Einzeloutput-Modus O1-O8
            const pwmIndex = ind - 4;
            this.pwmState[pwmIndex] = Math.max(0, Math.min(512, val * 4));
        }
        
        console.log('TX PWM State:', this.pwmState);
        return this.createTXPacket();
    }

    // Connect Packet (CMD 001)
    getwriteLED() {
        console.log("TX: Sending Connect Packet (CMD 001)");
        this.tid = 1;
        this.sid = 0; // SID=0 triggert neue Session
        return this.createStartPacket();
    }

    // Read/Status Packet (CMD 002)
    getread() {
        //console.log(`TX: Sending Output Packet (CMD 002) TID=${this.tid} SID=${this.sid}`);
        return this.createTXPacket();
    }

    // Counter Reset
    getwriteCounterreset(ind) {
        console.log(`TX: Resetting counter C${ind+1}`);
        if (ind >= 0 && ind < 4) {
            // Increment the counter reset command ID
            this.cntResetCmdId[ind]++;
            if (this.cntResetCmdId[ind] > 65535) this.cntResetCmdId[ind] = 1;
            
            // Reset the local counter value
            this.counterValues[ind] = 0;
        }
        return this.createTXPacket();
    }

    // Input Mode - Konfiguriere Input über Remote Config Write (CMD_005)
    getwriteInMode(ind, val) {
        console.log(`TX: Setting input mode for I${ind+1} to ${val} (0x${val.toString(16)})`);
        
        // Scratch-Modi (vom Extension-Block):
        //   0x0a = Voltage (mV) - Analog
        //   0x0b = Resistance (Ohm) - Analog
        //   0x0c = Ultrasonic (Distance) - Analog
        //   0x0d = Digital (Switch/Button) - Digital
        //
        // TX-Modi für CMD_005 Input_Config[i] (laut neuer Dokumentation):
        //   Bit 7 (0x80) = Analog-Flag (0=Digital, 1=Analog)
        //   Basis-Modi:
        //     0x00 = Spannung Digital,     0x80 = Spannung Analog
        //     0x01 = Widerstand 5k Dig,    0x81 = Widerstand 5k Analog
        //     0x02 = Widerstand 15k Dig,   0x82 = Widerstand 15k Analog
        //     0x03 = Ultraschall Dig,      0x83 = Ultraschall Analog
        
        if (ind >= 0 && ind < 8) {
            switch(val) {
                case 0x0a: // Voltage (Analog)
                    this.inputMode[ind] = 0x80; // Spannung Analog
                    console.log(`  -> TX Mode: 0x80 (Spannung Analog)`);
                    break;
                    
                case 0x0b: // Resistance (Analog)
                    this.inputMode[ind] = 0x81; // Widerstand 5k Analog
                    console.log(`  -> TX Mode: 0x81 (Widerstand 5k Analog)`);
                    break;
                    
                case 0x0c: // Ultrasonic (Analog)
                    this.inputMode[ind] = 0x83; // Ultraschall Analog
                    console.log(`  -> TX Mode: 0x83 (Ultraschall Analog)`);
                    break;
                    
                default:
                    // Unbekannte Modi: Default auf Widerstand 5k Analog setzen
                    this.inputMode[ind] = 0x81;
                    console.warn(`  -> Unknown mode ${val}, defaulting to 0x81 (Widerstand 5k Analog)`);
            }
        } else {
            console.error(`TX: Invalid input index ${ind} (must be 0-7)`);
        }
        
        // Sende Config-Packet mit aktualisierten Input-Modi
        return this.createConfigPacket();
    }

    createStartPacket() {
        const buffer = new Uint8Array(27);
        const view = new DataView(buffer.buffer);

        buffer[0] = 0x02; // STX
        buffer[1] = 0x55; // U
        
        view.setUint16(2, 20, false); // Length
        view.setUint32(4, 1, true);   // Source = 1 (PC)
        view.setUint32(8, 2, true);   // Dest = 2 (Master TX)
        view.setUint16(12, this.tid, true);  // TID
        view.setUint16(14, 0, true);  // SID = 0 (triggers new session)
        view.setUint32(16, 1, true);  // CMD = 1 (Connect)
        view.setUint32(20, 0, true);  // Items = 0

        // Checksum über Bytes 2-23 (20 Bytes)
        let sum = 0;
        for (let i = 2; i < 24; i++) sum = (sum + buffer[i]) & 0xFFFF;
        view.setUint16(24, (~sum + 1) & 0xFFFF, false);

        buffer[26] = 0x03; // ETX
        
        console.log('TX Connect Packet:', Array.from(buffer).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
        return buffer;
    }

    createTXPacket() {
        this.tid++;
        if (this.tid > 65535) this.tid = 1;

        const buffer = new Uint8Array(75);
        const view = new DataView(buffer.buffer);

        // Header
        buffer[0] = 0x02; // STX
        buffer[1] = 0x55; // U
        
        view.setUint16(2, 68, false); // Length = 68
        view.setUint32(4, 1, true);   // Source = 1 (PC)
        view.setUint32(8, 2, true);   // Dest = 2 (Master TX)
        view.setUint16(12, this.tid, true);  // TID
        view.setUint16(14, this.sid, true);  // SID
        view.setUint32(16, 2, true);  // CMD = 2 (Input/Output)
        view.setUint32(20, 1, true);  // Items = 1

        // TA_OUTPUT Structure (44 Bytes)
        view.setUint32(24, 0, true);  // TAId = 0 (TA_LOCAL)
        
        // cnt_reset_cmd_id[4] @ offset 28-35 (4x UINT16)
        for (let i = 0; i < 4; i++) {
            view.setUint16(28 + i * 2, this.cntResetCmdId[i], true);
        }
        
        // master[4] @ offset 36-39 (4x UINT8)
        for (let i = 0; i < 4; i++) {
            buffer[36 + i] = this.motorMaster[i];
        }
        
        // duty[8] @ offset 40-55 (8x INT16)
        for (let i = 0; i < 8; i++) {
            view.setInt16(40 + i * 2, this.pwmState[i], true);
        }
        
        // distance[4] @ offset 56-63 (4x UINT16)
        for (let i = 0; i < 4; i++) {
            view.setUint16(56 + i * 2, this.motorDistance[i], true);
        }
        
        // cnt_ext_motor_cmd_id[4] @ offset 64-71 (4x UINT16) - unused, set to 0
        for (let i = 0; i < 4; i++) {
            view.setUint16(64 + i * 2, 0, true);
        }

        // Checksum über Bytes 2-71 (70 Bytes)
        let sum = 0;
        for (let i = 2; i < 72; i++) sum = (sum + buffer[i]) & 0xFFFF;
        view.setUint16(72, (~sum + 1) & 0xFFFF, false);

        buffer[74] = 0x03; // ETX
        
        return buffer;
    }

    createConfigPacket() {
        // Fish.X1: CMD_005 (Remote Config Write) => TX antwortet mit CMD_105
        // Payload = TA_LOCAL
        //   Offset 0-3:   Transfer Area ID (4 Bytes = 0x00000000)
        //   Offset 4-7:   Input 1-4 Config (Input 1 Config, Input 2 Config, Input 3 Config, Input 4 Config)
        //   Offset 8-11:  Input 5-8 Config (Input 5 Config, Input 6 Config, Input 7 Config, Input 8 Config)
        //   Offset 12-15: 0x01, 0x01, 0x01, 0x01
        //   Offset 16-19: 0x00, 0x00, 0x00, 0x00
        //   Offset 20-23: 0x00, 0x00, 0x00, 0x00
        //   Offset 24-27: 0x00, 0x00, 0x00, 0x00
        //   Offset 28-31: 0x00, 0x00, 0x00, 0x00
        //   Offset 32-35: 0x00, 0x00, 0x00, 0x00
        //
        // TA_LOCAL Größe: 36 Bytes
        
        this.tid++;
        if (this.tid > 65535) this.tid = 1;

        const taLocalSize = 36;                         // Payload Size
        const numItems = 1;                             // 1 Item (TA_LOCAL)
        const payloadLen = taLocalSize;                 // 36 Bytes
        const lengthField = 20 + payloadLen;            // Fish.X1 Header(20) + Payload(36) = 56
        const totalLen = 2 + 2 + lengthField + 2 + 1;   // STX/U(2) + Len(2) + Data(56) + CRC(2) + ETX(1) = 63

        const buffer = new Uint8Array(totalLen);
        const view = new DataView(buffer.buffer);

        // --- Fish.X1 Frame Header ---
        buffer[0] = 0x02;                               // STX
        buffer[1] = 0x55;                               // 'U'
        view.setUint16(2, lengthField, false);          // Length (Big Endian)
        view.setUint32(4, 1, true);                     // FROM: PC (Little Endian)
        view.setUint32(8, 2, true);                     // TO: Master TX (Little Endian)
        view.setUint16(12, this.tid, true);             // TID (Little Endian)
        view.setUint16(14, this.sid, true);             // SID (Little Endian)
        view.setUint32(16, 5, true);                    // CMD = 5 (Remote Config Write) (Little Endian)
        view.setUint32(20, numItems, true);             // Number of items = 1 (Little Endian)

        // --- TA_LOCAL Payload (beginnt bei Offset 24 im Fish.X1 Frame) ---
        view.setUint32(24, 0, true); // Offset 0-3: TAId = 0 (TA_LOCAL) (Little Endian)

        // Offset 4-7: Feste Werte (0x01, 0x01, 0x01, 0x01)
        buffer[28] = 0x01;
        buffer[29] = 0x01;
        buffer[30] = 0x01;
        buffer[31] = 0x01;

        // Offset 8-15: Input Config[8] (8 Bytes) - Die eigentlichen Input-Modi (Input 1-8)
        for (let i = 0; i < 8; i++) {
            buffer[32 + i] = this.inputMode[i];
        }

        // Offset 16-19: Feste Werte (0x01, 0x01, 0x01, 0x01)
        buffer[40] = 0x01;
        buffer[41] = 0x01;
        buffer[42] = 0x01;
        buffer[43] = 0x01;

        // Offset 20-35: Feste Werte (16x 0x00) - bereits durch Uint8Array initialisiert

        // --- Checksum (CRC) ---
        // Berechnung über Length-Field + alle Daten (Bytes 2 bis Ende der Payload)
        // = Bytes 2-59 (Length-Field selbst + Header 20 + Payload 36 = 58 Bytes)
        const checksumStart = 2;
        const checksumEnd = 4 + lengthField; // Position nach allen Daten
        let sum = 0;
        for (let i = checksumStart; i < checksumEnd; i++) {
            sum = (sum + buffer[i]) & 0xFFFF;
        }
        const checksumPos = checksumEnd; // Checksum direkt nach den Daten
        view.setUint16(checksumPos, (~sum + 1) & 0xFFFF, false); // Big Endian

        // --- ETX ---
        const etxPos = checksumPos + 2;
        buffer[etxPos] = 0x03; // ETX

        if (TX_DEBUG) {
            console.log('TX Config Packet (CMD_005):', Array.from(buffer).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
            console.log(`  Length: ${lengthField}, Total: ${totalLen}`);
            console.log(`  Payload Offsets 0-3 (TAId): [${Array.from(buffer.slice(24, 28)).map(b => '0x'+b.toString(16)).join(', ')}]`);
            console.log(`  Payload Offsets 4-7: [${Array.from(buffer.slice(28, 32)).map(b => '0x'+b.toString(16)).join(', ')}]`);
            console.log(`  Payload Offsets 8-15 (Input 1-8 Config): [${Array.from(this.inputMode).map(m => '0x'+m.toString(16)).join(', ')}]`);
            console.log(`  Payload Offsets 16-19: [${Array.from(buffer.slice(40, 44)).map(b => '0x'+b.toString(16)).join(', ')}]`);
        }
        console.log('TX: Created Config Packet (CMD_005) to set input modes.');
        return buffer;
    }
}

async function listen(){//function which calls itself and regularly reads inputs(it might be helpful to include another function which can restart the listening process to prevent connection loss)
    if(charZust==0){
        charZust=1;
        data = type.getread()// get the right command
        writer= connecteddevice.writable.getWriter()
        writer.write(data).then(x=>{ 
            writer.releaseLock()
            reader=connecteddevice.readable.getReader()
            return reader.read() // read some of the incoming values 
        }).then(ans=>{ 
            //console.log('Response received:', ans);
            reader.releaseLock()
            n=0;

            // Buffer for RXC data extension (for fragmented packets)
            let newData = new Uint8Array(ans.value);
            let combined = new Uint8Array(rxBuffer.length + newData.length);
            combined.set(rxBuffer, 0);
            combined.set(newData, rxBuffer.length);
            rxBuffer = combined;


            if (type.name === 'RXC') {
                //console.log(`RXC-Buffer before processing: ${rxBuffer}`);
                // RXC specific logic
                let start = -1;
                let end = -1;
                // Search for header
                for (let i = 0; i < rxBuffer.length - 2; i++) {
                    if (
                        rxBuffer[i] === 0x10 &&
                        rxBuffer[i + 1] === 0x02 &&
                        rxBuffer[i + 2] === 0xB2
                    ) {
                        start = i;
                        break;
                    }
                }
                // Search for end bytes from start
                if (start !== -1) {
                    for (let j = start + 3; j < rxBuffer.length - 1; j++) {
                        if (
                            rxBuffer[j] === 0x10 &&
                            rxBuffer[j + 1] === 0x03
                        ) {
                            end = j + 2; // End index is after ETX
                            break;
                        }
                    }
                }

                if (start !== -1 && end !== -1 && end <= rxBuffer.length) {
                    // Complete packet found
                    let packet = rxBuffer.slice(start, end);
                    // Clean up buffer (everything after the packet remains for later)
                    rxBuffer = rxBuffer.slice(end);

                    let offset = 3; // After header, data starts
                    for (let i = 0; i < type.indIn; i++) {
                        //let err = packet[offset + i * 2];
                        //let val = packet[offset + i * 2 + 1];
                        let currentInputStartIndex = offset + i * 3; 

                        let err = packet[currentInputStartIndex];
                        let val; // Declare val here

                        // Error handling (this part is largely correct, just the indexing for val changes)
                        if (err === 0) {
                            // Get the mode from valWrite to determine how to interpret the value
                            let mode = valWrite[i + type.indOut]; 

                            switch (mode) {
                                case 0x0a: // mV (0-65535)
                                case 0x0c: // Ultraschall (0-65535)
                                    // Combine two bytes for 16-bit value
                                    val = (packet[currentInputStartIndex + 1] << 8) | packet[currentInputStartIndex + 2];
                                    break;
                                case 0x0b: // Ohm (0-65535)
                                    // Same 16-bit logic, then convert
                                    val = (packet[currentInputStartIndex + 1] << 8) | packet[currentInputStartIndex + 2];
                                    val = val > 0 ? 255 : 0; // Your specific conversion for Ohm
                                    break;
                                case 0x0d: // Digital (0/1)
                                    // Digital is likely a single byte value
                                    val = packet[currentInputStartIndex + 1]; // Assuming digital is 1 byte after error
                                    break;
                                default:
                                    val = 0; // Default to 0 if mode is unknown
                                    break;
                            }
                            valIn[i + type.indOut] = val; // Assign the parsed value
                        } else {
                            valIn[i + type.indOut] = 0; // Error, set to 0
                        }
                    }
                    //console.log(`RXC-Buffer after processing: ${rxBuffer}`);
                    success = true;
                } else {
                    //console.log('RXC-Header or ETX not found or packet incomplete!');
                    // Still no complete packet, waiting for more data
                    //console.log('Current RXC buffer:', rxBuffer);
                }
            } else if (type.name === 'ROBO TX Controller') {
                // TX response parsing nach Fish.X1 Protokoll
                // Suche nach kompletten Paketen: STX (0x02) + 'U' (0x55) ... ETX (0x03)
                let start = -1;
                for (let i = 0; i < rxBuffer.length - 1; i++) {
                    if (rxBuffer[i] === 0x02 && rxBuffer[i + 1] === 0x55) {
                        start = i;
                        break;
                    }
                }

                if (start !== -1 && rxBuffer.length >= start + 4) {
                    // Länge auslesen (Big Endian, Offset 2-3 ab start)
                    const view = new DataView(rxBuffer.buffer, rxBuffer.byteOffset + start);
                    const length = view.getUint16(2, false); // Big Endian
                    const totalLength = length + 5; // +2 (STX+U) +2 (Checksum) +1 (ETX)

                    if (rxBuffer.length >= start + totalLength) {
                        // Komplettes Paket vorhanden
                        const packet = rxBuffer.slice(start, start + totalLength);
                        rxBuffer = rxBuffer.slice(start + totalLength);

                        // Parse mit der parseResponse Methode
                        const packetView = new DataView(packet.buffer, packet.byteOffset);
                        const cmd = packetView.getUint32(16, true);  // Little Endian
                        const sid = packetView.getUint16(14, true);  // Little Endian
                        const items = packetView.getUint32(20, true); // Little Endian

                        // Speichere SID für zukünftige Pakete
                        if (sid > 0 && sid !== type.sid) {
                            console.log(`TX: SID updated from ${type.sid} to ${sid}`);
                            type.sid = sid;
                            if (type && type.name === 'ROBO TX Controller' && type.counterValues) {
                                type.counterValues.fill(0);
                            }
                        }
                        
                        // CMD 102 (0x66) = Input/Output Reply
                        // CMD 101 (0x65) = Connect Reply
                        if ((cmd === 105 || cmd === 0x69)) { // CMD_105 (Config Reply)
                            console.log(`TX: Config Reply (CMD_105) received, SID=${sid}, Items=${items}`);
                        }

                        if ((cmd === 102 || cmd === 0x66) && items > 0) {  // CMD_102 (Input/Output Reply mit TA_INPUT)
                            
                            // ===== DEBUG: Komplettes CMD_102 Paket =====
                            if (TX_DEBUG && packet.length >= 68) {
                                console.log('=== TX CMD_102 RAW PACKET ===');
                                console.log('Header (Byte 0-23):  ', Array.from(packet.slice(0, 24)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                console.log('TAId (Byte 24-27):   ', Array.from(packet.slice(24, 28)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                console.log('Inputs (Byte 28-43): ', Array.from(packet.slice(28, 44)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                console.log('State (Byte 44-47):  ', Array.from(packet.slice(44, 48)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                console.log('Counter (Byte 48-55):', Array.from(packet.slice(48, 56)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                console.log('ResetID (Byte 56-59):', Array.from(packet.slice(56, 60)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                console.log('MotorID (Byte 60-67):', Array.from(packet.slice(60, 68)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                if (packet.length > 68) {
                                    console.log('Rest (Byte 68-end): ', Array.from(packet.slice(68, packet.length - 3)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                                }
                                console.log('CRC+ETX (last 3):    ', Array.from(packet.slice(packet.length - 3)).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                            }
                            // ===== END DEBUG =====
                            
                            if (packet.length >= 28 + 16) { // Mindestens Header + TAId + uni[8]

                                // Inputs
                                const taId = packetView.getUint32(24, true);

                                const readU16x8 = (baseOffset) => {
                                    const arr = new Array(8).fill(0);
                                    for (let i = 0; i < 8; i++) {
                                        const offset = baseOffset + i * 2;
                                        if (offset + 1 < packet.length - 3) {
                                            arr[i] = packetView.getUint16(offset, true);
                                        }
                                    }
                                    return arr;
                                };

                                // Input Values (uint16) @ Byte 28-43
                                const inputs = readU16x8(28);

                                // Schreibe Inputs in Scratch-Buffer
                                for (let i = 0; i < 8; i++) {
                                    valIn[i + type.indOut] = inputs[i];
                                }


                                // Counters
                                const counters = new Array(4).fill(0);

                                // Counter Count (uint16) @ Byte 48-55
                                if (packet.length >= 56) {
                                    for (let i = 0; i < 4; i++) {
                                        counters[i] = packetView.getUint16(48 + i * 2, true);
                                        type.counterValues[i] = counters[i];
                                    }
                                }

                                // Counter in valIn hinter die Inputs
                                const counterIndexBase = type.indOut + type.indIn + type.indServo;
                                for (let i = 0; i < 4; i++) {
                                    valIn[counterIndexBase + i] = counters[i];
                                }

                                if (TX_DEBUG) {
                                    console.log(`TX Inputs: I1=${inputs[0]}, I2=${inputs[1]}, I3=${inputs[2]}, I4=${inputs[3]}, I5=${inputs[4]}, I6=${inputs[5]}, I7=${inputs[6]}, I8=${inputs[7]}`);
                                    console.log(`TX Counters: C1=${counters[0]}, C2=${counters[1]}, C3=${counters[2]}, C4=${counters[3]}`);
                                }

                                success = true;
                            }
                        }
                    }
                }
            } else {
                while (n < ans.value.byteLength - 1 - type.inLength) {
                    if (
                        ans.value[n + type.inputOffset] == type.inputHeader[0] &&
                        ans.value[n + type.inputOffset + 1] == type.inputHeader[1] &&
                        ans.value[n + 2 + type.inputOffset] == type.inputHeader[2] &&
                        ans.value[n + 3 + type.inputOffset] == type.inputHeader[3] &&
                        ans.value[n + 4 + type.inputOffset] == type.inputHeader[4] &&
                        ans.value[n + 5 + type.inputOffset] == type.inputHeader[5] &&
                        ans.value[n + 6 + type.inputOffset] == type.inputHeader[6] &&
                        ans.value[n + 7 + type.inputOffset] == type.inputHeader[7]
                    ) {
                        for (var i = 0; i < type.indIn; i = i + 1) {
                            valIn[i + type.indOut] = ans.value[n + 13 + 4 * i];
                            if (ans.value[n + 11 + i * 4] == 10) {
                                valWrite[i + type.indOut] = 0x0a;
                            } else {
                                valWrite[i + type.indOut] = 0x0b;
                            }
                        }
                        success = true;
                        break;
                    } else {
                        n = n + 1;
                    }
                }
            }
            if(read==1&&success==true){// important for change function as we have to make sure that we have read the value after the input mode has been changed 
                read=2
            } 
            charZust=0;
            success=false
        }).catch(error=>{
            console.log(error)
            setTimeout(()=>{// call again after short delay
                listen()
            },5)
        })
        setTimeout(()=>{// call again after short delay
            listen()
        },listentimeout)
    }else{
        setTimeout(()=>{// if we were unable to read, try again 
            listen()
        },0)
    }
}

/**
 * Reads until one of the expected byte patterns appears
 * or the time runs out.
 *
 * @param {number[][]} patterns  List of valid byte arrays, e.g. [[0x02,0xC0],[0x02,0xC2]]
 * @param {number}     timeoutMs Timeout in milliseconds
 * @returns {Promise<{pattern: Uint8Array, data: Uint8Array}|null>}
 */
async function waitForResponse(patterns, timeoutMs) {
    const reader = connecteddevice.readable.getReader();
    const start = Date.now();
    const buffer = []; // All received bytes

    try {
        while (Date.now() - start < timeoutMs) {

            const remaining = timeoutMs - (Date.now() - start);
            const result = await Promise.race([
                reader.read(),
                new Promise(resolve =>
                    setTimeout(() => resolve({ timeout: true }), remaining)
                )
            ]);
            if (result.timeout) {
                console.warn('Timeout: no data received');
                break;
            }
            const { value, done } = result;

            //const { value, done } = await reader.read();
            if (done) break;                  // Stream ended
            if (value) buffer.push(...value); // Received data written to buffer

            // Check each allowed sequence
            for (const pat of patterns) {
                const patLen = pat.length;
                outer: for (let i = 0; i <= buffer.length - patLen; i++) {
                    for (let j = 0; j < patLen; j++) {
                        if (buffer[i + j] !== pat[j]) continue outer;
                    }
                    //console.log('Pattern found:', pat.map(b=>b.toString(16)));
                    return {
                        pattern: new Uint8Array(pat),
                        data:    new Uint8Array(buffer)
                    };
                }
            }
        }
        console.warn('Timeout: no valid pattern received');
        return null;
    } catch (err) {
        console.error('Error reading:', err);
        return null;
    } finally {
        reader.releaseLock();
    }
}

async function readTxFrame(timeoutMs) { // Reads a single Fish.X1 frame from the device
    if (!connecteddevice?.readable) return null;

    const reader = connecteddevice.readable.getReader();
    const start = Date.now();
    let buf = new Uint8Array(0);

    const append = (a, b) => {
        const out = new Uint8Array(a.length + b.length);
        out.set(a, 0);
        out.set(b, a.length);
        return out;
    };

    try {
        while (Date.now() - start < timeoutMs) {
            const remaining = timeoutMs - (Date.now() - start);
            if (remaining <= 0) break;

            const readPromise = reader.read();
            const timeoutPromise = new Promise((resolve) => 
                setTimeout(() => resolve({ value: null, done: false, timeout: true }), remaining)
            );

            const result = await Promise.race([readPromise, timeoutPromise]);
            
            if (result.timeout) {
                // Timeout erreicht
                break;
            }

            const { value, done } = result;
            if (done) break;
            if (!value || value.length === 0) continue;
            buf = append(buf, value);

            // find STX+U
            let stxIndex = -1;
            for (let i = 0; i + 1 < buf.length; i++) {
                if (buf[i] === 0x02 && buf[i + 1] === 0x55) {
                    stxIndex = i;
                    break;
                }
            }

            if (stxIndex < 0) {
                // keep buffer bounded
                if (buf.length > 4096) buf = buf.slice(-4096);
                continue;
            }

            if (stxIndex > 0) buf = buf.slice(stxIndex);
            if (buf.length < 4) continue;

            const view = new DataView(buf.buffer, buf.byteOffset);
            const lengthField = view.getUint16(2, false); // BE
            const frameLen = 2 + 2 + lengthField + 2 + 1; // STX/U + len + (len bytes) + checksum + ETX
            if (buf.length < frameLen) continue;

            const frame = buf.slice(0, frameLen);
            return frame;
        }
        return null;
    } catch (err) {
        console.error('TX: readTxFrame error:', err);
        return null;
    } finally {
        reader.releaseLock();
    }
}

class USBDevice{
    reset(){// clear storage and set all outputs to 0
        for(var i=0; i<(type.indOut+type.indIn+type.indServo); i=i+1){
            for(var n=0; n<stor[i].length; n=n+1){
                stor[i].shift()
            }
        }
        let outCount = (type.name === 'RXC') ? type.indOut : type.indOut/3;
        for(var n=0; n<outCount; n=n+1){
            this.write_Value(n, 0)
        }
    }
    controllertype;
    connected=false;
    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;  
    }
    // getter and setter 
    getstor(ind){
        return stor[ind];
    }
    setstor(ind1,ind2,val){
        stor[ind1][ind2]=val;
    }
    getvalWrite(ind){
        return valWrite[ind];
    }
    setvalWrite(ind,val){
        valWrite[ind]=val
    }
    getvalIn(ind){
        return valIn[ind];
    }
    getfuncstate(ind){
        return funcstate[ind]
    }
    setfuncstate(ind, val){
        funcstate[ind]=val
    }
    getchanging(ind){
        return changing[ind]
    }
    setchanging(ind, val){
        changing[ind]=val;
    }
    getnumruns(ind){
        return numruns[ind]
    }
    setnumruns(ind, val){
        numruns[ind]=val;
    }
    getvalIn(ind){
        return valIn[ind]
    }

    changeInMode2 (args){ // Called By Hats to handle wrong input modes
        if(valWrite[parseInt(args.INPUT)]==0x0b){
            var val=0x0a
        }else{
            var val=0x0b
        }
        if(funcstate[parseInt(args.INPUT)]==0){ // not already chaning 
            read=0// reset the read variable which indicates if the input value has already been read after the imode was changed 
            inputchange[parseInt(args.INPUT)].push(val); // set current value 
            funcstate[parseInt(args.INPUT)]=1; // chnaing 
            list.splice(0, 0, (parseInt(args.INPUT))) // more important than other changes 
            stor[(parseInt(args.INPUT))].splice(0, 0,val)
            if(charZust==0){
                this.write()
            }
        }
        
        if(inputchange[parseInt(args.INPUT)][0]==valWrite[parseInt(args.INPUT)]&&read==0){ // change has occured 
            read=1 // now we wait until we have read the inputs
        }

        if(read==2){// inputs read-> reset all variables
            read=0
            inputchange[parseInt(args.INPUT)].shift();
            funcstate[parseInt(args.INPUT)]=0;
            changing[parseInt(args.INPUT)]=false;
            numruns[parseInt(args.INPUT)]=0;
        }
    }

    changeInMode(args) {
        const input = parseInt(args.INPUT);
        const targetMode = args.TARGET_MODE;
    
        if (valWrite[input] !== targetMode) {
            if (funcstate[input] == 0) {
                read = 0;
                inputchange[input].push(targetMode);
                funcstate[input] = 1;
    
                list.unshift(input);
                stor[input].unshift(targetMode);
    
                if (charZust == 0) {
                    this.write();
                }
            }
    
            if (inputchange[input][0] == valWrite[input] && read == 0) {
                read = 1;
            }
    
            if (read == 2) {
                read = 0;
                inputchange[input].shift();
                funcstate[input] = 0;
                changing[input] = false;
                numruns[input] = 0;
            }
        }
    }

    async write() { // actual write method
        var ind=list[0]
        var pos = ind 
        if(list.length>0){
            if(valWrite[ind]==stor[pos][0]&&ind<(type.indOut+type.indIn+type.indServo)){ //if the output is already up to date--> skip value
                stor[pos].shift()
                list.shift()
                this.write (ind)// write is also a selfcalling method which handels output communication
            }else{
                if(charZust==0&&list.length>0){ // check if channel is free and there are new output values  
                    charZust=1 // blocking communication
                    var val=stor[ind][0]
                    if(ind<type.indOut){ // motor outputs
                        if((valWrite[ind]!=stor[ind][0])&&(valWrite[ind]!=0)&&(stor[ind][0]!=0)){ // do we need to set it to 0 first to avoid sudden changes?
                            data = type.getwriteOut(ind,0)// returns the data in the right format for the specified controller 
                            writer = connecteddevice.writable.getWriter()
                            await writer.write(data).then(async x=>{ 
                                writer.releaseLock()
                                //console.log("Await write 0");
                                if (type.hasResponse) {
                                    const legitPatterns = [
                                        [0x02, 0xC0],   // first allowed header
                                        [0x02, 0xC2]    // second allowed header
                                    ];
                                    //console.log('Awaiting response after write 0');
                                    const result = await waitForResponse(legitPatterns, 5000); // Timeout e.g. 5 seconds
                                    if (result) {
                                        //console.log('Response received:', result.data);
                                    } else {
                                        //console.log('Response not received or timeout');
                                    }
                                    //let reader = connecteddevice.readable.getReader();
                                    //let ans = await reader.read();
                                    //reader.releaseLock();
                                    //console.log('Response after write 0:', ans);

                                    //reader = connecteddevice.readable.getReader();
                                    //let ans2 = await reader.read();
                                    //reader.releaseLock();
                                    //console.log('Response after write 0 (second read):', ans2);

                                    return result.data;
                                } else {
                                    return Promise.resolve();
                                } // before was here 5
                            }).then(async x=>{  //Writing different motor outputs might also work with one command which simultaneously changes output values
                                data =  type.getwriteOut(ind,stor[ind][0])
                                writer= connecteddevice.writable.getWriter()
                                await writer.write(data)
                            }).then(async x=>{
                                writer.releaseLock()
                                //console.log("Awaiting write target");
                                if (type.hasResponse) {
                                    const legitPatterns = [
                                        [0x02, 0xC0],   // first allowed header
                                        [0x02, 0xC2]    // second allowed header
                                    ];
                                    //console.log('Awaiting response after write target');
                                    const result = await waitForResponse(legitPatterns, 5000); // Timeout e.g. 5 seconds
                                    if (result) {
                                        //console.log('Response received:', result.data);
                                    } else {
                                        //console.log('Response not received or timeout');
                                    }
                                    //let reader = connecteddevice.readable.getReader();
                                    //let ans = await reader.read();
                                    //reader.releaseLock();
                                    //console.log('Response after write target:', ans);

                                    //reader = connecteddevice.readable.getReader();
                                    //let ans2 = await reader.read();
                                    //reader.releaseLock();
                                    //console.log('Response after write target (second read):', ans2);

                                    return result.data;
                                } else {
                                    return Promise.resolve();
                                } // before was here 5
                            }).then(x=>{ 
                                charZust=0;
                                valWrite[ind]=val
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                console.log(error)
                                this.write()
                            })
                        }else{
                            data = type.getwriteOut(ind,stor[ind][0])
                            writer = connecteddevice.writable.getWriter()
                            await writer.write(data).then(x=>{ 
                                writer.releaseLock()
                                //console.log("Awaiting write target");
                                return 5
                            }).then(async x=>{ 
                                if (type.hasResponse) {
                                    const legitPatterns = [
                                        [0x02, 0xC0],   // first allowed header
                                        [0x02, 0xC2]    // second allowed header
                                    ];
                                    //console.log('Awaiting response after write target 2');
                                    const result = await waitForResponse(legitPatterns, 5000); // Timeout e.g. 5 seconds
                                    if (result) {
                                        //console.log('Response received:', result.data);
                                    } else {
                                        //console.log('Response not received or timeout');
                                    }
                                    return result.data;
                                } else {
                                    return Promise.resolve();
                                }
                            }).then(x=>{
                                valWrite[ind]=val
                                charZust=0;
                                stor[ind].shift();
                                list.shift();
                                this.write()
                            }).catch(error=>{
                                console.log(error)
                                this.write()
                            })
                        }
                    }else if(ind<(type.indOut+type.indIn)){ // input mode
                        //console.log('Writing input mode for input ' + (ind - type.indOut) + ' with value ' + stor[pos][0]);
                        data = type.getwriteInMode(pos-type.indOut, stor[pos][0])
                        writer = connecteddevice.writable.getWriter()
                        await writer.write(data).then(x=>{ 
                            writer.releaseLock()
                            return 5
                        }).then(async x=>{ 
                            if (type.hasResponse) {
                                const legitPatterns = [
                                    [0x02, 0xB0],   // first allowed header
                                    [0x02, 0xB1]    // second allowed header
                                ];
                                //console.log('Awaiting response after write input mode');
                                const result = await waitForResponse(legitPatterns, 5000); // Timeout e.g. 5 seconds
                                    if (result) {
                                        //console.log('Response received:', result.data);
                                    } else {
                                        //console.log('Response not received or timeout');
                                    }
                                return result.data;
                            } else {
                                return Promise.resolve();
                            }
                        }).then(result => {
                            charZust=0;
                            valWrite[pos]=val
                            list.shift();
                            stor[pos].shift();
                            this.write()
                        }).catch(error=>{
                            console.log(error)
                            this.write()
                        })
                    }else if (ind<(type.indOut+type.indIn+type.indServo)){ // servo
                        //servomotors can be written here 
                    }else if (ind === 34){ // led
                        data = type.getwriteLED();
                        writer = connecteddevice.writable.getWriter();
                        writer.write(data).then(x => {
                            writer.releaseLock();
                            charZust = 0;
                            stor[ind].shift();
                            list.shift();
                            this.write();
                        }).catch(error => {
                            console.log(error);
                            this.write();
                        });
                    }else{ // counter reset
                        data = type.getwriteCounterreset(ind - (type.indOut + type.indIn + type.indServo));
                        writer = connecteddevice.writable.getWriter();
                        await writer.write(data).then(x => {
                            writer.releaseLock();
                            charZust = 0;
                            stor[ind].shift();
                            list.shift();
                            this.write();
                        }).catch(error => {
                            console.log(error);
                            charZust = 0;
                            this.write();
                        });
                    }
                }else{
                    setTimeout(()=>{// write function will call itself after delay 
                        this.write()
                    },2)
                }
            }
        }else{
            setTimeout(()=>{
                this.write()
            },2)
        }
    }

    write_Value(ind, val){ // writing handler--> this is the function any block should call
        if((ind<type.indOut)&&val>127){// value entered is larger than 8 
            var res=127
            if(notificationTimer==0){
                translate.setup();
                if(Notification.permission == "granted"){
                    const help = new Notification(translate._getText('range',this.locale),{
                        body: translate._getText('maximum',this.locale),
                    })
                }
            notificationTimer=1
            setTimeout(()=>{ 
                notificationTimer=0;
            },50000)
        }
        }else{
            var res=val
        }
        if(stor[ind].length<5){ //if the que gets to long (values are added faster than deleted, we only safe the last values )
            list.push(ind)
            stor[ind].push(res)// add value to queue
            if (charZust[ind]==0){ // if nothig is being changed
                this.write(ind);
            }
        }else{
            stor[ind].splice(4,1)
            stor[ind].push(res)
        }
    }

    async connect(){// connect to controller 
        switch(this.controllertype){
            case 'BTSmart':
                type= new BTSmart;
            break;
            case 'RX':
                type= new RX;
            break;
            case 'TX':
                type= new TX;
            break;
        }
        return connect = new Promise ((resolve, reject) =>{
            navigator.serial.requestPort({filters:[{usbVendorId: type.usbVendorId, usbProductId: type.usbProductId}]}).then((port) => {
                connecteddevice = port
                console.log('Connecting');
                return port.open({baudRate: type.baudRate})
            }).then((data) => {
                writer = connecteddevice .writable.getWriter();
                data = type.getwriteLED()
                return writer.write(data)
            }).then(async (data) => {
                writer.releaseLock()

                // --- TX Controller Handshake --- (kann eig entfernt werden)
                if (type.name === 'ROBO TX Controller') {
                    console.log("TX: Waiting for Handshake Response...");
                    try {
                        const frame = await readTxFrame(1500);
                        if (!frame) {
                            console.warn('TX: Handshake timed out (no Fish.X1 frame)');
                        } else {
                            if (TX_DEBUG) {
                                console.log("TX: Handshake Frame:", Array.from(frame).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                            }
                            const view = new DataView(frame.buffer, frame.byteOffset);
                            const sid = view.getUint16(14, true);
                            const cmd = view.getUint32(16, true);
                            console.log(`TX: Handshake CMD=${cmd} (0x${cmd.toString(16)}), SID=${sid}`);

                            if (cmd === 101 || cmd === 0x65) {
                                type.sid = sid;
                            } else {
                                console.warn("TX: Unexpected CMD in handshake:", cmd);
                            }
                        }
                    } catch (e) {
                        console.error("TX Handshake error:", e);
                    }

                    // TX: Sende Config Packet (CMD_005) um Input-Modi zu setzen
                    console.log(`TX: Sending Config Packet (CMD_005) to set input modes... (SID=${type.sid})`);
                    
                    for (let i = 0; i < 8; i++) {
                        type.inputMode[i] = 0x81; // 0x81 = Widerstand 5k Analog
                        valWrite[i + type.indOut] = 0x0b;
                    }
                    
                    const configData = type.createConfigPacket();
                    writer = connecteddevice.writable.getWriter();
                    await writer.write(configData);
                    writer.releaseLock();

                    let response = await readTxFrame(1500);
                    if (!response) {
                        console.warn('TX: No response to Config Packet (CMD_005)');
                    } else {
                        if (TX_DEBUG) {
                            console.log("TX: Config Response Frame:", Array.from(response).map(b => '0x' + b.toString(16).padStart(2, '0')).join(' '));
                        }
                        const respView = new DataView(response.buffer, response.byteOffset);
                        const respCmd = respView.getUint32(16, true);
                        if (respCmd === 105 || respCmd === 0x69) {
                            console.log("TX: Config Packet (CMD_005) acknowledged.");
                        } else {
                            console.warn("TX: Unexpected CMD in Config response:", respCmd);
                        }
                    }
                    
                    // Kurz warten damit Config verarbeitet wird
                    await new Promise(resolve => setTimeout(resolve, 200));
                    console.log("TX: Config sent, continuing...");
                }
                // -------------------------------

                success=false
                charZust=0;
                read=0
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                    inputchange[i]=[]
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                //30-35
                for(var i=30; i<36; i=i+1){// set all varibles for sound, led etc.
                    inputchange[i]=[]
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                console.log('Connected to device type: ' + type.name);

                setTimeout(()=>{
                    listen()// setup the two selfcalling functions
                    this.write()
                    this.connected=true
                    buttonpressed = false
                    resolve (connecteddevice)
                },2000)  
            }).catch(error => {
                reject(error);
            });
        })
    }

    async autoconnect(){// connect to controller 
        return autoconnect = new Promise ((resolve, reject) =>{ // try to automatically connect
            navigator.serial.getPorts({}).then((ports) => {// get all port we have access to 
                console.log(`Total devices: ${ports.length}`);
                ports.forEach((port) => {
                    if(port.getInfo().usbProductId==5){
                        connecteddevice=port// save device for later use
                        type= new BTSmart;
                    }//elif(){} additional usb controllers 
                }); 
                //console.log(ports)
                if(connecteddevice==undefined){
                    reject('no');
                }
                //console.log(connecteddevice)
                return connecteddevice.open({baudRate: type.baudRate})
            }).then((data) => { 
                writer = connecteddevice .writable.getWriter();
                data = type.getwriteLED()                
                return writer.write(data)
            }).then((data) => {
                writer.releaseLock()
                charZust=0;
                success=false
                read=0
                for(var i=0; i<(type.indOut+type.indIn+type.indServo+type.indOut/3); i=i+1){// set all varibles 
                    inputchange[i]=[]
                    funcstate[i]=0;
                    changing[i]=false
                    numruns[i]=0
                    stor[i]=[]
                }
                //30-35
                for(var i=30; i<36; i=i+1){// set all varibles for sound, led etc.
                    inputchange[i] = [];
                    funcstate[i] = 0;
                    changing[i] = false;
                    numruns[i] = 0;
                    stor[i] = [];
                }
                listen()// setup the two selfcalling functions 
                this.write()
                this.connected=true
                resolve (connecteddevice)    
            }).catch(error => {
                reject(error);
            });
        })
    }
}

module.exports = USBDevice;