const Translation = require('../ft_source/translation');
var translate = new Translation();


class Menus{
  constructor(runtime){
    this.runtime = runtime;
    translate.setup();
  }
  setup(){
    translate.setup();
  }

  outputID(){
    const b= {}
    const c= {}
    const a=[b,c]
    b.text=translate._getText('Digitalvoltage',this.locale),
    b.value=1
    c.text='M2'
    c.value=2
    return a
  }
  inputID(){
    return{
    inputID: [
      {text: 'I1', value: '2'},
      {text: 'I2', value: '3'},
      {text: 'I3', value: '4'},
      {text: 'I4', value: '5'}
    ]
  }
  }
  inputModes(){
    return{
    inputModes: [
      {text: translate._getText('Digitalvoltage',this.locale), value: 'd10v'},
      {text: translate._getText('Digitalresistance',this.locale), value: 'd5k'},
      {text: translate._getText('Analoguevoltage',this.locale), value: 'a10v'},
      {text: translate._getText('Analogueresistance',this.locale), value: 'a5k'}
    ]
  }
  }
  inputAnalogSensorTypes(){
    return{
    inputAnalogSensorTypes: [
      {text: translate._getText('ColorSensor'), value: 'sens_color'},
      {text: translate._getText('NTCResistor'), value: 'sens_ntc'},
      {text: translate._getText('PhotoResistor'), value: 'sens_photo'}
    ]
  }
  }
  inputDigitalSensorTypes(){
    return{
    inputDigitalSensorTypes: [
      {text: translate._getText('Button'), value: 'sens_button'},
      {text: translate._getText('Lightbarrier'), value: 'sens_lightBarrier'},
      {text: translate._getText('Reedcontact'), value: 'sens_reed'},
      {text: translate._getText('TrailSensor'), value:'sens_trail'}
    ]
  }
  }
  inputDigitalSensorChangeTypes(){
    return{
    inputDigitalSensorChangeTypes: [
      {text: translate._getText('Open'), value: 'open'},
      {text: translate._getText('Closed'), value: 'closed'}
    ]
  }
  }
  motorDirection(){
    return{
    motorDirection: [
      {text: translate._getText('Forward'), value: '1'},
      {text: translate._getText('Backwards'), value: '-1'}
    ]
  }
  }
  compares(){
    return{
    compares: ['<', '>']
  }
  }
}

module.exports = Menus;
