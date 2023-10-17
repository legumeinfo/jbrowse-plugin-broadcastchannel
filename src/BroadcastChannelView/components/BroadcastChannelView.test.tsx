import React from 'react'
import { render, fireEvent, waitFor, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BroadcastChannelView from './BroadcastChannelView'

describe('<BroadcastChannelView />', () => {
  it('Broadcast Channel settings', async () => {
    render(<BroadcastChannelView />)

    expect(screen.getByRole('heading')).toHaveTextContent(
      'Broadcast Channel',
    )

    fireEvent.click(screen.getByText('Push the button'))
    const element = await waitFor(() =>
      screen.getByText('You pushed the button!'),
    )
    expect(element).toBeTruthy()
  })
})

