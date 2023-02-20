/*
  scratch3_ft/index.js
  get info method is called by scratch upon opening the extensions menu. Once the extension called BT-Smart is opened a 
  connection can be established to a fischertechnik BT-Smart controller by clicking the orange connect button. Then, holt the red "Select"-Button
  on the BT-Smart until the blinking blue LED blinks with a much higher frequency. You should see the right controller now in the bluetooth connection 
  window of the browser. Select and pair our controller. Wait until the LED on the BT-Smart turns orange. Depending on whether you allowed notifications,
  you will either receive a notification or an alert when the connection is finished and the controller ready to be used.

  Currently only English and German translations are available.

*/
const ArgumentType = require('../../extension-support/argument-type');
const BlockType = require('../../extension-support/block-type');
const Cast = require('../../util/cast');
const Block = require('../scratch3_ft/block');
const Translation = require('../scratch3_ft/translation');
const formatMessage = require('format-message');
const BLEDevice = require('../scratch3_ft/bluetoothcontrol.js');
const USBDevice = require('../scratch3_ft/usbcontrol.js');
const blockIconURI = require('../scratch3_ft/btsmart_small.png');
const PARENT_CLASS = "controls_controls-container_3ZRI_";
const FT_BUTTON_ID = "ft_connect_button";
const ftConnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjguODQyIDEuMDU2Ny01LjIzMDIgNS4yMzAyLTIuODQ4Ni0yLjg0ODZjLTEuMTk1NS0xLjE5NTUtMi45NjA3LTEuMTk1NS00LjE1NjEgMGwtMy43MzU4IDMuNzM1OC0xLjQ5NDMtMS40OTQzLTIuMTAxNCAyLjEwMTQgMTQuOTQzIDE0Ljk0MyAyLjEwMTQtMi4xMDE0LTEuNDk0My0xLjQ5NDMgMy43MzU4LTMuNzM1OGMxLjE5NTUtMS4xOTU1IDEuMTk1NS0yLjk2MDYgMC00LjE1NjFsLTIuODQ4Ni0yLjg0ODYgNS4yMzAyLTUuMjMwMnptLTIxLjIwMSA4LjM1ODktMi4xMDE0IDIuMTAxNCAxLjQ5NDMgMS40OTQzLTMuNTk1NyAzLjU5NTdjLTEuMTk1NSAxLjE5NTUtMS4xOTU1IDIuOTYwNyAwIDQuMTU2MWwyLjg0ODYgMi44NDg2LTUuMjMwMiA1LjIzMDIgMi4xMDE0IDIuMTAxNCA1LjIzMDItNS4yMzAyIDIuODQ4NiAyLjg0ODZjMS4xOTU1IDEuMTk1NSAyLjk2MDcgMS4xOTU1IDQuMTU2MSAwbDMuNTk1Ny0zLjU5NTcgMS40OTQzIDEuNDk0MyAyLjEwMTQtMi4xMDE0eiIgZmlsbD0iIzFhZmYxNCIgb3ZlcmZsb3c9InZpc2libGUiIHN0cm9rZT0iIzAyOTEwMCIgc3Ryb2tlLXdpZHRoPSIxLjQ5NDMiIHN0eWxlPSJ0ZXh0LWluZGVudDowO3RleHQtdHJhbnNmb3JtOm5vbmUiLz4KPC9zdmc+Cg==';
const ftNoWebUSBIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjQuOTg3IDEuMjMwMi05LjA4MTggOS4yMDU5LTkuMDIyOC05LjE5ODItNS41NTg0IDUuNDgwOCA5LjA5OSA5LjI3NDYtOS4xNTggOS4yODIyIDUuNTQ1IDUuNDk2IDkuMDc5OS05LjIwNTkgOS4wODk1IDkuMjY1IDUuNTU4NC01LjQ4MDgtOS4xNjM3LTkuMzQxNCA5LjE1NjEtOS4yODIyeiIgY29sb3I9IiMwMDAwMDAiIGNvbG9yLXJlbmRlcmluZz0iYXV0byIgZG9taW5hbnQtYmFzZWxpbmU9ImF1dG8iIGZpbGw9IiNmZjE0MTQiIGZpbGwtcnVsZT0iZXZlbm9kZCIgaW1hZ2UtcmVuZGVyaW5nPSJhdXRvIiBzaGFwZS1yZW5kZXJpbmc9ImF1dG8iIHNvbGlkLWNvbG9yPSIjMDAwMDAwIiBzdHJva2U9IiM3MDAwMDAiIHN0cm9rZS13aWR0aD0iMS40NjM4IiBzdHlsZT0iZm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtcG9zaXRpb246bm9ybWFsO2lzb2xhdGlvbjphdXRvO21peC1ibGVuZC1tb2RlOm5vcm1hbDtzaGFwZS1wYWRkaW5nOjA7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1pbmRlbnQ6MDt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO3RleHQtdHJhbnNmb3JtOm5vbmU7d2hpdGUtc3BhY2U6bm9ybWFsIi8+Cjwvc3ZnPgo=';
const ftDisconnectedIcon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CjxtZXRhZGF0YT4KPHJkZjpSREY+CjxjYzpXb3JrIHJkZjphYm91dD0iIj4KPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CjxkYzp0eXBlIHJkZjpyZXNvdXJjZT0iaHR0cDovL3B1cmwub3JnL2RjL2RjbWl0eXBlL1N0aWxsSW1hZ2UiLz4KPGRjOnRpdGxlLz4KPC9jYzpXb3JrPgo8L3JkZjpSREY+CjwvbWV0YWRhdGE+CjxzdHlsZT4uc3Qye2ZpbGw6cmVkfS5zdDN7ZmlsbDojZTBlMGUwfS5zdDR7ZmlsbDpub25lO3N0cm9rZTojNjY2O3N0cm9rZS13aWR0aDouNTtzdHJva2UtbWl0ZXJsaW1pdDoxMH08L3N0eWxlPgo8cGF0aCBkPSJtMjAuMjAyIDAuOTQ3NWMtMC43NDcwNyAwLTEuNTAzNCAwLjI5MDU2LTIuMTAxMiAwLjg5MDQ1bC0yLjI0MTIgMi4yNDk2LTEuNDk0Mi0xLjQ5OTctMi4xMDEyIDIuMTA4OSAzLjQ1NTIgMy40NjgxLTMuOTIyMSAzLjg4OTggMi4xMDEyIDIuMTA4OSAzLjg3NTQtMy45MzY3IDMuOTIyMSAzLjkzNjctMy45MjIxIDMuODg5OCAyLjEwMTIgMi4xMDg5IDMuODc1NC0zLjkzNjcgMy40NTUyIDMuNDY4MSAyLjEwMTItMi4xMDg5LTEuNDk0Mi0xLjQ5OTcgMi4yNDEyLTIuMjQ5NmMxLjE5NTQtMS4xOTk3IDEuMTk1NC0yLjk3MTIgMC00LjE3MTFsLTIuODQ4Mi0yLjg1ODggMy43MzU0LTMuNzQ5Mi0yLjEwMTItMi4xMDg5LTMuNzM1NCAzLjc0OTItMi44NDgyLTIuODU4OGMtMC41OTc2NS0wLjU5OTg4LTEuMzA3NC0wLjg5MDQ1LTIuMDU0NC0wLjg5MDQ1em0tMTUuNTQ5IDExLjM4OC0yLjEwMTIgMi4xMDg5IDEuNDk0MiAxLjQ5OTctMi4xMDEyIDIuMTA4OWMtMS4xOTUzIDEuMTk5Ny0xLjE5NTMgMi45NzEyIDAgNC4xNzExbDIuODQ4MiAyLjg1ODgtMy43MzU0IDMuNzQ5MiAyLjEwMTIgMi4xMDg5IDMuNzM1NC0zLjc0OTIgMi44NDgyIDIuODU4OGMxLjE5NTQgMS4xOTk3IDIuOTYwMiAxLjE5OTcgNC4xNTU2IDBsMi4xMDEyLTIuMTA4OSAxLjQ5NDIgMS40OTk3IDIuMTAxMi0yLjEwODl6IiBmaWxsPSIjZmZiNDE0IiBzdHJva2U9IiM5MTYzMDAiIHN0cm9rZS13aWR0aD0iMS40OTY5IiBzdHlsZT0idGV4dC1pbmRlbnQ6MDt0ZXh0LXRyYW5zZm9ybTpub25lIi8+Cjwvc3ZnPgo=';
var b = new Block();  // access block.js 
var translate = new Translation();
var controller;
var connection='BLE';
var notis  //Permission and API supported--> 0 cant be used(not granted or supported); 1 API supported; 2 supported and Permission granted--> can be used

