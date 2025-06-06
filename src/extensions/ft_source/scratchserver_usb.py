from fischertechnik.controller.Motor import Motor
import fischertechnik.factories as txt_factory
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver
HOST = "192.168.7.2"  # txt 4.0
PORT = 8000  # Port to listen on (non-privileged ports are > 1023)
inputs = [0x0b, 0x0b, 0x0b, 0x0b,0x0b, 0x0b,0x0b, 0x0b]
input = []
counter  = []
output = []
servo = []
motors = []
class NewHTTP(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*"),
        self.end_headers()
        ##TXT_M_I1_color_sensor.get_voltage()
        ##result = { "i1":str(TXT_M_I1_mini_switch.get_resistance())}
        result = dict()
        for i in range(8):
            if(inputs[i] == 0x0b):
                result.update({ "i"+str(i+1) : str(input[i].get_resistance())})
            elif(inputs[i] == 0x0a):
                result.update({ "i"+str(i+1) : str(input[i].get_voltage())})
            elif(inputs[i] == 0x0c):
                result.update({ "i"+str(i+1) : str(input[i].get_distance())})
        for n in range(4):
            result.update({ "c"+str(n+1) : str(counter[n].get_count())})
        self.wfile.write(bytes(json.dumps(result), "utf-8"))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*"),
        self.send_header("Access-Control-Allow-Headers", "*"),
        self.end_headers()


    def do_POST(self):
        content_len = int(self.headers.get("Content-Length"))
        post_body = self.rfile.read(content_len)
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*"),
        self.end_headers()
        post_body = json.loads(post_body.decode("utf-8"))

        if "cmd" in post_body:
            if post_body["cmd"] == "play_sound":
                
                TXT_M.get_loudspeaker().play(post_body["val"], post_body["loop"])
                self.wfile.write(bytes("ok", "utf-8"))

            elif post_body["cmd"] == "stop_sound":
                    
                TXT_M.get_loudspeaker().stop()
                self.wfile.write(bytes("ok", "utf-8"))

        if(str(post_body["port"])[0] == "i"):
            self.wfile.write(self.changein(post_body))
        elif(str(post_body["port"])[0] == "c"):
            counter[int(str(post_body["port"])[1])-1].reset()
            self.wfile.write(bytes("ok", "utf-8"))
        elif(str(post_body["port"])[0] == "o"):
            self.wfile.write(self.setout(post_body))
        elif(str(post_body["port"])[0] == "m"):
            self.wfile.write(self.setmotor(post_body))
        elif(str(post_body["port"])[0] == "s"):
            self.wfile.write(self.setservo(post_body))
        else:
            self.wfile.write(bytes("undefined", "utf-8"))

    def changein(self, post_body):
        try:
            val = post_body["val"]
            if(val == 0x0a):
                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_color_sensor(TXT_M, int(str(post_body["port"])[1]))
                inputs[int(str(post_body["port"])[1])-1] = 0x0a
                return bytes("ok", "utf-8")
            elif(val == 0x0b):
                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_photo_resistor(TXT_M, int(str(post_body["port"])[1]))
                inputs[int(str(post_body["port"])[1])-1] = 0x0b
                return bytes("ok", "utf-8")
            elif(val == 0x0c):
                input[int(str(post_body["port"])[1])-1] = txt_factory.input_factory.create_ultrasonic_distance_meter(TXT_M, int(str(post_body["port"])[1]))
                inputs[int(str(post_body["port"])[1])-1] = 0x0c
                return bytes("ok", "utf-8")
            else:
                return bytes("mode not defined", "utf-8")
        except Exception as e:
            return bytes("error:"+str(e), "utf-8")

    def setout(self, post_body):
        try:
            val = int(str(post_body["val"]))
            output[int(str(post_body["port"])[1])-1].set_brightness(val)
            return bytes("ok", "utf-8")
        except Exception as e:
            return bytes("error:"+str(e), "utf-8")

    def setmotor(self, post_body):
        #try:
        #    val = int(str(post_body["val"]))
        #    if(val>0):
        #        output[int(str(post_body["port"])[1])].set_brightness(0)
        #        output[int(str(post_body["port"])[1])-1].set_brightness(val)
        #    else:
        #        output[int(str(post_body["port"])[1])].set_brightness(val*(-1))
        #        output[int(str(post_body["port"])[1])-1].set_brightness(0)
        #    return bytes("ok", "utf-8")
        #except Exception as e:
        #    return bytes("error:"+str(e), "utf-8")
        #
        try:
            val = int(str(post_body["val"]))
            motor_index = int(str(post_body["port"])[1]) - 1

            motor = motors[motor_index]

            if val > 0:
                motor.set_speed(val, Motor.CW)
                motor.start()
            elif val < 0:
                motor.set_speed(abs(val), Motor.CCW)
                motor.start()
            else:
                motor.stop()

            return bytes("ok", "utf-8")
        except Exception as e:
            return bytes("error:" + str(e), "utf-8")

    def setservo(self, post_body):
        try:
            val = int(str(post_body["val"]))
            servo[int(str(post_body["port"])[1])-1].set_position(val)
            return bytes("ok", "utf-8")
        except Exception as e:
            return bytes("error:"+str(e), "utf-8")

server = HTTPServer((HOST, PORT ), NewHTTP) ##server is started
txt_factory.init()
txt_factory.init_input_factory()
txt_factory.init_motor_factory()
txt_factory.init_counter_factory()
txt_factory.init_usb_factory()
txt_factory.init_camera_factory()
txt_factory.init_output_factory()
txt_factory.init_servomotor_factory()
txt_factory.init_i2c_factory()


TXT_M = txt_factory.controller_factory.create_graphical_controller()
for x in range (8):
    input.append(txt_factory.input_factory.create_photo_resistor(TXT_M, x+1))
for x in range (4):
    counter.append(txt_factory.counter_factory.create_mini_switch_counter(TXT_M, x+1))
for x in range (8):
    output.append(txt_factory.output_factory.create_led(TXT_M, x+1))
for x in range(3):
    servo.append(txt_factory.servomotor_factory.create_servomotor(TXT_M, x+1))
for x in range(4):
    motors.append(txt_factory.motor_factory.create_motor(TXT_M, x+1))

txt_factory.initialized()
server.serve_forever() ##runs infinitely
