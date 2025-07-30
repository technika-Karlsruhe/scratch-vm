class Menus{
  constructor(runtime){
    this.runtime = runtime;
    translate.setup();
  }

  setup(){
    translate.setup();
  }

  inputModes(){
    const d10v= {}
    const d5k= {}
    const a10v= {}
    const a5k= {}
    const inputModes=[d10v,d5k,a10v,a5k]
    d10v.text=translate._getText('Digitalvoltage')
    d10v.value='d10v'
    d5k.text=translate._getText('Digitalresistance')
    d5k.value='d5k'
    a10v.text=translate._getText('Analoguevoltage')
    a10v.value='a10v'
    a5k.text=translate._getText('Analogueresistance')
    a5k.value='a5k'
    return inputModes
  }

  inputModes2(){
    const d10v= {}
    const d5k= {}
    const a10v= {}
    const a5k= {}
    const ultrasonic= {}
    const inputModes=[d10v,d5k,a10v,a5k,ultrasonic]
    d10v.text=translate._getText('Digitalvoltage')
    d10v.value='d10v'
    d5k.text=translate._getText('Digitalresistance')
    d5k.value='d5k'
    a10v.text=translate._getText('Analoguevoltage')
    a10v.value='a10v'
    a5k.text=translate._getText('Analogueresistance')
    a5k.value='a5k'
    ultrasonic.text=translate._getText('DistanceSensor')
    ultrasonic.value='ultrasonic'
    return inputModes
  }

  inputAnalogSensorTypes(){
    const sens_color= {}
    const sens_ntc= {}
    const sens_photo= {}
    const inputAnalogSensorTypes=[sens_color,sens_ntc,sens_photo]
    sens_color.text=translate._getText('ColorSensor')
    sens_color.value='sens_color'
    sens_ntc.text=translate._getText('NTCResistor')
    sens_ntc.value='sens_ntc'
    sens_photo.text=translate._getText('PhotoResistor')
    sens_photo.value='sens_photo'
    return inputAnalogSensorTypes
  }

  inputAnalogSensorTypes2(){
    const sens_color= {}
    const sens_ntc= {}
    const sens_photo= {}
    const sens_distance= {}
    const inputAnalogSensorTypes=[sens_color,sens_ntc,sens_photo,sens_distance]
    sens_color.text=translate._getText('ColorSensor')
    sens_color.value='sens_color'
    sens_ntc.text=translate._getText('NTCResistor')
    sens_ntc.value='sens_ntc'
    sens_photo.text=translate._getText('PhotoResistor')
    sens_photo.value='sens_photo'
    sens_distance.text=translate._getText('DistanceSensor')
    sens_distance.value='sens_distance'
    return inputAnalogSensorTypes
  }

  inputDigitalSensorTypes(){
    const sens_button= {}
    const sens_lightBarrier= {}
    const sens_reed= {}
    const sens_trail= {}
    const inputDigitalSensorTypes=[sens_button,sens_lightBarrier,sens_reed,sens_trail]
    sens_button.text=translate._getText('Button')
    sens_button.value='sens_button'
    sens_lightBarrier.text=translate._getText('Lightbarrier')
    sens_lightBarrier.value='sens_lightBarrier'
    sens_reed.text=translate._getText('Reedcontact')
    sens_reed.value='sens_reed'
    sens_trail.text=translate._getText('TrailSensor')
    sens_trail.value='sens_trail'
    return inputDigitalSensorTypes
  }

  inputDigitalSensorChangeTypes(){
    const open= {}
    const closed= {}
    const inputDigitalSensorChangeTypes=[open,closed]
    open.text=translate._getText('Open')
    open.value='open'
    closed.text=translate._getText('Closed')
    closed.value='closed'
    return inputDigitalSensorChangeTypes
  }

  motorDirection(){
    const forward= {}
    const backwards= {}
    const motorDirection=[forward,backwards]
    forward.text=translate._getText('Forward')
    forward.value='1'
    backwards.text=translate._getText('Backwards')
    backwards.value='-1'
    return motorDirection
  }

  compares(){
    const greater= {}
    const less= {}
    const compares=[greater,less]
    greater.text='>'
    greater.value='>'
    less.text='<'
    less.value='<'
    return compares
  }

  soundfiles(){
    const files = [
      '01_Airplane', '02_Alarm', '03_Bell', '04_Braking', '05_Car_horn_long',
      '06_Car_horn_short', '07_Crackling_wood', '08_Excavator', '09_Fantasy_1',
      '10_Fantasy_2', '11_Fantasy_3', '12_Fantasy_4', '13_Farm', '14_Fire_department',
      '15_Fire_noises', '16_Formula1', '17_Helicopter', '18_Hydraulic', '19_Motor_sound',
      '20_Motor_starting', '21_Propeller_airplane', '22_Roller_coaster', '23_Ships_horn',
      '24_Tractor', '25_Truck', '26_Augenzwinkern', '27_Fahrgeraeusch', '28_Kopf_heben',
      '29_Kopf_neigen'
    ];
  
    return files.map(filename => ({
      text: filename + '.wav',
      value: filename + '.wav'
    }));
  }

  LOOP(){
    const yes= {}
    const no= {}
    const loop=[yes,no]
    yes.text=translate._getText('yes')
    yes.value='yes'
    no.text=translate._getText('no')
    no.value='no'
    return loop
  }

  ledState(){
    const on= {}
    const off= {}
    const ledState=[on,off]
    on.text=translate._getText('on')
    on.value='1'
    off.text=translate._getText('off')
    off.value='0'
    return ledState
  }

  ledStatebt(){
    const blue= {}
    const orange= {}
    const ledState=[blue,orange]
    blue.text=translate._getText('blue')
    blue.value='0'
    orange.text=translate._getText('orange')
    orange.value='1'
    return ledState
  }
}

module.exports = Menus;