/**
 * Icon svg to be displayed at the left edge of each extension block, encoded as a data URI.
 * @type {string}
 */
// eslint-disable-next-line max-len
//const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjQwcHgiCiAgIGhlaWdodD0iNDBweCIKICAgdmlld0JveD0iMCAwIDQwIDQwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczMiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXczNCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxNi41NSIKICAgICBpbmtzY2FwZTpjeD0iMTkuOTY5Nzg5IgogICAgIGlua3NjYXBlOmN5PSIyNC44MzM4MzciCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJldjMiIC8+CiAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZXYzLWJsb2NrLWljb248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2M0Ij5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZGVmcwogICAgIGlkPSJkZWZzNiIgLz4KICA8ZwogICAgIGlkPSJldjMtYmxvY2staWNvbiIKICAgICBzdHJva2U9Im5vbmUiCiAgICAgc3Ryb2tlLXdpZHRoPSIxIgogICAgIGZpbGw9Im5vbmUiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnCiAgICAgICBpZD0iZXYzIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS41MDAwMDAsIDMuNTAwMDAwKSIKICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgIDxyZWN0CiAgICAgICAgIGlkPSJSZWN0YW5nbGUtcGF0aCIKICAgICAgICAgc3Ryb2tlPSIjN0M4N0E1IgogICAgICAgICBmaWxsPSIjRkZGRkZGIgogICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgIHg9IjAuNSIKICAgICAgICAgeT0iMy41OSIKICAgICAgICAgd2lkdGg9IjI4IgogICAgICAgICBoZWlnaHQ9IjI1LjgxIgogICAgICAgICByeD0iMSIKICAgICAgICAgc3R5bGU9ImZpbGw6IzAwMDBmZjtzdHJva2U6IzAwMDA4MCIgLz4KICAgICAgPHRleHQKICAgICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToyMS4zMzMzcHg7bGluZS1oZWlnaHQ6MTAwJTtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7dGV4dC1hbGlnbjpjZW50ZXI7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7dGV4dC1hbmNob3I6bWlkZGxlO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgIHg9IjEzLjQ3MjgwOSIKICAgICAgICAgeT0iMjQuNjU3MDk5IgogICAgICAgICBpZD0idGV4dDE2MzMiPjx0c3BhbgogICAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgICAgaWQ9InRzcGFuMTYzMSIKICAgICAgICAgICB4PSIxMy40NzI4MDkiCiAgICAgICAgICAgeT0iMjQuNjU3MDk5Ij5mdDwvdHNwYW4+PC90ZXh0PgogICAgPC9nPgogIDwvZz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE4NTEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+ZXYzLWJsb2NrLWljb248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=='

