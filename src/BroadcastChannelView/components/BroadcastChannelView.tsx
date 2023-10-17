import React, { useState } from 'react'

export default function ReactComponent(initialState) {
  const [channel, setChannel] = useState(initialState.model.channel)
  const [communicate, setCommunicate] = useState(initialState.model.communicate)
  return (
    <div style={{ padding: 8 }}>
      <h3>BroadcastChannel settings</h3>

      <label><input type="checkbox" name="communicate" defaultChecked={ communicate }
        onChange = {e => {
          setCommunicate(e.target.checked)
          initialState.model.doSetCommunicate(e.target.checked)
        }}
      />Connect</label>
      <p></p>
      <label>Channel: <input type="text" name="channel" defaultValue={ channel }
        onChange = {e => {
          setChannel(e.target.value)
          initialState.model.doSetChannel(e.target.value)
        }}
      /></label>
      <p style={{ backgroundColor: communicate ? '#cbe9d2' : '#fff2c2', width: 192, textAlign: 'center', padding: 5 }}>
        { communicate ? 'Connected to ' + channel : 'Not connected' }
      </p>

    </div>
  )
}

