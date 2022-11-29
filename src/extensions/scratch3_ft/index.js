/*
  scratch3_ft/index.js
*/
 
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Block = require('../scratch3_ft/block');
var serviceOut;
var serviceIn;
var serviceIMode;
var charM1;
var charM2;
var charI1;
var charI2;
var charI3;
var charI4;
var charIM1;
var charIM2;
var charIM3;
var charIM4;
//Die Characteristics die wir später definieren ud dann überschreiben können 

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjQwcHgiCiAgIGhlaWdodD0iNDBweCIKICAgdmlld0JveD0iMCAwIDQwIDQwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczMiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXczNCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxNi41NSIKICAgICBpbmtzY2FwZTpjeD0iMTkuOTY5Nzg5IgogICAgIGlua3NjYXBlOmN5PSIyNC44MzM4MzciCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJldjMiIC8+CiAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZXYzLWJsb2NrLWljb248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2M0Ij5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZGVmcwogICAgIGlkPSJkZWZzNiIgLz4KICA8ZwogICAgIGlkPSJldjMtYmxvY2staWNvbiIKICAgICBzdHJva2U9Im5vbmUiCiAgICAgc3Ryb2tlLXdpZHRoPSIxIgogICAgIGZpbGw9Im5vbmUiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnCiAgICAgICBpZD0iZXYzIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS41MDAwMDAsIDMuNTAwMDAwKSIKICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgIDxyZWN0CiAgICAgICAgIGlkPSJSZWN0YW5nbGUtcGF0aCIKICAgICAgICAgc3Ryb2tlPSIjN0M4N0E1IgogICAgICAgICBmaWxsPSIjRkZGRkZGIgogICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgIHg9IjAuNSIKICAgICAgICAgeT0iMy41OSIKICAgICAgICAgd2lkdGg9IjI4IgogICAgICAgICBoZWlnaHQ9IjI1LjgxIgogICAgICAgICByeD0iMSIKICAgICAgICAgc3R5bGU9ImZpbGw6IzAwMDBmZjtzdHJva2U6IzAwMDA4MCIgLz4KICAgICAgPHRleHQKICAgICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToyMS4zMzMzcHg7bGluZS1oZWlnaHQ6MTAwJTtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7dGV4dC1hbGlnbjpjZW50ZXI7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7dGV4dC1hbmNob3I6bWlkZGxlO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgIHg9IjEzLjQ3MjgwOSIKICAgICAgICAgeT0iMjQuNjU3MDk5IgogICAgICAgICBpZD0idGV4dDE2MzMiPjx0c3BhbgogICAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgICAgaWQ9InRzcGFuMTYzMSIKICAgICAgICAgICB4PSIxMy40NzI4MDkiCiAgICAgICAgICAgeT0iMjQuNjU3MDk5Ij5mdDwvdHNwYW4+PC90ZXh0PgogICAgPC9nPgogIDwvZz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE4NTEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+ZXYzLWJsb2NrLWljb248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=='

/**
 * Class for the ft blocks in Scratch 3.0
 * @constructor
 */

const EXTENSION_ID = 'ft';