/**
 * Class for the ft blocks in Scratch 3.0
 * const blockIconURI = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9IjQwcHgiCiAgIGhlaWdodD0iNDBweCIKICAgdmlld0JveD0iMCAwIDQwIDQwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczMiIKICAgc29kaXBvZGk6ZG9jbmFtZT0ibG9nby5zdmciCiAgIGlua3NjYXBlOnZlcnNpb249IjEuMS4yICgwYTAwY2Y1MzM5LCAyMDIyLTAyLTA0KSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOmNjPSJodHRwOi8vY3JlYXRpdmVjb21tb25zLm9yZy9ucyMiCiAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldwogICAgIGlkPSJuYW1lZHZpZXczNCIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiM2NjY2NjYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMS4wIgogICAgIGlua3NjYXBlOnBhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAuMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIgogICAgIHNob3dncmlkPSJmYWxzZSIKICAgICBpbmtzY2FwZTp6b29tPSIxNi41NSIKICAgICBpbmtzY2FwZTpjeD0iMTkuOTY5Nzg5IgogICAgIGlua3NjYXBlOmN5PSIyNC44MzM4MzciCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjExNDEiCiAgICAgaW5rc2NhcGU6d2luZG93LXg9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LXk9IjAiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJldjMiIC8+CiAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA1MC4yICg1NTA0NykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgPHRpdGxlCiAgICAgaWQ9InRpdGxlMiI+ZXYzLWJsb2NrLWljb248L3RpdGxlPgogIDxkZXNjCiAgICAgaWQ9ImRlc2M0Ij5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICA8ZGVmcwogICAgIGlkPSJkZWZzNiIgLz4KICA8ZwogICAgIGlkPSJldjMtYmxvY2staWNvbiIKICAgICBzdHJva2U9Im5vbmUiCiAgICAgc3Ryb2tlLXdpZHRoPSIxIgogICAgIGZpbGw9Im5vbmUiCiAgICAgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgIDxnCiAgICAgICBpZD0iZXYzIgogICAgICAgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNS41MDAwMDAsIDMuNTAwMDAwKSIKICAgICAgIGZpbGwtcnVsZT0ibm9uemVybyI+CiAgICAgIDxyZWN0CiAgICAgICAgIGlkPSJSZWN0YW5nbGUtcGF0aCIKICAgICAgICAgc3Ryb2tlPSIjN0M4N0E1IgogICAgICAgICBmaWxsPSIjRkZGRkZGIgogICAgICAgICBzdHJva2UtbGluZWNhcD0icm91bmQiCiAgICAgICAgIHN0cm9rZS1saW5lam9pbj0icm91bmQiCiAgICAgICAgIHg9IjAuNSIKICAgICAgICAgeT0iMy41OSIKICAgICAgICAgd2lkdGg9IjI4IgogICAgICAgICBoZWlnaHQ9IjI1LjgxIgogICAgICAgICByeD0iMSIKICAgICAgICAgc3R5bGU9ImZpbGw6IzAwMDBmZjtzdHJva2U6IzAwMDA4MCIgLz4KICAgICAgPHRleHQKICAgICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToyMS4zMzMzcHg7bGluZS1oZWlnaHQ6MTAwJTtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7dGV4dC1hbGlnbjpjZW50ZXI7bGV0dGVyLXNwYWNpbmc6MHB4O3dvcmQtc3BhY2luZzowcHg7dGV4dC1hbmNob3I6bWlkZGxlO2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MXB4O3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICAgIHg9IjEzLjQ3MjgwOSIKICAgICAgICAgeT0iMjQuNjU3MDk5IgogICAgICAgICBpZD0idGV4dDE2MzMiPjx0c3BhbgogICAgICAgICAgIHNvZGlwb2RpOnJvbGU9ImxpbmUiCiAgICAgICAgICAgaWQ9InRzcGFuMTYzMSIKICAgICAgICAgICB4PSIxMy40NzI4MDkiCiAgICAgICAgICAgeT0iMjQuNjU3MDk5Ij5mdDwvdHNwYW4+PC90ZXh0PgogICAgPC9nPgogIDwvZz4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGE4NTEiPgogICAgPHJkZjpSREY+CiAgICAgIDxjYzpXb3JrCiAgICAgICAgIHJkZjphYm91dD0iIj4KICAgICAgICA8ZGM6dGl0bGU+ZXYzLWJsb2NrLWljb248L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KPC9zdmc+Cg=='

 * @constructor
 */

