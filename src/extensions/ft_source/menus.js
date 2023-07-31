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
}

module.exports = Menus;