function knopf() {  //Button der gedrückt wird ruft das auf
	if (img.getAttribute("src")== ftDisconnectedIcon){  //ändert Bild
		img.setAttribute("src", ftConnectedIcon);
		img.setAttribute("height", "32px");
	} else {
		img.setAttribute("src", ftDisconnectedIcon);
	} 
        navigator.bluetooth.requestDevice({
            filters: [{ name: 'BT Smart Controller' }],
            optionalServices: ['8ae883b4-ad7d-11e6-80f5-76304dec7eb7', '8ae87702-ad7d-11e6-80f5-76304dec7eb7', '8ae8952a-ad7d-11e6-80f5-76304dec7eb7', '8ae88d6e-ad7d-11e6-80f5-76304dec7eb7', ]
        }).then(device => {
            console.log("Device found. Connecting ...");
            return device.gatt.connect();       
        }).then(server => {
            console.log("Connected. Searching for output service ...");
            return server.getPrimaryServices() ;
        }).then(services => {
            console.log("Service found. Requesting characteristic ...");
			console.log (services.map(s =>s.uuid).join('\n' + ' '.repeat(19)));
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae883b4-ad7d-11e6-80f5-76304dec7eb7'){
					serviceOut=services[i]
						i=10}}; // wichtig... müssen wir für jeden service so implementieren, dann alle Characteristics einzeln einmal übernemen, dann kann man die recht simpel überschreiben 
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae8952a-ad7d-11e6-80f5-76304dec7eb7'){
					serviceIn=services[i]
						i=10}};
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae88d6e-ad7d-11e6-80f5-76304dec7eb7'){
					serviceIMode=services[i]
						i=10}};
			console.log("f"+f);
			for(i=0; i<4; i=i+1){
				console.log(i+services[i].uuid);
				if(services[i].uuid=='8ae87702-ad7d-11e6-80f5-76304dec7eb7'){
					return services[i].getCharacteristic('8ae87e32-ad7d-11e6-80f5-76304dec7eb7');
				i=10; }};
        }).then(characteristic => {
            console.log("Characteristic found.");
            characteristic.writeValue(new Uint8Array([1]));
            d=characteristic;
            return 5;
		}).then(x => {
		 	return serviceOut.getCharacteristic('8ae8860c-ad7d-11e6-80f5-76304dec7eb7'); 
		}).then(characteristic =>{
			characteristic.writeValue(new Uint8Array([127]));
			charM1=characteristic;
			return 5;
		}).then(x => {
			return serviceOut.getCharacteristic('8ae88b84-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   characteristic.writeValue(new Uint8Array([0]));
		   charM2=characteristic;
		   return 5;
		}).then(x => {
			return serviceIn.getCharacteristic('8ae89a2a-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charI1=characteristic;
		   return 5;
		}).then(x => {
			return serviceIn.getCharacteristic('8ae89bec-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charI2=characteristic;
		   return 5;
		}).then(x => {
			return serviceIn.getCharacteristic('8ae89dc2-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charI3=characteristic;
		   return 5;
		}).then(x => {
			return serviceIn.getCharacteristic('8ae89f66-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charI4=characteristic;
		   return 5;
		}).then(x => {
			return serviceIMode.getCharacteristic('8ae88efe-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charIM1=characteristic;
		   return 5;
		}).then(x => {
			return serviceIMode.getCharacteristic('8ae89084-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charIM2=characteristic;
		   return 5;
		}).then(x => {
			return serviceIMode.getCharacteristic('8ae89200-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charIM3=characteristic;
		   return 5;
		}).then(x => {
			return serviceIMode.getCharacteristic('8ae89386-ad7d-11e6-80f5-76304dec7eb7'); 
	   	}).then(characteristic =>{
		   charIM4=characteristic;
		return 5;
	   	}).then(characteristic =>{
		alert("Der Controller ist nun einsatzbereit")
	   	}).catch(error => {
			console.log("Error: " + error);
		});
		//Abfrage von Allen chars auf einmal
}


const PARENT_CLASS="controls_controls-container_3ZRI_";
const FT_BUTTON_ID = "ftDuino_connect_button";

const ftConnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjguODQyIDEuMDU2Ny01LjIzMDIgNS4yMzAyLTIuODQ4Ni0yLjg0ODZjLTEuMTk1NS0xLjE5NTUtMi45NjA3LTEuMTk1NS00LjE1NjEgMGwtMy43MzU4IDMuNzM1OC0xLjQ5NDMtMS40OTQzLTIuMTAxNCAyLjEwMTQgMTQuOTQzIDE0Ljk0MyAyLjEwMTQtMi4xMDE0LTEuNDk0My0xLjQ5NDMgMy43MzU4LTMuNzM1OGMxLjE5NTUtMS4xOTU1IDEuMTk1NS0yLjk2MDYgMC00LjE1NjFsLTIuODQ4Ni0yLjg0ODYgNS4yMzAyLTUuMjMwMnptLTIxLjIwMSA4LjM1ODktMi4xMDE0IDIuMTAxNCAxLjQ5NDMgMS40OTQzLTMuNTk1NyAzLjU5NTdjLTEuMTk1NSAxLjE5NTUtMS4xOTU1IDIuOTYwNyAwIDQuMTU2MWwyLjg0ODYgMi44NDg2LTUuMjMwMiA1LjIzMDIgMi4xMDE0IDIuMTAxNCA1LjIzMDItNS4yMzAyIDIuODQ4NiAyLjg0ODZjMS4xOTU1IDEuMTk1NSAyLjk2MDcgMS4xOTU1IDQuMTU2MSAwbDMuNTk1Ny0zLjU5NTcgMS40OTQzIDEuNDk0MyAyLjEwMTQtMi4xMDE0eiIgZmlsbD0iIzFhZmYxNCIgb3ZlcmZsb3c9InZpc2libGUiIHN0cm9rZT0iIzAyOTEwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ5NDMiIHN0eWxlPSJ0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmUiLz4KPC9zdmc+Cg==';

const ftNoWebUSBIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjQuOTg3IDEuMjMwMi05LjA4MTggOS4yMDU5LTkuMDIyOC05LjE5ODItNS41NTg0IDUuNDgwOCA5LjA5OSA5LjI3NDYtOS4xNTggOS4yODIyIDUuNTQ1IDUuNDk2IDkuMDc5OS05LjIwNTkgOS4wODk1IDkuMjY1IDUuNTU4NC01LjQ4MDgtOS4xNjM3LTkuMzQxNCA5LjE1NjEtOS4yODIyeiIgY29sb3I9IiMwMDAwMDAiIGNvbG9yLXJlbmRlcmluZz0iYXV0byIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZpbGw9IiNmZjE0MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaW1hZ2UtcmVuZGVyaW5nPSJhdXRvIiBzaGFwZS1yZW5kZXJpbmc9ImF1dG8iIHNvbGlkLWNvbG9yPSIjMDAwMDAwIiBzdHJva2U9IiM3MDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NjM4IiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIi8+Cjwvc3ZnPgo=';

const ftDisconnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjAuMjAyIDAuOTQ3NWMtMC43NDcwNyAwLTEuNTAzNCAwLjI5MDU2LTIuMTAxMiAwLjg5MDQ1bC0yLjI0MTIgMi4yNDk2LTEuNDk0Mi0xLjQ5OTctMi4xMDEyIDIuMTA4OSAzLjQ1NTIgMy40NjgxLTMuOTIyMSAzLjg4OTggMi4xMDEyIDIuMTA4OSAzLjg3NTQtMy45MzY3IDMuOTIyMSAzLjkzNjctMy45MjIxIDMuODg5OCAyLjEwMTIgMi4xMDg5IDMuODc1NC0zLjkzNjcgMy40NTUyIDMuNDY4MSAyLjEwMTItMi4xMDg5LTEuNDk0Mi0xLjQ5OTcgMi4yNDEyLTIuMjQ5NmMxLjE5NTQtMS4xOTk3IDEuMTk1NC0yLjk3MTIgMC00LjE3MTFsLTIuODQ4Mi0yLjg1ODggMy43MzU0LTMuNzQ5Mi0yLjEwMTItMi4xMDg5LTMuNzM1NCAzLjc0OTItMi44NDgyLTIuODU4OGMtMC41OTc2NS0wLjU5OTg4LTEuMzA3NC0wLjg5MDQ1LTIuMDU0NC0wLjg5MDQ1em0tMTUuNTQ5IDExLjM4OC0yLjEwMTIgMi4xMDg5IDEuNDk0MiAxLjQ5OTctMi4xMDEyIDIuMTA4OWMtMS4xOTUzIDEuMTk5Ny0xLjE5NTMgMi45NzEyIDAgNC4xNzExbDIuODQ4MiAyLjg1ODgtMy43MzU0IDMuNzQ5MiAyLjEwMTIgMi4xMDg5IDMuNzM1NC0zLjc0OTIgMi44NDgyIDIuODU4OGMxLjE5NTQgMS4xOTk3IDIuOTYwMiAxLjE5OTcgNC4xNTU2IDBsMi4xMDEyLTIuMTA4OSAxLjQ5NDIgMS40OTk3IDIuMTAxMi0yLjEwODl6IiBmaWxsPSIjZmZiNDE0IiBzdHJva2U9IiM5MTYzMDAiIHN0cm9rZS13aWR0aD0iMS40OTY5IiBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lIi8+Cjwvc3ZnPgo=';

var a=0;
var b = new Block(charM1);  // Zugriff auf block.js Datei
var c=127; 
var d;
var i=0;

var f=0;


class Scratch3FtBlocks {
	
	setButton(state, msg=null) {
		button = document.getElementById(FT_BUTTON_ID).addEventListener("click", knopf);
	}
	
	addButton(initial = true) {
	//  check if the button already exists
	button = document.getElementById(FT_BUTTON_ID);
	
	if(button == undefined) {
	    x = document.getElementsByClassName(PARENT_CLASS);
	    if(x.length > 0) {
		var x;
		x[0]=1;
		hdrdiv = x[0];
		img = document.createElement("IMG");
		img.classList.add("green-flag_green-flag_1kiAo");
		img.setAttribute("draggable", false);
		img.setAttribute("id", FT_BUTTON_ID);
		img.setAttribute("src", ftDisconnectedIcon);
		img.setAttribute("height", "32px");
		//img.setAttribute("", "50%");
		
		hdrdiv.appendChild(img);

		// the scratch3 gui will remove our button e.g. when the
		// language is being changed. We need to restore it then
		//if(initial)
		   // setInterval(() => this.addButton(false), 1000);
		//else
		this.setButton(this.button_state, this.error_msg);
	    } //else
		//alert("ftDuino: controls-container class not found!");
	}
    }

    constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    
		// this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
		this.addButton();
		//this.setButton(0, "");
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
        return {
            id: EXTENSION_ID,
            name: 'fischertechnik',
            blockIconURI: blockIconURI,
	    	showStatusButton: false,
	    	docsURI: 'https://technika-karlsruhe.github.io/',


	   	blocks: [
        	b.getBlock(),
			b.getBlock_setLamp(),
			b.getBlock_doSetMotorSpeed(),
			b.getBlock_doSetMotorSpeedDir(),
			b.getBlock_doSetMotorDir(),
			b.getBlock_doStopMotor(),
			{
				opcode: 'hat',
				blockType: BlockType.COMMAND,
				text: "Motor",
			},
			{
				opcode: 'Motor',
				blockType: BlockType.HAT,
				text: "Motor",
			},
			{
				opcode: 'input',
				text: 'set [INPUT]',
				blockType: BlockType.EVENT,
				arguments: {
					INPUT: {
						type: ArgumentType.STRING, 
						menu: 'INPUT',
						defaultValue: 'o1'
					},     
				}
			}
        ],

        menus: {
            
                ONOFFSTATE: [
					b.getMenu()
				],
				outputID: [
					{text: 'O1', value: 'o1'} ,
					{text: 'O2', value: 'o2'}
					],
                inputID: [
	 				{text: 'O1', value: 'o1'}, {text: 'O2', value: 'o2'},
		    		{text: 'O3', value: 'o3'}, {text: 'O4', value: 'o4'}
				],
				inputModes: [
					{text: 'Digital voltage', value: 'd10v'}, {text: 'Digital resistance', value: 'd5k'},
		    		{text: 'Analogue voltage', value: 'a10v'}, {text: 'Analogue resistance', value: 'a5k'}
				],
				inputAnalogSensorTypes: [
					{text: 'Color Sensor', value: 'sens_color'}, {text: 'NTC Resistor', value: 'sens_ntc'},
		    		{text: 'Photo Resistor', value: 'sens_photo'}
				],
				inputDigitalSensorTypes: [
					{text: 'Button', value: 'sens_button'}, {text: 'Light barrier', value: 'sens_lightBarrier'},
		    		{text: 'Reed contact', value: 'sens_reed'}, {text: 'Trail Sensor', value:'sens_trail'}
				],
				inputDigitalSensorChangeTypes: [
					{text: 'open', value: 'open'}, {text: 'closed', value: 'closed'}
				], 
				motorDirection: [
					{text: 'forward', value: '1'}, {text: 'backwards', value: '-1'}
				]
	    }
        };
    }


	hat1(args) {
		if(a==5){
			alert(a);
			a=a+1;
		}
	}

	doSetLamp(args){
		console.log("OUTPUT",args, args.OUTPUT);
		if(args.OUTPUT=='o1'){
			charM1.writeValue(new Uint8Array([args.NUM*15.875]));
		}else{
			charM2.writeValue(new Uint8Array([args.NUM*15.875]));
		}
	}

	doSetMotorSpeed(args) {
		if(args.MOTOR_ID=='o1'){
			charM1.writeValue(new Uint8Array([args.SPEED*15.875]));
		}else{
			charM2.writeValue(new Uint8Array([args.SPEED*15.875]));
		}
    }

    doSetMotorSpeedDir(args) {
        if(args.MOTOR_ID=='o1'){
			charM1.writeValue(new Uint8Array([args.SPEED*15.875*parseInt(args.DIRECTION)]));
		}else{
			charM2.writeValue(new Uint8Array([args.SPEED*15.875*parseInt(args.DIRECTION)]));
		}
    }

	doSetMotorDir(args) {
        return this._device.doSetMotorDir(
            Cast.toNumber(args.MOTOR_ID),
            Cast.toNumber(args.DIRECTION)
        );
    }

    doStopMotor(args) {
        return this._device.doSetMotorSpeed(
            Cast.toNumber(args.MOTOR_ID),
            0
        );
    }

	hat(args) {
		 d.writeValue(new Uint8Array([c]));
	}

	output (args, util, name) {
        console.log("OUTPUT", args, util);
        charM1.writeValue(new Uint8Array([127]));
        return 42; 
    }

    input (args){
		d.writeValue(new Uint8Array([1]));
	}
}

module.exports = Scratch3FtBlocks;