const EXTENSION_ID = 'ft';

function knopf() {//function of connect button
	if(img.getAttribute("src")== ftConnectedIcon){
		controller.disconnect();
	}else{
		if(confirm('Connect via USB?\nOk = USB / Abbrechen = Bluetooth')){
			connection='USB'
			controller= new USBDevice()
		}else{
			controller= new BLEDevice()
		}
		controller.controllertype='BT'; 
		controller.connect.then(device=> {
			console.log(device);
		img.setAttribute("src", ftConnectedIcon);
		if(connection=='USB'){
			navigator.usb.addEventListener('disconnect', onDisconnected);
		}else{
			device.addEventListener('gattserverdisconnected', onDisconnected);
		}
		if(notis==2){
			const greeting = new Notification('The controller is connected',{
				body: 'You can start now',
			})
		}else{
			alert("The controller is now connected")
		}
		}).catch(error => {
			console.log("Error: " + error);
			if(error == "NotFoundError: Web Bluetooth API globally disabled."){
				img.setAttribute("src", ftNoWebUSBIcon);
				alert("Error: " + error)
			}
			if(notis==2){
				const greeting = new Notification('The controller is connected',{
					body: 'You can start now',
				})
			}else{
				alert("The controller is now connected")
			}

			/*}).catch(error => {
					console.log("Error: " + error);
					if(error == "NotFoundError: Web Bluetooth API globally disabled."){
						img.setAttribute("src", ftNoWebUSBIcon);
						alert("Error: " + error)
					}*/
				})
	}
}

function onDisconnected(event) {
	connection='BLE'
	const device = event.target;
	console.log(`Device ${device.name} is disconnected.`);
	console.log(notis);
	img.setAttribute("src", ftDisconnectedIcon);
	controller='disconnected'
	if(notis==2){
		const disconnect = new Notification('The controller is disconnected',{
			body: 'try reconnecting by clicking the connect button in the right upper corner',
		})
	}else{
		alert(`Device ${device.name} is disconnected.`);
	}
}


class Scratch3FtBlocks {
	constructor (runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
		this.runtime.on('PROJECT_STOP_ALL', this.reset.bind(this));
    
		// this.runtime.registerPeripheralExtension(EXTENSION_ID, this);
		this.addButton();
		//tryautoconnect();
		
		//this.setButton(0, "");
    }
	
	
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
			img.setAttribute("width", "32px");
			img.setAttribute("title", "Connect");
			img.style.borderRadius = "0.25rem"; //rounding of the background when hovering over it
			img.style.padding = "0.30rem";
			img.addEventListener("mouseover", mouseOver, false);
			img.addEventListener("mouseout", mouseOut, false);
			function mouseOver()
			{
				img.style.backgroundColor = 'hsla(215, 100%, 65%, 0.15)';
			}
			function mouseOut()
			{
				img.style.backgroundColor = 'transparent';
			}
			img.style.cursor = "pointer"; //kind of mouse when hovering over it
			img.style.marginLeft = '1px'; //distance between the stop button and the connect button
			hdrdiv.appendChild(img);

			// the scratch3 gui will remove our button e.g. when the
			// language is being changed. We need to restore it then
			if(initial){
				setInterval(() => this.addButton(false), 1000);
				this.setButton(this.button_state, this.error_msg);
			}
			else
			this.setButton(this.button_state, this.error_msg);
			} else
			alert("ft: controls-container class not found!");
		}
    }

    
    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo () {
		if(!("Notification" in window)){
			notis=0
		}else{
			notis=1
		}
		if(notis==1){
			Notification.requestPermission().then(x=>{
				if(Notification.permission == "granted"){
					notis=2
				}
			})
		}
		translate.setup(); // setup translation
		b.setup(); // setup translation for blocks
        return {
            id: EXTENSION_ID,
            name: 'BT-Smart',
            blockIconURI: blockIconURI,
	    	showStatusButton: false,
	    	docsURI: 'https://technika-karlsruhe.github.io/',


			blocks: [
				b.getBlock_onOpenClose(),
				b.getBlock_onInput(),
				b.getBlock_getSensor(),
				b.getBlock_isClosed(),
				b.getBlock_dosetLamp(),
				b.getBlock_doSetOutput(),
				b.getBlock_doConfigureInput(),
				b.getBlock_doSetMotorSpeed(),
				b.getBlock_doSetMotorSpeedDir(),
				b.getBlock_doSetMotorDir(),
				b.getBlock_doStopMotor(),
			],

			menus: {
				outputID: [
					{text: 'M1', value: '0'},
					{text: 'M2', value: '1'}
				],
				inputID: [
					{text: 'I1', value: '2'}, {text: 'I2', value: '3'},
					{text: 'I3', value: '4'}, {text: 'I4', value: '5'}
				],
				inputModes: [
					{text: translate._getText('Digitalvoltage',this.locale), value: 'd10v'}, {text:  translate._getText('Digitalresistance',this.locale), value: 'd5k'},
					{text: translate._getText('Analoguevoltage',this.locale), value: 'a10v'}, {text: translate._getText('Analogueresistance',this.locale), value: 'a5k'}
				],
				inputAnalogSensorTypes: [
					{text: translate._getText('ColorSensor'), value: 'sens_color'}, {text: translate._getText('NTCResistor'), value: 'sens_ntc'},
					{text: translate._getText('PhotoResistor'), value: 'sens_photo'}
				],
				inputDigitalSensorTypes: [
					{text: translate._getText('Button'), value: 'sens_button'}, {text: translate._getText('Lightbarrier'), value: 'sens_lightBarrier'},
					{text: translate._getText('Reedcontact'), value: 'sens_reed'}, {text: translate._getText('TrailSensor'), value:'sens_trail'}
				],
				inputDigitalSensorChangeTypes: [
					{text: translate._getText('Open'), value: 'open'}, {text: translate._getText('Closed'), value: 'closed'}
				], 
				motorDirection: [
					{text: translate._getText('Forward'), value: '1'}, {text: translate._getText('Backwards'), value: '-1'}
				],
				compares: ['<', '>']
			}
        };
    }
	
	onOpenClose(args){
		if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_button'||args.SENSOR=='sens_lightBarrier'||args.SENSOR=='sens_reed')){ // check if the mode has to be changed 
			controller.setchanging(parseInt(args.INPUT), true);// überarbeiten !!!!!
		}
		if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a && args.SENSOR=='sens_trail'){
			controller.setchanging(parseInt(args.INPUT), true);
		} 
		
		if (controller.getchanging(parseInt(args.INPUT))==true){ // if something must be changed 
			controller.changeInMode (args)
			/*if (controller.getfuncstate()==0){ // already changing?
				//controller.setfuncstate(1); 
				return false;
			}else { */
				if(controller.getnumruns(parseInt(args.INPUT))<100){ // if we run into any uexpected problems with the changing process 
					controller.setnumruns(parseInt(args.INPUT),controller.getnumruns(parseInt(args.INPUT))+1);
					console.log(controller.getnumruns(parseInt(args.INPUT))+'num')
				}else{
					controller.setnumruns(parseInt(args.INPUT),0); // restart the changing 
					controller.setfuncstate(parseInt(args.INPUT),0);
					controller.setchanging(parseInt(args.INPUT), false);
				}
			return false;
			//}
		}else {// normal Hat function 
			console.log(controller.getvalIn(parseInt(args.INPUT))+'in')
			if(args.OPENCLOSE=='closed'){
				if(controller.getvalIn(parseInt(args.INPUT))!=255){
					return true;
				}else return false;
			}else {
				if(controller.getvalIn(parseInt(args.INPUT))==255){
					return true;
				}else return false;
			}
		}
	}

	onInput(args) { // SENSOR, INPUT, OPERATOR, VALUE
		if(controller.getvalWrite(parseInt(args.INPUT))!=0x0b && (args.SENSOR=='sens_ntc'||args.SENSOR=='sens_photo')){ // check if the mode has to be changed 
			controller.setchanging(parseInt(args.INPUT), true);
		}
		if (controller.getvalWrite(parseInt(args.INPUT))!=0x0a &&args.SENSOR=='sens_color'){
			controller.setchanging(parseInt(args.INPUT),true);
		}
		if (controller.getchanging(parseInt(args.INPUT))==true){ // if something must be changed 
			controller.changeInMode (args)
			//if (controller.getfuncstate(1)==0){ // already changing?
				//controller.setfuncstate2(1); 
				
				//return false;
			//}else {
				if(controller.getnumruns(parseInt(args.INPUT)<100)){ // if we run into any uexpected problems with the changing process 
					controller.setnumruns(parseInt(args.INPUT), controller.getnumruns(1)+1);
				}else{
					controller.setnumruns(parseInt(args.INPUT), 0); // restart the changing 
					controller.setfuncstate(parseInt(args.INPUT), 0);
					controller.setchanging(parseInt(args.INPUT),false);	
				}
				return false;
			//}
		}else{
	   		if(args.OPERATOR=='<'){
				if(controller.getvalIn(parseInt(args.INPUT))<args.VALUE){
					return true;
				}else return false;
			} else{
				if(controller.getvalIn(parseInt(args.INPUT))>args.VALUE){
					return true;
				}else return false;
			}
		}
	}

	getSensor(args) {
        // SENSOR, INPUT
		//-->set input to right mode and read afterwards
		//needs change I mOde 
		switch(args.SENSOR) {
			case 'sens_color':
				controller.write_Value(parseInt(args.INPUT) ,0x0a);
				break;
			case 'sens_ntc':
				controller.write_Value(parseInt(args.INPUT),0x0b);
				break;
			case 'sens_photo':
				controller.write_Value(parseInt(args.INPUT),0x0b);
				break;
		}
        return controller.getvalIn(parseInt(args.INPUT));
    }

	isClosed(args) { // --> benötigt noch eine changeIMode funktion 
       	// SENSOR, INPUT
		var x=controller.getvalIn(parseInt(args.INPUT))	
		console.log(x)
		return x!=255
    }

	doSetLamp(args){
		controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875);
    }

	doSetOutput(args) {
		controller.write_Value(parseInt(args.OUTPUT), args.NUM*15.875);
    }

	doConfigureInput(args) { 
       	if(args.MODE=='d10v'||args.MODE=='a10v'){
			controller.write_Value(parseInt(args.INPUT), 0x0a);
	   	}else{
			controller.write_Value(parseInt(args.INPUT), 0x0b);
		}
	}

	doSetMotorSpeed(args) {
		controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875);
    }

    doSetMotorSpeedDir(args) {
		controller.write_Value(parseInt(args.MOTOR_ID), args.SPEED*15.875*parseInt(args.DIRECTION));	
    }

	doSetMotorDir(args) { 
		var flex=0;
		if (controller.getstor(parseInt(args.MOTOR_ID)).length>0){ // check if values for the output are in the queue
			flex=controller.getstor(parseInt(args.MOTOR_ID))[controller.getstor(parseInt(args.MOTOR_ID)).length-1];// if yes save the last output value 
		}else{
			flex=controller.getvalWrite(parseInt(args.MOTOR_ID)); // if not safe the current one
		}
		if((args.DIRECTION=='1'&&flex<0)||(args.DIRECTION=='-1'&&flex>0)){// check if direction change is necessary 
			controller.write_Value(parseInt(args.MOTOR_ID), flex*-1); // if yes, change direction
		}
    }

    doStopMotor(args) {
		controller.write_Value(parseInt(args.MOTOR_ID), 0)
    }

	reset() {
		if(img.getAttribute("src")== ftConnectedIcon) {
			controller.write_Value(parseInt(0), 0*15.875);
			controller.write_Value(parseInt(1), 0*15.875);
			numruns = 0;
			numruns2 = 0;
			stor = Array();
		}
	}
}

module.exports = Scratch3FtBlocks;
